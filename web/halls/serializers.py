from rest_framework import serializers
from .models import Hall, Amenity, HallType
    #, Slot


class AmenitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Amenity
        fields = ('name',)


class HallTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = HallType
        fields = ('name',)


class HallSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True)
    hall_types = HallTypeSerializer(many=True)

    class Meta:
        model = Hall
        fields = ('name', 'id', 'image', 'email', 'phone', 'city', 'seat_capacity', 'amenities', 'hall_types')