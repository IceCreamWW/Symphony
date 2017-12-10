from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from main_page.models import *
from django.db import models
from django.http import HttpResponse
from django.db import IntegrityError

def addMovie(movie):
    movies = Movie.objects.create(name=movie.get('name'),description=movie.get('description'), video=movie.get('video'))
    # a = Movie.objects.create(name='指环王', description='一个戒指引发的战争', video="dasdasd")
    return "addmovie"

def deleteMovie(movie):
    movies = Movie.objects.filter(name='指环王').delete()
    return "deletemovie"

def updateMovie(movie):
    movies = Movie.objects.filter(id=movie.id).update(name=movie.name, description=movie.description, video=movie.video)
    return "updatemovie"
