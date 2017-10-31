from django.shortcuts import render

# Create your views here.
def film_map(request):
	return render(request, "main_map/index.html")