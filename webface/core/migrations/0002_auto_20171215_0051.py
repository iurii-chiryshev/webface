# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-14 19:51
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='menu',
            name='parent',
            field=models.ForeignKey(db_column='parent_uuid', default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='childs', to='core.Menu'),
        ),
    ]
