from django.urls import path
form .views import ping, me


urlpatterns = [
    path('ping/', ping),
    path('me/', me),
]