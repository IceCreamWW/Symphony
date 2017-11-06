# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-11-06 05:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('registration', '0003_auto_20171106_1327'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='email',
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='phone',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='route_follow',
            field=models.ManyToManyField(blank=True, null=True, to='main_page.Route'),
        ),
    ]
