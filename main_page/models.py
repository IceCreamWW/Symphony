from django.db import models

class Site(models.Model):
    id = models.AutoField(primary_key=True)
    lat = models.FloatField()
    lng = models.FloatField()
    name = models.CharField(max_length=20)

class Route(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    date = models.DateTimeField()
    sites = models.ManyToManyField(
        Site,
        through="SiteInRoute",
        through_fields=('route_id', 'site_id'),
    )

class SiteInRoute(models.Model):
    site_id = models.ForeignKey(Site, on_delete=models.CASCADE)
    route_id = models.ForeignKey(Route, on_delete=models.CASCADE)
    site_index = models.IntegerField()


class Movie(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    video = models.CharField(max_length=255)

class Plot(models.Model):
    keyword = models.CharField(max_length=100)
    description = models.TextField()
    img = models.CharField(max_length=255)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

