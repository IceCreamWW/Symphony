from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout

from django.http import JsonResponse
from registration.models import MyUser, UserProfile
from main_page.models import Route


@login_required
def main(requests):
    my_user_obj = requests.user
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
    return render(requests, "profile/profile.html", context)


@csrf_exempt
def unfollow_user(requests):
    my_user_obj = requests.user
    user_profile_obj = my_user_obj.userprofile
    follow_set = user_profile_obj.user_follow
    removing_email = requests.POST["email"]
    removing_user = get_object_or_404(MyUser, email=removing_email)
    follow_set.remove(removing_user)
    return JsonResponse({"status": "success"})


@csrf_exempt
def unfollow_route(requests):
    my_user_obj = requests.user
    user_profile_obj = my_user_obj.userprofile
    route_set = user_profile_obj.route_follow
    route_id = requests.POST["id"]
    removing_route = get_object_or_404(Route, id=route_id)
    route_set.remove(removing_route)
    return JsonResponse({"status": "success"})


@csrf_exempt
def change_password(requests):
    if requests.method == "POST":
        cur_password = requests.POST["cur_password"]
        new_password = requests.POST["new_password"]
        my_user_obj = requests.user
        if my_user_obj.check_password(cur_password):
            my_user_obj.set_password(new_password)
            my_user_obj.save()
            logout(requests)
            return JsonResponse({"status": "success"})
        else:
            return JsonResponse({"status": "fail"})
    return JsonResponse({"status": "error"})


@csrf_exempt
def follow_user(requests):
    my_user_obj = requests.user
    user_profile_obj = my_user_obj.userprofile
    follow_set = user_profile_obj.user_follow
    removing_email = requests.POST["email"]
    removing_user = get_object_or_404(MyUser, email=removing_email)
    follow_set.add(removing_user)
    return JsonResponse({"status": "success"})


@csrf_exempt
def follow_route(requests):
    my_user_obj = requests.user
    user_profile_obj = my_user_obj.userprofile
    route_set = user_profile_obj.route_follow
    route_id = requests.POST["id"]
    removing_route = get_object_or_404(Route, id=route_id)
    route_set.add(removing_route)
    return JsonResponse({"status": "success"})


@login_required
def designate_user(requests, email):
    cur_user_obj = get_object_or_404(MyUser, email=email)
    cur_user_profile_obj = cur_user_obj.userprofile
    my_user_obj = requests.user
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
    return render(requests, "profile/other_user.html", context)


def logout_user(requests):
    logout(requests)
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
