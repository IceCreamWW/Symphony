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

@csrf_exempt
def delete_route(request):
    if request.is_ajax():
        route_id = request.POST['id'];
        Route.objects.get(id=route_id).delete();
        return JsonResponse({"success": True})

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
    location_names = '''
Unknown Place
Australia - New South Wales - Barmedman
Australia - New South Wales - Wallaroo
Australia - Victoria - Toorloo Arm
Australia - New South Wales - Gerroa
Australia
Australia
Australia - Victoria - Shelley
Unknown Place
Unknown Place
Australia
Unknown Place
Australia - New South Wales - Coleambally
Australia - New South Wales - Coalcliff
Unknown Place
Unknown Place
Unknown Place
Australia - New South Wales - Deniliquin
Australia - Victoria - Bendoc
Unknown Place
Australia - New South Wales - Couradda
Australia - Victoria
Unknown Place
Australia - New South Wales - Upper Dartbrook
Unknown Place
Australia
Australia - New South Wales - Coonamble
Unknown Place
Australia - New South Wales - Piallaway
Australia
Unknown Place
Unknown Place
Australia - New South Wales - Jerangle
Australia - New South Wales - Bolaro
Australia - New South Wales - Glenroy
Australia - New South Wales - Honeybugle
Unknown Place
Australia - New South Wales - Coleambally
Unknown Place
Unknown Place
Unknown Place
Australia - Australian Capital Territory - Paddys River
Australia - Victoria - Omeo
Unknown Place
Unknown Place
Unknown Place
Australia
Unknown Place
Australia - Victoria - Gentle Annie
Australia - New South Wales - Nerrigundah
Unknown Place
Australia - New South Wales - Mayers Flat
Australia - New South Wales - Murrawombie
Australia - Victoria - Tostaree
Australia - Victoria - Darnum
Australia - New South Wales - Nowendoc
Australia - New South Wales - Woodsreef
Unknown Place
Australia - Victoria - Locksley
Unknown Place
Australia - Australian Capital Territory - Cotter River
Unknown Place
Australia - New South Wales - Louth
Australia - Tasmania
Australia - New South Wales - Nyngan
Unknown Place
Australia - New South Wales - Merah North
Australia - New South Wales - Oxley
Australia - New South Wales - Upper Allyn
Australia - New South Wales - Ungarie
Australia - New South Wales - Steam Plains
Unknown Place
Australia - New South Wales - Eumungerie
Unknown Place
Australia - Tasmania
Unknown Place
Australia - New South Wales - Castle Doyle
Australia
Australia - New South Wales - Warkworth
Australia - New South Wales - Kamarah
Australia - New South Wales - Broadway
Australia - New South Wales - Nelligen
Australia - New South Wales - Bocobra
Australia - Victoria - Golden Beach
Australia - New South Wales - Warragoon
Australia - Victoria - Yalmy
Australia - New South Wales - Carinda
Unknown Place
Australia - New South Wales - Forbes
Unknown Place
Unknown Place
Australia - Victoria - Bendoc
Australia
Australia - New South Wales - Brewarrina
Australia - New South Wales - Fairholme
Australia - New South Wales - Berridale
Unknown Place
Australia - New South Wales - Bigga
Australia - New South Wales - Mila
Australia - Victoria - Miepoll
'''
    location_names = [location_name for location_name in location_names.split('\n') if len(location_name) > 0]
    marks = [{"latlng": {"lat": get_random(-30, -40), "lng": get_random(145, 155)},
              "id": _,
              "name": location_names[_]} for _ in range(100)]
    return marks


# For Real Usage
def get_init_markers():
    site_set = Site.objects.values('id', 'lat', 'lng')
    marks = [{"latlng": {"lat": site['lat'], "lng": site['lng']}, "name": "test"} for site in site_set]


