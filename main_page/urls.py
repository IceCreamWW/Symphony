from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.film_map, name="main_page"),
	url(r'init_marks', views.init_marks, name="init_marks"),
	url(r'get_marker_plots', views.get_marker_plots, name="get_marker_plots"),
	url(r'search_movie', views.search_movie, name="search-movie"),
	url(r'save_route', views.save_route, name="save_route")
]