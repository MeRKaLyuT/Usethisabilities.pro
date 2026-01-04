from django.urls import path

from .views import RegisterView, RefreshView, LoginView, LogoutView, MeView

urlpatterns = [
    path("sign-up/", RegisterView.as_view(), name="register"),
    path("sign-in/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh/", RefreshView.as_view(), name="refresh"),
    path("me/", MeView.as_view(), name="me"),
]