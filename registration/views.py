from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from .forms import *


User = get_user_model()
# Create your views here.
def mlogin(request):
    login_form = LoginForm()
    signup_form = SignUpForm()
    if request.method == 'POST':
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            user = authenticate(email=login_form.cleaned_data['email'], password=login_form.cleaned_data['password'])
            login(request, user)
            return HttpResponseRedirect('/main_page/')
    return render(request, 'login.html', {"login_form": login_form, "signup_form": signup_form, "cur_slide": 1})

def msignup(request):
    login_form = LoginForm()
    signup_form = SignUpForm()
    if request.method == 'POST':
        signup_form = SignUpForm(request.POST)
        if signup_form.is_valid():
            user = User.objects.create_user(email=signup_form.cleaned_data['email'],
                                            password=signup_form.cleaned_data['password'])
            login(request, user)
            return HttpResponseRedirect('/main_page/')
        else:
            login_form = LoginForm()
    return render(request, 'login.html', {"login_form": login_form, "signup_form": signup_form, "cur_slide": 2})




