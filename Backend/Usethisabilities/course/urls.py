from django.urls import path

urlpatterns = [
    path("",), # ADD THE VIEW!!!!!!     # catalog
    path("my/", ),  # my courses
    path("<int:pk>/", ),  # one course

]