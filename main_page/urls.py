from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.film_map, name="main"),
	url(r'^init_marks$', views.init_marks, name="init_marks"),
	url(r'^get_marker_plots$', views.get_marker_plots, name="get_marker_plots"),
	url(r'^search_movie$', views.search_movie, name="search-movie"),
	url(r'^save_route$', views.save_route, name="save_route"),
	url(r'^delete_route$', views.delete_route, name="delete_route"),
	url(r'^modify_route_name$', views.modify_route_name, name="modify_route_name"),
	url(r'^get_movie_plots$', views.get_movie_plots, name="get_movie_plots"),
	url(r'^load_routes$', views.load_routes, name="load_routes"),
	url(r'^load_route$', views.load_route, name="load_route"),

	url(r'^unfollow_user$', views.unfollow_user, name="unfollow_user"),
    url(r'^unfollow_route$', views.unfollow_route, name="unfollow_route"),
    url(r'^user/follow_user$', views.follow_user, name="follow_user"),
    url(r'^user/follow_route$', views.follow_route, name="follow_route"),
    url(r'^change_password$', views.change_password, name="change_password"),
    url(r'^user/(?P<email>.*)$', views.designate_user, name="designate_user"),
    url(r"^logout_user$", views.logout_user, name="logout_user"),
]