from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.mlogin, name="mlogin"),
	url(r'^login$', views.mlogin, name="mlogin"),
	url(r'^signup$', views.msignup, name="msignup"),
	url(r'^check_login_email', views.check_login_email),
	url(r'^check_signup_email', views.check_signup_email),
]