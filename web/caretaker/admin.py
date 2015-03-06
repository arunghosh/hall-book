from django.contrib import admin
from .models import Caretaker

# Register your models here.

class CaretakerAdmin(admin.ModelAdmin):

    class Meta:
        model = Caretaker


admin.site.register(Caretaker, CaretakerAdmin)