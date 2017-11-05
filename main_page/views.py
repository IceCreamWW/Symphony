from django.shortcuts import render, render_to_response
from django.http import JsonResponse
from django.template.loader import render_to_string

from django.contrib.auth.decorators import login_required
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


def get_marker_plots(request):
    id = 1
    cur_site = Site.objects.get(id=1)
    plots = Plot.objects.filter(site=1).values('keyword', 'movie__name', 'img')
    context = {
        "plots": plots,
    }
    html = render_to_string('main_page/plots_overview.html', context)
    plots_info = {
        "html" : html,
        "site": cur_site.name
    }
    return JsonResponse(plots_info, safe=False)


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
