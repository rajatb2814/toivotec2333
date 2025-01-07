import json
import requests

from django.core import signing
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect, HttpResponseBadRequest
from django.contrib.auth import login
from django.shortcuts import redirect

from zango.apps.appauth.models import UserRoleModel
from zango.apps.shared.tenancy.models import ThemesModel
from zango.core.utils import get_package_url
from zango.apps.appauth.models import AppUserModel

from .utils import ZelthyLoginView, get_domain_url
from .forms import (
    AppLoginForm,
    UserRoleSelectionForm,
    AppUserResetPasswordForm,
)
from ..configure.models import GenericLoginConfigModel

USER_AUTH_BACKEND = "zango.apps.appauth.auth_backend.AppUserModelBackend"


@method_decorator(never_cache, name="dispatch")
class AppUserLoginView(ZelthyLoginView):
    """
    View to render the login page html.
    """

    template_name = "login/login.html"  # To be updated with new html

    userrolemodel = UserRoleModel


    form_list = (
        ("auth", AppLoginForm),
        ("user_role", UserRoleSelectionForm),
        ("password_reset", AppUserResetPasswordForm),
    )

    def get_template_names(self):
        templates = ["custom_login.html"] + super().get_template_names()
        return templates

    def get_config_from_oidc(self, providers):

        data = ""
        domain_url = get_domain_url(self.request)

        # Extract provider slugs
        provider_slugs = [provider["slug"] for provider in providers]

        # Construct query parameters with the same name for each slug
        query_params = '&'.join([f"providers={slug}" for slug in provider_slugs])
        url = f"{domain_url}/openid/openid-config/?{query_params}"
        
        try:
            response = requests.get(url)           
            result = response.json()  

            if result.get('data'):
                data = result.get('data')
        except Exception as e:
            import traceback
            print(traceback.format_exc())  # Print any exceptions for debugging
            return HttpResponseBadRequest("Bad request")
        return data
        
        

    def get_context_data(self, **kwargs):
        context = super(AppUserLoginView, self).get_context_data(**kwargs)
        context["tenant"] = self.request.tenant
        context["tenant_logo"] = (
            self.request.build_absolute_uri(self.request.tenant.logo.url)
            if self.request.tenant.logo
            else None
        )
        app_theme_config = ThemesModel.objects.filter(
            tenant=self.request.tenant, is_active=True
        ).first()
        if app_theme_config:
            context["app_theme_config"] = app_theme_config.config

        generic_config = GenericLoginConfigModel.objects.last()
        if generic_config:
            context["generic_config"] = generic_config.config or {}
            context["generic_config_logo"] = (
                self.request.build_absolute_uri(generic_config.logo.url)
                if generic_config.logo
                else None
            )
            context["background_image"] = (
                self.request.build_absolute_uri(generic_config.background_image.url)
                if generic_config.background_image
                else None
            )
            
            if generic_config.config.get('oidc') == "Yes":
                domain_url = get_domain_url(self.request)
                providers = generic_config.config.get('oidc_provider')
                configs = self.get_config_from_oidc(providers)
                for pv in configs:
                    pv['url'] = f"{domain_url}{pv.get('url')}{pv.get('slug')}/?redirect_url=/login/sso/"
        
                context["providersList"] = configs
        return context

    def get_form_initial(self, step):
        initial = super(AppUserLoginView, self).get_form_initial(step)
        initial["request"] = self.request
        return initial

    def get_user(self):
        self.user_cache = super(AppUserLoginView, self).get_user()
        return self.user_cache

    def post(self, *args, **kwargs):
        if (
            self.request.POST.get("app_user_login_view-current_step") == "auth"
            and self.request.POST.get("auth-saml", "0") != "0"
        ):
            url = get_package_url(
                self.request, f"saml/fetch_saml_config/?action=fetch_config", "sso"
            )
            response = requests.post(
                url,
                data=json.dumps({"saml_id": self.request.POST.get("auth-saml")}),
                headers={"Content-Type": "application/json"},
            )
            if response.status_code == 200:
                url = response.json().get("response")
                return HttpResponseRedirect(url)
        return super(AppUserLoginView, self).post(*args, **kwargs)


class AppOpenIDLogin(AppUserLoginView):
    """ 
    View to signin into the application directly to select role
    """
    form_list = (
        ("user_role", UserRoleSelectionForm),
    )

    def get_email(self):
        
        token = self.request.GET.get("token")
        try:
            email = signing.loads(token)
            return email
        except:
            return None

    def get_user(self):
        
        if not self.user_cache:
            email = self.get_email()
            if email:
                try:
                    user = AppUserModel.objects.get(email__iexact=email)
                    self.user_cache = user
                except AppUserModel.DoesNotExist:
                    # Case where the user does not exist
                    self.user_cache = None
                    return self.user_cache

        return self.user_cache

    
    def get_context_data(self, **kwargs):
        
        context = super().get_context_data(**kwargs)
        user = self.get_user()
        """ This flag indicates whether the user is exists"""
        context['user_validated'] = user is not None
        
        return context
    

    def get(self, request, *args, **kwargs):
        
        url = "/login/"
        user = self.get_user()
        print(" user -  ")
        print(user)
        if user and user.roles.filter(is_active=True).count() > 0:
            active_roles = user.roles.filter(is_active=True)
            if active_roles.count() == 1:
                # Directly select the single role and log in the user
                user_role = active_roles.first()
                self.request.selected_role_id = user_role.id

                # Log the user in
                login(self.request, user, backend=USER_AUTH_BACKEND)

                # Redirect the user to the appropriate landing page
                redirect_to = self.get_redirect_url(user_role)
                
                return redirect(redirect_to)
            return super(AppOpenIDLogin, self).get(request, *args, **kwargs)

        
        return HttpResponseRedirect(url)
