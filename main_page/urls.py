from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'.*', views.film_map, name="main_page")
]