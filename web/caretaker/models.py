from django.db import models
from django.contrib.auth.models import User
from halls.models import Hall
from django.utils.translation import ugettext_lazy as _
from common.models import BaseModel


class Caretaker(BaseModel):

    user = models.ForeignKey(User)
    phone = models.CharField(max_length=32, blank=True, null=True)
    halls = models.ManyToManyField(Hall, blank=True)

    def __unicode__(self):
        return self.user.email