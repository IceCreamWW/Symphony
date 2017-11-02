from django.db import models

class UserBrief(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    pswd = models.CharField(max_length=20)
    head_img = models.CharField(max_length=255)
    user_follow = models.ManyToManyField("self", symmetrical=False)

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

class UserDetail(models.Model):
    id = models.IntegerField(primary_key=True)
    intro = models.TextField(default="TA 还没有添加任何介绍")
    label = models.TextField(default="No labels")
    email = models.EmailField(null=True)
    phone = models.CharField(max_length=20, null=True)
    route_follow = models.ManyToManyField(Route)

class SiteInRoute(models.Model):
    site_id = models.ForeignKey(Site, on_delete=models.CASCADE)
    route_id = models.ForeignKey(Route, on_delete=models.CASCADE)
    site_index = models.IntegerField()


class Movie(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    description = models.TextField()
    video = models.CharField(max_length=255)

class Plot(models.Model):
    keyword = models.CharField(max_length=100)
    description = models.TextField()
    img = models.CharField(max_length=255)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

