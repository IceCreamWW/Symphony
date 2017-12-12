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
    return JsonResponse(get_init_markers(), safe=False)
    # return JsonResponse(generate_random_marks(), safe=False)

@csrf_exempt
def save_route(request):
    if request.method == 'GET':
        if request.GET['isNew'] == 'true':
            route = Route(name=request.GET['name'],creator=request.user, date=timezone.now())
            route.save()
            return JsonResponse({"id": route.id})
        else:
            route = Route.objects.get(id=request.GET['id'])
            route.sites.clear()
            site_ids = [int(site_id) for site_id in request.GET["sites"].split(',') if len(site_id) > 0]

            for index, site_id in enumerate(site_ids):
                site = Site.objects.get(id=site_id)
                rela = SiteInRoute(site=site,route=route,site_index=index)
                rela.save()
            return JsonResponse({"id": route.id})


def load_routes(request):
    if request.is_ajax():
        user = request.user
        ret_json = []
        routes = user.route_create.all()
        for route in routes:
            sites = [sir.site.id for sir in route.siteinroute_set.order_by('site_index')]
            ret_json.append({"id": route.id, "name": route.name, "sites": sites})
        return JsonResponse(ret_json, safe=False)

@csrf_exempt
def delete_route(request):
    if request.is_ajax():
        route_id = request.POST['id']
        Route.objects.get(id=route_id).delete()
        return JsonResponse({"success": True})

@csrf_exempt
def modify_route_name(request):
    if request.is_ajax():
        route_id = request.POST['id']
        new_name = request.POST['name']
        route = Route.objects.get(id=route_id)
        route.name = new_name
        route.save()
        return JsonResponse({"name": new_name})

def get_marker_plots(request):
    if request.is_ajax():
        id = request.GET['id']
        cur_site = Site.objects.get(id=id)
        plots = Plot.objects.filter(site__id=id)

        context = {
            "site": {
                "name": cur_site.name
            },
            "plots": [
            {"img": plot.movie.video, "movie_name": plot.movie.name, "keyword": plot.keyword, "description": plot.description}
            for plot in plots]
        }
        return JsonResponse(context, safe=False)

def get_movie_plots(request):
    if request.is_ajax():
        movie_id = request.GET["id"]
        cur_movie = Movie.objects.get(id=movie_id)
        plot_set = Plot.objects.filter(movie=cur_movie)
        result_list = list()
        for plot in plot_set:
            cur_plot_dict = dict()
            cur_plot_dict["keyword"] = plot.keyword
            cur_plot_dict["description"] = plot.description
            cur_plot_dict["img"] = plot.img
            cur_plot_dict["site_id"] = plot.site.id
            result_list.append(cur_plot_dict)
        return JsonResponse(result_list, safe=False)

def search_movie(request):
    if request.is_ajax():
        movie_name = request.GET['movie']
        movies = Movie.objects.filter(name__icontains=movie_name)
        context = [{'name': movie.name, 'img': movie.video, 'description': movie.description, 'id': movie.id} for movie in movies]
        return JsonResponse(context, safe=False)

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
    site_set = Site.objects.all()
    markers = [{"latlng": {"lat": site.lat, "lng": site.lng}, "name": site.name, "id":site.id} for site in site_set]
    return markers

