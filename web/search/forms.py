from django import forms
from halls.models import Amenity, HallType

from .filters import SeatFilter, AmenityFilter, HallTypeFilter
import pdb
# min_seats #max_seats
# seats 1000 900 to 1500


class FilterForm(forms.Form):
    amenities = Amenity.objects.all()
    AMENITY_OPTS = ((a.id, a.name) for a in amenities)

    hall_types = HallType.objects.all()
    HALL_TYPES_OPTS = ((a.id, a.name) for a in hall_types)

    seats = forms.IntegerField()
    price = forms.IntegerField()

    amenities = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple(), choices=AMENITY_OPTS)
    hall_types = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple(), choices=HALL_TYPES_OPTS)

    def get_filters(self):
        self.is_valid()
        seat_filter = SeatFilter(self.cleaned_data['seats'] if ('seats' in self.cleaned_data) else 0)
        amenity_filter = AmenityFilter(self.cleaned_data['amenities'] if ('amenities' in self.cleaned_data) else 0)
        hall_type_filter = HallTypeFilter(self.cleaned_data['hall_types'] if ('hall_types' in self.cleaned_data) else 0)
        result = [seat_filter, amenity_filter, hall_type_filter]
        return result
