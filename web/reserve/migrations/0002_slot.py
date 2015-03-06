# encoding: utf8
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('halls', '0001_initial'),
        ('reserve', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Slot',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(to_field='id', blank=True, to='reserve.Customer', null=True)),
                ('date', models.DateField()),
                ('start', models.TimeField()),
                ('end', models.TimeField()),
                ('hall', models.ForeignKey(to='halls.Hall', to_field='id')),
                ('comments', models.CharField(max_length=512, null=True, blank=True)),
                ('status', models.SmallIntegerField(default=0, blank=True)),
            ],
            options={
                'verbose_name': 'slot',
                'verbose_name_plural': 'slots',
            },
            bases=(models.Model,),
        ),
    ]
