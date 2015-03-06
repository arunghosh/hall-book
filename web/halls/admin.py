from django.contrib import admin
from .models import Hall, Amenity, HallType

# Register your models here.


class HallAdmin(admin.ModelAdmin):

    class Meta:
        model = Hall


class AmenityAdmin(admin.ModelAdmin):

    class Meta:
        model = Amenity

class HallTypeAdmin(admin.ModelAdmin):

    class Meta:
        model = HallType


admin.site.register(Hall, HallAdmin)
admin.site.register(Amenity, AmenityAdmin)
admin.site.register(HallType, HallTypeAdmin)