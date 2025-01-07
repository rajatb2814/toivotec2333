class WorkflowRequestMixin(object):
    def get_request_action(self, request):
        """
        Get the request action from the given request.

        Parameters:
            request (HttpRequest): The HTTP request object.

        Returns:
            str: The value of the 'action' parameter from the request's GET parameters.
        """
        action = request.GET.get("action")
        return action

    def get_request_user(self, request):
        """
        Retrieve the user associated with the given request.
        :param request: The request object
        :return: The user associated with the request or None if the user is anonymous.
        """

        from zango.core.utils import get_current_role

        user_role = get_current_role()

        if user_role and user_role.name == "AnonymousUsers":
            return None

        return request.user
