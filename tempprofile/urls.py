from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.main, name="main"),
    url(r'^unfollow_user$', views.unfollow_user, name="unfollow_user"),
    url(r'^unfollow_route$', views.unfollow_route, name="unfollow_route"),
    url(r'^user/follow_user$', views.follow_user, name="follow_user"),
    url(r'^user/follow_route$', views.follow_route, name="follow_route"),
    url(r'^change_password$', views.change_password, name="change_password"),
    url(r'^user/(?P<email>.*)$', views.designate_user, name="designate_user"),
    url(r"^logout_user$", views.logout_user, name="logout_user"),
]
