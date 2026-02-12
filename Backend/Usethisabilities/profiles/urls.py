from django.urls import path, include
from .views import MeView


urlpatterns = [
path("me/", MeView.as_view(), name="me"),
]