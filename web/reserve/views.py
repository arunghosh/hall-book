import pdb
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.generic.base import View
from django.shortcuts import render


from .models import Slot
from .serializers import SlotSerializer


class GetSlotsForDay(APIView):

    def get(self, request, hid, year, month, day):
        slots = Slot.objects.order_by('start').filter(hall__id=hid, date__day=day, date__month=month, date__year=year)
        slz = SlotSerializer(slots)
        response = {'slots': slz.data, 'hid': hid }
        return Response(response)


class GetSlotsForMonth(APIView):

    def get(self, request, hid, year, month):
        slots = Slot.objects.order_by('start').filter(hall__id=hid, date__month=month, date__year=year)
        slz = SlotSerializer(slots, many=True)
        response = {'slots': slz.data, 'hid': hid }

        # callback = request.GET.get('callback')
        # if callback:
        #     print Response(response)
        #     xml_bytes = '%s(%s)' % (callback, slz.data)
        #     return HttpResponse(xml_bytes.replace("u'", "'"), mimetype="application/json;charset=utf-8")
        # resp = Response(response);
        # resp["Access-Control-Allow-Origin"] = "*"
        # return response

        return Response(response)

#
# class EditSlot(View):
#
#     def get(self, request, sid):
#         slot = Slot.objects.get(sid)
#         form = SlotForm(slot)
#         return render(request, "slot_edit.html", {'form': form})