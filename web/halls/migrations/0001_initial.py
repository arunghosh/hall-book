# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Amenity',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=32)),
                ('specification', models.CharField(max_length=32, null=True, blank=True)),
                ('is_deleted', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'amenity',
                'verbose_name_plural': 'amenities',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HallType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=32)),
                ('specification', models.CharField(max_length=32, null=True, blank=True)),
                ('is_deleted', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'hall_type',
                'verbose_name_plural': 'hall_types',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Hall',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=64)),
                ('address', models.CharField(max_length=64, null=True, blank=True)),
                ('location', models.CharField(max_length=64, null=True, blank=True)),
                ('city', models.CharField(max_length=64)),
                ('email', models.EmailField(max_length=75, null=True, blank=True)),
                ('website', models.URLField(null=True, blank=True)),
                ('phone', models.CharField(max_length=16, null=True, blank=True)),
                ('seat_capacity', models.IntegerField()),
                ('secondary_phone', models.CharField(max_length=16, null=True, blank=True)),
                ('image', models.ImageField(null=True, upload_to=b'hall_pics', blank=True)),
                ('is_deleted', models.BooleanField(default=False)),
                ('amenities', models.ManyToManyField(to='halls.Amenity', null=True, blank=True)),
                ('hall_types', models.ManyToManyField(to='halls.HallType')),
            ],
            options={
                'verbose_name': 'hall',
                'verbose_name_plural': 'halls',
            },
            bases=(models.Model,),
        ),
    ]
