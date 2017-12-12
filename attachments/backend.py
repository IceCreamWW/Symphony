from django.shortcuts import render, get_object_or_404
from main_page.models import Movie, Plot


def get_movie_plots(request):
    if request.method == "GET":
        movie_id = request.GET["id"]
        cur_movie = get_object_or_404(Movie, id=movie_id)
        plot_set = Plot.objects.filter(movie=cur_movie)
        result_list = list()
        for plot in plot_set:
            cur_plot_dict = dict()
            cur_plot_dict["keyword"] = plot.keyword
            cur_plot_dict["description"] = plot.description
            cur_plot_dict["img"] = plot.img
            cur_plot_dict["site_id"] = plot.site.id
            result_list.append(cur_plot_dict)
        return JsonResponse(result_list)

    
