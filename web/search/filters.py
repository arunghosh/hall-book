from halls.models import Hall
import pdb


class HallFinder():

    def __init__(self, form):
        self.filters = form.get_filters()

    def get_halls(self):
        halls = Hall.objects.all()
        for f in self.filters:
            halls = f.execute(halls)
        return halls


class SeatFilter():

    def __init__(self, seats):
        self.seats = seats

    def execute(self, halls):
        if self.seats > 0:
            max_s = (self.seats * 150 / 100)
            min_s = (self.seats * 85 / 100)
            halls = halls.filter(seat_capacity__lte=max_s, seat_capacity__gte=min_s)
        return halls


class AmenityFilter():

    def __init__(self, amenities):
        self.amenities = amenities

    def execute(self, halls):
        if self.amenities:
            for a in self.amenities:
                # [h for h in halls if x in b]
                halls = halls.filter(amenities__id=a)
        return halls


class HallTypeFilter():

    def __init__(self, types):
        self.types = types

    def execute(self, halls):
        if self.types:
            for t in self.types:
                # [h for h in halls if x in b]
                halls = halls.filter(hall_types__id=t)
        return halls
