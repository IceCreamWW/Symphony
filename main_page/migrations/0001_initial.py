# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-10-30 10:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserBrief',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_name', models.CharField(max_length=20)),
                ('user_pswd', models.CharField(max_length=20)),
                ('user_follow', models.ManyToManyField(related_name='_userbrief_user_follow_+', to='main_page.UserBrief')),
            ],
        ),
        migrations.CreateModel(
            name='UserDetail',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('user_intro', models.TextField()),
                ('user_img', models.CharField(max_length=255)),
                ('user_label', models.TextField()),
            ],
        ),
    ]
