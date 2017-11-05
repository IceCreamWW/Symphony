from django import forms


class LoginForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'placeholder': ' ', 'id': 'login_id_email'}),
                             max_length=30, label="Email")
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': ' ', 'id': 'login-password'}),
                               min_length=5, max_length=20, label="Password")


class SignUpForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'placeholder': ' ', 'id': 'signup_id_email'}),
                               max_length=20, label="Email")

    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': ' '}),
                               min_length=5, max_length=20, label="Password")

    password_again = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': ' '}),
                              min_length=5, max_length=20, label="Password Again")
