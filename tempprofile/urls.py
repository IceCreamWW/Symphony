from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.main, name="main"),
    url(r'^unfollow_user$', views.unfollow_user, name="unfollow_user"),
    url(r'^unfollow_route$', views.unfollow_route, name="unfollow_rpute"),
    url(r'^change_password$', views.change_password, name="change_password"),
]
