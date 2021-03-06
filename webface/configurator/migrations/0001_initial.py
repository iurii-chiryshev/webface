# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2018-01-30 12:17
from __future__ import unicode_literals

import configurator.models
import core.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Camera',
            fields=[
                ('uuid', models.CharField(default=core.models.uuid4_str, max_length=64, primary_key=True, serialize=False)),
                ('create', models.DateTimeField(auto_now_add=True)),
                ('last_update', models.DateTimeField(auto_now=True)),
                ('src', models.CharField(max_length=512)),
                ('unit_ip', models.GenericIPAddressField(default=configurator.models.def_ip, protocol='IPv4')),
                ('unit_port', models.PositiveSmallIntegerField(default=5550)),
                ('mjpeg_port', models.PositiveSmallIntegerField(default=5570)),
                ('alias', models.CharField(default='CAM', max_length=128)),
                ('description', models.TextField(max_length=1024)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
