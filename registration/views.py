from django.contrib.auth.base_user import BaseUserManager
from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt

from .forms import *


User = get_user_model()

def mlogin(request):
    login_form = LoginForm()
    signup_form = SignUpForm()
    if request.method == 'POST':
        login_form = LoginForm(request.POST)
        if login_form.is_valid():
            user = authenticate(email=login_form.cleaned_data['email'], password=login_form.cleaned_data['password'])
            login(request, user)
            return HttpResponseRedirect('/main_page/')
    return render(request, 'login.html', {"login_form": login_form, "signup_form": signup_form, "cur_slide": 0})

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
    return render(request, 'login.html', {"login_form": login_form, "signup_form": signup_form, "cur_slide": 1})


@csrf_exempt
def check_login_email(request):
    if request.method == "GET":
        email = BaseUserManager.normalize_email(email=request.GET["email"])
        if len(User.objects.filter(email=email)) != 0:
            return JsonResponse({"valid": True})
        else:
            return JsonResponse({"valid": False})

@csrf_exempt
def check_signup_email(request):
    if request.method == "GET":
        email = BaseUserManager.normalize_email(email=request.GET["email"])
        if len(User.objects.filter(email=email)) == 0:
            return JsonResponse({"valid": True})
        else:
            return JsonResponse({"valid": False})


