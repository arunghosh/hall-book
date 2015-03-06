from django.db import models
from common.models import BaseModel
from halls.models import Hall
from django.utils.translation import ugettext_lazy as _


class Customer(BaseModel):
    name = models.CharField(max_length=64)
    phone = models.CharField(max_length=32, null=True, blank=False)
    email = models.CharField(max_length=64, null=True, blank=False)

class Slot(BaseModel):
    customer = models.ForeignKey(Customer, null=True, blank=True)
    date = models.DateField()
    start = models.TimeField()
    end = models.TimeField()
    hall = models.ForeignKey(Hall)
    comments = models.CharField(max_length=512, null=True, blank=True)
    status = models.SmallIntegerField(default=0, blank=True)

    class Meta:
        verbose_name = _('slot')
        verbose_name_plural = _('slots')