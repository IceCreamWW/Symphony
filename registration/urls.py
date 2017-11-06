from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.mlogin, name="mlogin"),
	url(r'login', views.mlogin, name="mlogin"),
	url(r'signup', views.msignup, name="msignup"),
]