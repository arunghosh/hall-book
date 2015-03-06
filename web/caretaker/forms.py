from django import forms
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.admin import widgets

from halls.models import Hall
from reserve.models import Customer, Slot

import pdb

class LoginForm(forms.Form):
    username = forms.EmailField(label=_("Email Address"))
    password = forms.CharField(widget=forms.PasswordInput())

    def __init__(self, *args, **kwargs):
        self.custom_errors = []
        self.user = None
        super(LoginForm, self).__init__(*args, **kwargs)

    def authenticate(self, request):
        if self.is_valid():
            try:
                user = User.objects.get(email=self.cleaned_data['username'])
                self.user = authenticate(username=user.username, password=self.cleaned_data['password'])
                if user:
                    login(request, self.user)
            except User.DoesNotExist:
                pass

            if not self.user:
                self.custom_errors.append("Invalid user name or password")
        return self.user


class NewSlotForm(forms.Form):
    hall_id = forms.IntegerField()
    name = forms.CharField(max_length=64)
    phone = forms.CharField(max_length=32, required=True)
    email = forms.CharField(max_length=64, required=False)
    start = forms.TimeField(required=True)
    end = forms.TimeField(required=True)
    date = forms.DateField(input_formats=('%Y-%m-%d',))

    def clean_end(self):
        print self.cleaned_data
        start = self.cleaned_data['start']
        end = self.cleaned_data['end']
        if end <= start:
            raise forms.ValidationError("End time should not be less than start time")
        return end

    def save(self):
        customer = self.__save_customer()
        self.__save_slot(customer)

    def __save_slot(self, customer):
        slot = Slot()
        slot.date = self.cleaned_data['date']
        slot.start = self.cleaned_data['start']
        slot.end = self.cleaned_data['end']
        slot.customer = customer
        slot.hall = Hall.objects.get(pk=self.cleaned_data['hall_id'])
        slot.save()

    def __save_customer(self):
        customer = Customer()
        customer.email = self.cleaned_data['email']
        customer.name = self.cleaned_data['name']
        customer.phone = self.cleaned_data['phone']
        customer.save()
        return customer
