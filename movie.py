import django
import random

django.setup()


def get_description(i):
	return ("description" + str(i)) * random.randint(5, 10)

from main_page.models import *

for _ in range(20):
	movie = Movie(name="MovieGroupOne" + str(_), description=get_description(_), video=str(_) + ".jpg")
	movie.save()

for _ in range(10):
	movie = Movie(name="MovieGroupTwo" + str(_), description=get_description(_), video=str(_) + ".jpg")
	movie.save()