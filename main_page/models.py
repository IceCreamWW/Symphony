from django.db import models
from registration.models import MyUser

class Site(models.Model):
    id = models.AutoField(primary_key=True)
    lat = models.FloatField()
    lng = models.FloatField()
    name = models.CharField(max_length=100)

class Route(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    date = models.DateTimeField()
    creator = models.ForeignKey(MyUser, related_name="route_create")
    sites = models.ManyToManyField(
        Site,
        through="SiteInRoute",
        through_fields=('route', 'site'),
    )

class SiteInRoute(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    site_index = models.IntegerField()


class Movie(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    video = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Plot(models.Model):
    keyword = models.CharField(max_length=100)
    description = models.TextField()
    img = models.CharField(max_length=255)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    def __str__(self):
        return self.keyword
