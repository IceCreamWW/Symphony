from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

from django.contrib.auth.backends import ModelBackend
from django.db.models import QuerySet

User = get_user_model()

class LoginForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'placeholder': ' ', 'id': 'id_login_email'}),
                             max_length=30, label="Email")
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': ' ', 'id': 'id_login_password'}),
                               min_length=5, max_length=20, label="Password")

    def clean_email(self):
        email = self.cleaned_data.get('email')
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            raise forms.ValidationError('Email Does Not Exist')
        return email

    def clean_password(self):
        if len(self._errors) != 0:
            return self.cleaned_data['password']
        else:
            user = authenticate(email=self.cleaned_data['email'], password=self.cleaned_data['password'])
            if user is None:
                raise forms.ValidationError("Password Not Correct")
            return self.cleaned_data['password']




class SignUpForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'placeholder': ' ', 'id': 'id_signup_email'}),
                               max_length=30, label="Email")

    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': ' '}),
                               min_length=5, max_length=20, label="Password")

    password_again = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': ' '}),
                              min_length=5, max_length=20, label="Password Again")

    def clean_email(self):
        email = self.cleaned_data['email']
        if len(User.objects.filter(email=email)) != 0:
            raise forms.ValidationError("邮箱已被注册")
        return email

    def clean_password_again(self):
        password = self.cleaned_data['password']
        password_again = self.cleaned_data['password_again']
        if password != password_again:
            raise forms.ValidationError("两次输入的密码不一致")
        return password_again

