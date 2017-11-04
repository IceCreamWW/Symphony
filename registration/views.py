from django.shortcuts import render
from django.http import HttpResponseRedirect
from .forms import *


# Create your views here.
def mlogin(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect('/main_page/')
    else:
        login_form = LoginForm()
        signup_form = SignUpForm()

    return render(request, 'login.html', {"login_form": login_form, "signup_form": signup_form})
