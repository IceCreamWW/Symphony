from django.shortcuts import render, render_to_response
from django.http import JsonResponse
from django.template.loader import render_to_string

from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.forms.models import model_to_dict
from main_page.models import *
from handler.models import *
from random import *
import json


# Create your views here.


def index_page(request):
    movies = Movie.objects.all()
    return render(request, 'handler/index.html', {"movies": movies})

def add_movie_html(request):

    return render(request, 'handler/add_movie.html')

# 添加电影
def add_movie(request):
    movie = request.POST
    Movie.objects.create(name=movie.get('name'), description=movie.get('description'),video=movie.get('video'))
    movies = Movie.objects.all()
    return render(request, 'handler/index.html', {"movies": movies})

# 删除电影
def delete_movie(request):
    movie = request.GET
    Movie.objects.filter(id=movie.get('id')).delete()
    movies = Movie.objects.all()
    return render(request, 'handler/index.html', {"movies": movies})

# 更新电影信息
def update_movie(request):
    if request.method == "GET":
        movie = request.GET
        movies = Movie.objects.get(id=movie.get('id'))
    elif request.method == "POST" :
        movie = request.POST
        Movie.objects.filter(id=movie.get('id')).update(name=movie.get('name'), description=movie.get('description'),video=movie.get('video'))
        movies = Movie.objects.get(id=movie.get('id'))
    return render(request, 'handler/update_movie.html', {"movies": movies})


# 搜索电影信息
def search_movie(request):
    movie = request.POST
    movies = Movie.objects.filter(name__icontains=movie.get('name'))
    return render(request, 'handler/index.html', {"movies": movies})