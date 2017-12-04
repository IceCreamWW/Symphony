from django.shortcuts import render, render_to_response
from django.http import JsonResponse
from django.template.loader import render_to_string

from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

from main_page.models import *
from random import *
import json


# Create your views here.
@login_required
def film_map(request):
    return render(request, "main_page/index.html")


def init_marks(request):
    # return JsonResponse(get_random_marks(), safe=False)
    return JsonResponse(generate_random_marks(), safe=False)

@csrf_exempt
def save_route(request):
    if request.method == 'GET':
        if request.GET['isNew'] == 'true':
            route = Route(name=request.GET['name'], date=timezone.now())
            route.save()
            return JsonResponse({"id": route.id})

def get_marker_plots(request):
    if request.method == "GET":
        id = request.GET['id']
        cur_site = Site.objects.get(id=id)
        plots = Plot.objects.filter(site__id=1).values('keyword', 'movie__name', 'img')
        context = {
            "plots": plots,
        }
        html = render_to_string('main_page/plots_overview.html', context)
        plots_info = {
            "html" : html,
            "site": cur_site.name
        }
        return JsonResponse(plots_info, safe=False)

@csrf_exempt
def search_movie(request):
    if request.method == "GET":
        movie_name = request.GET['movie']
        movies = Movie.objects.filter(name__icontains=movie_name)
        context = {
            "movies" : movies,
        }
        html = render_to_string('main_page/movies_overview.html', context)
        movies_info = {
            "html" : html,
        }
        return JsonResponse(movies_info, safe=False)




def get_random(a, b):
    return a + (b - a) * random()


# For test, return all marker lat and lng in table site
def generate_random_marks(cnt=100):
    seed(0)
    marks = [{"latlng": {"lat": get_random(-30, -40), "lng": get_random(145, 155)}, "id": _} for _ in range(100)]
    return marks


# For Real Usage
def get_init_markers():
    site_set = Site.objects.values('id', 'lat', 'lng')
    marks = [{"latlng": {"lat": site['lat'], "lng": site['lng']}, "name": "test"} for site in site_set]

