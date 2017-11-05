from django.contrib.auth.models import User
class LoginBackend():
    def authenticate(self, request, email=None, password=None, username=None):
        try:
            user = User.objects.get(email=email)
            if user.password != password:
                return None
            return user
        except:
            return None
