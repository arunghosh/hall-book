from django.shortcuts import render, redirect
from django.views.generic.base import View, TemplateResponseMixin
from django.views.generic.base import TemplateView
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

from rest_framework.views import APIView
from rest_framework.response import Response

from common.views import JSONResponseMixin
from halls.serializers import HallSerializer
from halls.models import Hall

from .forms import LoginForm, NewSlotForm
from .models import Caretaker

import pdb
import json


class HomeView(View):

    def get(self, request):
        if request.user.is_authenticated():
            return self.hall_view(request)
        form = LoginForm()
        return render(request, "adminlogin.html", {'form':form})

    def post(self, request):
        form = LoginForm(request.POST)
        form.authenticate(request)
        if request.user.is_authenticated():
            return self.hall_view(request)
        return render(request, "adminlogin.html", {'form':form})

    def hall_view(self, request):
        if request.mobile:
            return render(request, "m.caretaker.html", {})
        return render(request, "caretaker.html", {})


class UserHalls(APIView):

    def get(self, request):
        user = request.user
        try:
            care_taker = Caretaker.objects.get(user__id=user.id)
            halls = care_taker.halls.all()
        except:
            halls = []
        slz = HallSerializer(halls, many=True)
        return Response(slz.data)


class UserHallsFromApp(APIView):

    def get(self, request):
        halls = Hall.objects.all()
        slz = HallSerializer(halls, many=True)
        return Response(slz.data)


class BookSlotView(JSONResponseMixin, View):

    def post(self, request, *args, **kwargs):
        form = NewSlotForm(request.POST)
        if form.is_valid():
            form.save()
        errors = []
        for e in form.errors:
            err = form.errors[e]
            errors.append({'field': e, 'error': err})
        return self.render_json_response(errors)


