from django.shortcuts import render
from django.views.generic.base import View
from rest_framework.views import APIView
from rest_framework.response import Response

from halls.serializers import HallSerializer

from .forms import FilterForm
from .filters import HallFinder


class FindHallApi(APIView):

    def post(self, request):
        form = FilterForm(request.POST)
        hall_finder = HallFinder(form)
        halls = hall_finder.get_halls()
        slz = HallSerializer(halls)
        return Response(slz.data)


class HallSearchView(View):

    def get(self, request):
        form = FilterForm()
        return render(request, 'search.html', {'form':form})
    #
    # def post(self, request):
    #     form = FilterForm(request.POST)
    #     hall_search = HallSearch(form)
    #     halls = hall_search.get_halls()
    #     return render(request, 'search.html', {'form': form, 'halls': halls})
