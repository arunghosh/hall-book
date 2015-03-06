from django.db import models
from django.utils.translation import ugettext_lazy as _
from common.models import BaseModel
# Create your models here.

class HallType(BaseModel):
    name = models.CharField(max_length=32)
    specification = models.CharField(max_length=32, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    def __unicode__(self):
        return self.name #+ "(" + str(len(self.hall_set.all())) + ")"

    class Meta:
        verbose_name = _('hall_type')
        verbose_name_plural = _('hall_types')


class Amenity(BaseModel):
    name = models.CharField(max_length=32)
    specification = models.CharField(max_length=32, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    def __unicode__(self):
        return self.name #+ str(len(self.hall_set.all()))

    class Meta:
        verbose_name = _('amenity')
        verbose_name_plural = _('amenities')


class Hall(BaseModel):
    name = models.CharField(max_length=64)
    address = models.CharField(max_length=64, blank=True, null=True)
    location = models.CharField(max_length=64, blank=True, null=True)
    city = models.CharField(max_length=64)
    email = models.EmailField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    phone = models.CharField(max_length=16, null=True, blank=True)
    seat_capacity = models.IntegerField()
    secondary_phone = models.CharField(max_length=16, blank=True, null=True)
    image = models.ImageField(null=True, upload_to='hall_pics', blank=True)
    amenities = models.ManyToManyField(Amenity, null=True, blank=True)
    hall_types = models.ManyToManyField(HallType)
    is_deleted = models.BooleanField(default=False)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name = _('hall')
        verbose_name_plural = _('halls')