from django import forms
from django.contrib.admin import ModelAdmin

from main_page.models import *
from django.contrib import admin


class SiteAdmin(ModelAdmin):
    pass

class RouteAdmin(ModelAdmin):
    pass

class MovieAdmin(ModelAdmin):
    pass

class PlotAdmin(ModelAdmin):
    pass

class SiteInRouteAdmin(ModelAdmin):
    pass

admin.site.register(Site, SiteAdmin)
admin.site.register(Route, RouteAdmin)
admin.site.register(SiteInRoute, SiteInRouteAdmin)
admin.site.register(Movie, ModelAdmin)
admin.site.register(Plot, PlotAdmin)

