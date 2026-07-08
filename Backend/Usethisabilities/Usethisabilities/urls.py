from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('profiles/', include('profiles.urls')),
    path('auth/', include('accounts.urls')),
    path('abilities/', include('course.urls')),
]
