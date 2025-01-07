from collections import OrderedDict

from django.core.files.storage import DefaultStorage
from django.core.exceptions import SuspiciousOperation
from django.http import HttpResponse
from django.utils.translation import gettext as _

from formtools.wizard.views import SessionWizardView
from formtools.wizard.forms import ManagementForm

from zango.core.api import get_api_response

from ....packages.frame.decorator import add_frame_context

from ..mixin import CrudRequestMixin


class BaseFormWizardView(SessionWizardView, CrudRequestMixin):
    template_name = "crud/form_wizard.html"  # TODO: Update

    file_storage = DefaultStorage()

    workflow = None
    workflow_object_instance = None
    wizard_title = "Form Wizard"

    step_config = {}

    # Method overrides from SessionWizardView

    def get_prefix(self, request, *args, **kwargs):
        # setting the prefix as empty for the management form
        return ""

    def get_form_prefix(self, step=None, form=None):
        """
        Returns the prefix which will be used when calling the actual form for
        the given step. `step` contains the step-name, `form` the form which
        will be called with the returned prefix.

        If no step is given, the form_prefix will determine the current step
        automatically.
        """
        # setting the prefix as empty for the form data
        return ""

    def get_form_kwargs(self, step=None):
        """
        Returns the keyword arguments for instantiating the form
        (or formset) on the given step.
        """
        return {"crud_view_instance": self}

    def render(self, form=None, **kwargs):
        form = form or self.get_form()
        json_schema, ui_schema = form.convert_model_form_to_json_schema()
        response_content = {
            "form": {
                "json_schema": json_schema,
                "ui_schema": ui_schema,
                "form_data": getattr(form, "cleaned_data", getattr(form, "data", {})),
            },
            "steps": self.steps.all,
            "wizard_metadata": self.get_wizard_metadata(),
            "previous_step": self.steps.prev,
            "current_step": self.steps.current,  # Next step is already updated in current before this call
            "next_step": self.steps.next,
        }

        return get_api_response(
            success=True, response_content=response_content, status=200
        )

    def render_done(self, form, **kwargs):
        """
        This method gets called when all forms passed. The method should also
        re-validate all steps to prevent manipulation. If any form fails to
        validate, `render_revalidation_failure` should get called.
        If everything is fine call `done`.
        """
        final_forms = OrderedDict()
        # walk through the form list and try to validate the data again.
        for form_key in self.get_form_list():
            step_form_data = self.storage.get_step_data(form_key)
            step_form_files = self.storage.get_step_data(form_key)
            form_obj = self.get_form(
                step=form_key,
                data=step_form_data,
                files=step_form_files,
            )
            # Skip the revalidation for steps which has no data or files in storage i.e, those steps are skipped
            if step_form_data or step_form_files:
                if not form_obj.is_valid():
                    return self.render_revalidation_failure(
                        form_key, form_obj, **kwargs
                    )

                final_forms[form_key] = form_obj

        # render the done view and reset the wizard before returning the
        # response. This is needed to prevent from rendering done with the
        # same data twice.
        done_response = self.done(
            list(final_forms.values()), form_dict=final_forms, **kwargs
        )
        self.storage.reset()
        return done_response

    def can_skip_step(self, step):
        # Check step can be skipped or not
        can_skip = self.step_config.get(step, {}).get("can_skip", False)
        if callable(can_skip):
            can_skip = can_skip(self, step)

        return can_skip

    def get_steps_metadata(self):
        steps_metadata = {}

        form_list = self.get_form_list()

        for step, form in form_list.items():
            steps_metadata[step] = {}

            # Set the title for each step, defaulting to the step name if no title is provided in the form's Meta class.
            if hasattr(form, "Meta") and hasattr(form.Meta, "title"):
                steps_metadata[step]["title"] = form.Meta.title
            else:
                steps_metadata[step]["title"] = step

            steps_metadata[step]["can_skip"] = self.can_skip_step(step)

        return steps_metadata

    def get_wizard_metadata(self):
        wizard_metadata = {}

        wizard_metadata["title"] = getattr(self, "wizard_title", "Form Wizard")
        wizard_metadata["steps_metadata"] = self.get_steps_metadata()
        return wizard_metadata

    # Action methods
    def initialize_form(self, request, *args, **kwargs):
        success = True
        response_content = {
            "is_multistep": True,
            "steps": self.steps.all,
            "wizard_metadata": self.get_wizard_metadata(),
            "current_step": self.steps.current,
            "next_step": self.steps.next,
        }
        return success, response_content

    def get_step_form_schema(self, request, *args, **kwargs):
        """
        Retrieves the JSON schema and UI schema for a specific step.

        If no 'step' parameter is provided in the request, the method will determine the
        current step automatically.
        """
        step = request.GET.get("step", None)
        form = self.get_form(step=step)
        json_schema, ui_schema = form.convert_model_form_to_json_schema()

        success = True
        response_content = {
            "steps": self.steps.all,
            "wizard_metadata": self.get_wizard_metadata(),
            "previous_step": self.steps.prev,
            "current_step": self.steps.current,
            "next_step": self.steps.next,
            "form": {"json_schema": json_schema, "ui_schema": ui_schema},
        }
        return success, response_content

    def goto_step(self, request, *args, **kwargs):
        # Look for a wizard_goto_step element in the posted data which
        # contains a valid step name. If one was found, render the requested
        # form. (This makes stepping back a lot easier).
        step = request.GET.get("step", None)
        action_type = request.GET.get("action_type")

        # If next_step is null means that we are skipping the last step
        if action_type == "skip" and step == "null":
            step = self.steps.last

        if step and step in self.get_form_list():
            if action_type == "skip" and self.can_skip_step(step):
                render_done = self.steps.current == self.steps.last
                if render_done:
                    # no more steps, render done view
                    return self.render_done(form=None, **kwargs)
                return self.render_goto_step(step)

            return self.render_goto_step(step)
        return False, "Invalid step"

    def submit_form(self, request, *args, **kwargs):
        # Check if form was refreshed
        management_form = ManagementForm(self.request.POST, prefix=self.prefix)
        if not management_form.is_valid():
            raise SuspiciousOperation(
                _("ManagementForm data is missing or has been tampered.")
            )

        form_current_step = management_form.cleaned_data["current_step"]
        if (
            form_current_step != self.steps.current
            and self.storage.current_step is not None
        ):
            # form refreshed, change current step
            self.storage.current_step = form_current_step

        # get the form for the current step
        form = self.get_form(data=self.request.POST, files=self.request.FILES)

        # and try to validate
        if form.is_valid():
            # if the form is valid, store the cleaned data and files.
            self.storage.set_step_data(self.steps.current, self.process_step(form))
            self.storage.set_step_files(
                self.steps.current, self.process_step_files(form)
            )

            # check if the current step is the last step
            if self.steps.current == self.steps.last:
                # no more steps, render done view
                return self.render_done(form, **kwargs)
            else:
                # proceed to the next step
                return self.render_next_step(form)

        # Form is invalid and return errors
        form_errors = form.get_serialized_form_errors()
        return False, {"errors": form_errors}

    def sync_form(self, request, *args, **kwargs):
        form = self.get_form(data=self.request.POST, files=self.request.FILES)
        json_schema, ui_schema = form.convert_model_form_to_json_schema()

        return get_api_response(
            success=True,
            response_content={
                "form": {
                    "json_schema": json_schema,
                    "ui_schema": ui_schema,
                    "form_data": request.POST.dict(),
                },
            },
            status=200,
        )

    def get_success_url(self):
        success_url = getattr(self, "success_url", None)
        return success_url

    def set_workflow_object_instance(self, object_instance):
        self.workflow_object_instance = object_instance

    def get_workflow_obj(self, **kwargs):
        workflow_class = getattr(self, "workflow", None)
        if workflow_class:
            workflow_object = workflow_class(
                request=self.request,
                crud_view_instance=self,
                object_instance=kwargs.get("object_instance", None),
            )
            return workflow_object

        return None

    @add_frame_context
    def get_context_data(self, **kwargs):
        context = {}
        context["display_sidebar"] = kwargs.get("display_sidebar", False)
        context["page_title"] = self.page_title

        return context

    def get(self, request, *args, **kwargs):
        action = self.get_request_action(request)

        action_mapper = {
            "initialize_form": self.initialize_form,
            "get_step_form_schema": self.get_step_form_schema,
            "goto_step": self.goto_step,
        }

        if action in action_mapper:
            action_result = action_mapper[action](request, *args, **kwargs)
            if isinstance(action_result, tuple):
                success, response_content = action_result
                return get_api_response(
                    success=success,
                    response_content=response_content,
                    status=200 if success else 400,
                )
            elif isinstance(action_result, HttpResponse):
                return action_result

            return get_api_response(
                success=False,
                response_content={"message": "Invalid return value for action"},
                status=500,
            )

        # Render the template

        # reset the storage
        self.storage.reset()

        # reset the current step to the first step.
        self.storage.current_step = self.steps.first

        context = self.get_context_data(*kwargs)
        return self.render_to_response(context)

    def post(self, request, *args, **kwargs):
        action = self.get_request_action(request)
        if not action:
            action = request.GET.get("form_action")

        action_mapper = {
            "sync_form": self.sync_form,
            "submit_form": self.submit_form,
        }
        if action in action_mapper:
            action_result = action_mapper[action](request, *args, **kwargs)

            if isinstance(action_result, tuple):
                success, response_content = action_result
                return get_api_response(
                    success=success,
                    response_content=response_content,
                    status=200 if success else 400,
                )
            elif isinstance(action_result, HttpResponse):
                return action_result

            return get_api_response(
                success=False,
                response_content={"message": "Invalid return value for action"},
                status=500,
            )

        return get_api_response(
            success=False, response_content={"message": "Invalid action"}, status=400
        )

    def process_step_done(self, step, form, object_instance, form_list, **kwargs):
        """
        This method can  be overridden for providing additional processing after a step is done.
        """
        return

    def process_done(self, form_list, **kwargs):
        form_dict = kwargs["form_dict"]
        result_dict = {"steps_results": {}}
        for step, form in form_dict.items():
            object_instance = form.save()
            # TODO: Refine this for each view render

            # if isinstance(object_instance, models.Model):
            #     self.instance_dict[step] = object_instance
            step_result = self.process_step_done(
                step, form, object_instance, form_list, **kwargs
            )

            result_dict["steps_results"][step] = step_result

        return result_dict

    def done(self, form_list, **kwargs):
        result_dict = self.process_done(form_list, **kwargs)
        workflow_obj = self.get_workflow_obj(
            object_instance=self.workflow_object_instance
        )
        if workflow_obj:
            workflow_obj.execute_transition(workflow_obj.Meta.on_create_status)

        success_url = self.get_success_url()
        response_content = {
            "message": "Form Saved",
        }
        if success_url:
            response_content.update({"success_url": success_url})
        return get_api_response(
            success=True,
            response_content=response_content,
            status=200,
        )
