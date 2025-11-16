from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email' # sign in via email
    REQUIRED_FIELDS = ['username'] # say django don't forget this field
    objects = CustomUserManager()

