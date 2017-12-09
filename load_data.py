import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Symphony.settings")
django.setup()

from main_page import models
import csv
import pickle

data_file = open("./attachments/data.csv", "r")
csv_reader = csv.reader(data_file)
data_list = list(csv_reader)[1:]
data_file.close()
movie_description_file = open("./attachments/movie_description.bin", "rb")
movie_description = pickle.load(movie_description_file)
movie_description_file.close()
movie_video_file = open("./attachments/movie_video.bin", "rb")
movie_video = pickle.load(movie_video_file)
movie_video_file.close()

setting = {
    "save_to_database": True,
    "load_from_cache": True,
    "save_to_cache": False,
}

if setting["load_from_cache"]:
    cache_file = open("./attachments/cache.bin", "rb")
    cache = pickle.load(cache_file)
    cache_file.close()
else:
    import geocoder

if setting["save_to_cache"]:
    new_cache = list()

for index, line in enumerate(data_list):
    longitude = float(line[5])
    latitude = float(line[6])
    movie_name = line[2]
    plot_description = line[4]
    if setting["load_from_cache"]:
        site_name = cache[index]
    else:
        try:
            g = geocoder.google([latitude, longitude], method="reverse")
            site_name = None
            if g.country_long is not None:
                site_name = g.country_long
            if g.state_long is not None:
                site_name += ' - '
                site_name += g.state_long
            if g.city is not None:
                site_name += ' - '
                site_name += g.city
            if site_name is None:
                site_name = 'Unknown Place'
        except:
            site_name = 'Unknown Place'
        finally:
            if setting["save_to_cache"]:
                new_cache.append(site_name)
    site_search_set = models.Site.objects.filter(lat=latitude, lng=longitude)
    if len(site_search_set) == 0:
        cur_site = models.Site(lat=latitude, lng=longitude, name=site_name)
        if setting["save_to_database"]:
            cur_site.save()
    else:
        cur_site = site_search_set[0]
    movie_search_set = models.Movie.objects.filter(name=movie_name)
    if len(movie_search_set) == 0:
        cur_movie = models.Movie(name=movie_name, description=movie_description[movie_name],
                                 video=movie_video[movie_name])
        if setting["save_to_database"]:
            cur_movie.save()
    else:
        cur_movie = movie_search_set[0]
    plot_search_set = models.Plot.objects.filter(description=plot_description, site=cur_site, movie=cur_movie, img="")
    if len(plot_search_set) == 0:
        cur_plot = models.Plot(keyword="", description=plot_description, site=cur_site, movie=cur_movie, img="")
        if setting["save_to_database"]:
            cur_plot.save()
    print("Progress:{}".format((index + 1) / len(data_list)))

if setting["save_to_cache"]:
    new_cache_file = open("./attachments/cache.bin", "wb")
    pickle.dump(new_cache, new_cache_file)
    new_cache_file.close()
