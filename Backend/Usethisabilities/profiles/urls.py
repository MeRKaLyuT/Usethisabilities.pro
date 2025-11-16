from django.urls import path
from .views import ping, me


urlpatterns = [
    path('ping/', ping),
    path('me/', me),
]