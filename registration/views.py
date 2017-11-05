from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login
from .forms import *


# Create your views here.
def mlogin(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request=request, email=email, password=password)
            if user is None:
                pass
            else:
                login(request, user)
                return HttpResponseRedirect('/main_page/')
    else:
        login_form = LoginForm()
        signup_form = SignUpForm()

    return render(request, 'login.html', {"login_form": login_form, "signup_form": signup_form})
