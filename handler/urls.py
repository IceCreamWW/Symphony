from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$', views.index_page, name="index"),
	url(r'^index$', views.index_page, name="index"),
	url(r'^add_movie$', views.add_movie, name="add_movie"),
	url(r'^search_movie', views.search_movie, name="search_movie"),
	url(r'^movie_add', views.add_movie_html, name="movie_add"),
	url(r'^delete_movie$', views.delete_movie, name="delete_movie"),
	url(r'^update_movie$', views.update_movie, name="update_movie")
]