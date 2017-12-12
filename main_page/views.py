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
    my_user_obj = request.user
    user_profile_obj = my_user_obj.userprofile
    context = dict()
    if my_user_obj.nickname == "":
        context["nickname"] = my_user_obj.email
    else:
        context["nickname"] = my_user_obj.nickname
    context["real_nickname"] = my_user_obj.nickname
    route_set = user_profile_obj.route_follow.all()
    route_list = list()
    for route in route_set:
        route_list.append(RouteInHtml(route.name, str(route.date),
                                      ", ".join([site.name for site in route.siteinroute_set.all()]),
                                      route.id))
    user_list = list()
    for user in user_profile_obj.user_follow.all():
        user_list.append(UserInHtml(user.email, user.userprofile.head_img,
                                    user.email if user.nickname == "" else user.nickname))
    context["email"] = my_user_obj.email
    context["user_list"] = user_list
    context["follow_num"] = len(context["user_list"])
    context["route_list"] = route_list
    context["route_num"] = len(context["route_list"])
    context["portrait"] = user_profile_obj.head_img
    context["introduction"] = user_profile_obj.intro
    context["label"] = user_profile_obj.label
    context["phone"] = user_profile_obj.phone
    if 'route_id' in request.GET:
        context[route_id] = request.GET['route_id']
        return render(request, "main_page/index.html", context)
    return render(request, "main_page/index.html", context)


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

def load_route(request):
    if request.is_ajax():
        route = Route.objects.get(id=request.GET['id'])
        sites = [sir.site.id for sir in route.siteinroute_set.order_by('site_index')]
        ret_json = {"id": route.id, "name": route.name, "sites": sites}
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

# For Real Usage
def get_init_markers():
    site_set = Site.objects.all()
    markers = [{"latlng": {"lat": site.lat, "lng": site.lng}, "name": site.name, "id":site.id} for site in site_set]
    return markers





from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout

from django.http import JsonResponse
from registration.models import MyUser, UserProfile
from main_page.models import Route


@csrf_exempt
def unfollow_user(request):
    my_user_obj = request.user
    user_profile_obj = my_user_obj.userprofile
    follow_set = user_profile_obj.user_follow
    removing_email = request.POST["email"]
    removing_user = get_object_or_404(MyUser, email=removing_email)
    follow_set.remove(removing_user)
    return JsonResponse({"status": "success"})


@csrf_exempt
def unfollow_route(request):
    my_user_obj = request.user
    user_profile_obj = my_user_obj.userprofile
    route_set = user_profile_obj.route_follow
    route_id = request.POST["id"]
    removing_route = get_object_or_404(Route, id=route_id)
    route_set.remove(removing_route)
    return JsonResponse({"status": "success"})


@csrf_exempt
def change_password(request):
    if request.method == "POST":
        cur_password = request.POST["cur_password"]
        new_password = request.POST["new_password"]
        my_user_obj = request.user
        if my_user_obj.check_password(cur_password):
            my_user_obj.set_password(new_password)
            my_user_obj.save()
            logout(request)
            return JsonResponse({"status": "success"})
        else:
            return JsonResponse({"status": "fail"})
    return JsonResponse({"status": "error"})


@csrf_exempt
def follow_user(request):
    my_user_obj = request.user
    user_profile_obj = my_user_obj.userprofile
    follow_set = user_profile_obj.user_follow
    removing_email = request.POST["email"]
    removing_user = get_object_or_404(MyUser, email=removing_email)
    follow_set.add(removing_user)
    return JsonResponse({"status": "success"})


@csrf_exempt
def follow_route(request):
    my_user_obj = request.user
    user_profile_obj = my_user_obj.userprofile
    route_set = user_profile_obj.route_follow
    route_id = request.POST["id"]
    removing_route = get_object_or_404(Route, id=route_id)
    route_set.add(removing_route)
    return JsonResponse({"status": "success"})


@login_required
def designate_user(request, email):
    cur_user_obj = get_object_or_404(MyUser, email=email)
    cur_user_profile_obj = cur_user_obj.userprofile
    my_user_obj = request.user
    my_user_profile_obj = my_user_obj.userprofile
    context = dict()
    if cur_user_obj.nickname == "":
        context["nickname"] = cur_user_obj.email
    else:
        context["nickname"] = cur_user_obj.nickname
    context["real_nickname"] = cur_user_obj.nickname
    route_set = cur_user_profile_obj.route_follow.all()
    route_list = list()
    for route in route_set:
        route_list.append(RouteInHtml(route.name, str(route.date),
                                      ", ".join([site.name for site in route.siteinroute_set.all()]),
                                      route.id, my_user_profile_obj.route_follow.filter(id=route.id).exists()))
    user_list = list()
    for user in cur_user_profile_obj.user_follow.all():
        user_list.append(UserInHtml(user.email, user.userprofile.head_img,
                                    user.email if user.nickname == "" else user.nickname,
                                    my_user_profile_obj.user_follow.filter(email=user.email).exists()))
    context["email"] = cur_user_obj.email
    context["user_list"] = user_list
    context["follow_num"] = len(context["user_list"])
    context["route_list"] = route_list
    context["route_num"] = len(context["route_list"])
    context["portrait"] = cur_user_profile_obj.head_img
    context["introduction"] = cur_user_profile_obj.intro
    context["label"] = cur_user_profile_obj.label
    context["phone"] = cur_user_profile_obj.phone
    context["is_followed"] = my_user_profile_obj.user_follow.filter(email=email).exists()
    return render(request, "profile/other_user.html", context)


def logout_user(request):
    logout(request)
    return JsonResponse({"status": "success"})


class RouteInHtml:
    def __init__(self, name: str, date: str, site: str, id: int, is_followed: bool = False):
        self.name = name
        self.date = date
        self.site = site
        self.id = id
        self.is_followed = is_followed


class UserInHtml:
    def __init__(self, email: str, portrait: str, nickname: str, is_followed: bool = False):
        self.email = email
        self.portrait = portrait
        self.nickname = nickname
        self.is_followed = is_followed
