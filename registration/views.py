from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login
from .forms import *


# Create your views here.
def mlogin(request):
    login_form = LoginForm()
    signup_form = SignUpForm()
    if request.method == 'POST':
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            user = authenticate(email=login_form.cleaned_data['email'], password=login_form.cleaned_data['password'])
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect('/main_page/')
            else:
                pass
        else:
            pass
    return render(request, 'login.html', {"login_form": login_form, "signup_form": signup_form})
