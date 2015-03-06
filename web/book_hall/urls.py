from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from search.views import HallSearchView, FindHallApi
from reserve.views import GetSlotsForDay, GetSlotsForMonth
from caretaker.views import HomeView, BookSlotView, UserHalls, UserHallsFromApp

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'hallbook.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^search/', HallSearchView.as_view(), name='search'),
    url(r'^halls/', FindHallApi.as_view()),
    url(r'^$', HomeView.as_view()),
    url(r'^book_slot/', BookSlotView.as_view()),
    url(r'^user_halls/', UserHalls.as_view()),
    url(r'^app_halls/', UserHallsFromApp.as_view()),
    url(r'^slots/(?P<hid>[0-9]*)/(?P<year>\d{4})-(?P<month>[0-9]*)-(?P<day>[0-9]*)/$', GetSlotsForDay.as_view()),
    url(r'^slots/(?P<hid>[0-9]*)/(?P<year>\d{4})/(?P<month>[0-9]*)/$', GetSlotsForMonth.as_view()),
)+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
