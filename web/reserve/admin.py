from django.contrib import admin
from .models import Customer, Slot


class CustomerAdmin(admin.ModelAdmin):

    class Meta:
        model = Customer


class SlotAdmin(admin.ModelAdmin):

    class Meta:
        model = Slot


admin.site.register(Customer, CustomerAdmin)
admin.site.register(Slot, SlotAdmin)