from django.db import models
from django.utils.translation import gettext_lazy
from django.db.models import Q
from django.conf import settings


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(gettext_lazy("Bio"), blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, default='avatars/default.png')
    honors = models.ManyToManyField('Honor', through='ProfileHonor')

    def __str__(self):
        return f"Profile({self.user})"


class ProfileHonor(models.Model):
    validity_period = models.PositiveIntegerField(blank=True, null=True)
    acquired_at = models.DateTimeField(gettext_lazy("Acquired at"), auto_now_add=True)
    is_active = models.BooleanField(gettext_lazy("Selected"), default=False)
    bought = models.BooleanField(gettext_lazy("In stock"), default=False)
    profile = models.ForeignKey('Profile',
                                on_delete=models.CASCADE,
                                related_name="owned_honors")
    honor = models.ForeignKey('Honor',
                              on_delete=models.CASCADE,
                              related_name="profile_honors")

    class Meta:
        constraints = [
            models.UniqueConstraint( # one active honor per profile
                fields=["profile"],
                condition=Q(is_active=True),
                name="uniq_active_profile_honor"
            ),
            models.CheckConstraint( # you can't use an unsold honor
                check=Q(is_active=False) | Q(bought=True),
                name="active_requires_bought",
            ),
            models.UniqueConstraint( # without a duplicate
                fields=["profile", "honor"],
                name="uniq_profile_honor",
            )
        ]


class Honor(models.Model):
    name = models.CharField(max_length=100, blank=True, default="None")
    price = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class Note(models.Model):
    text = models.CharField(max_length=255, blank=True)
    is_done = models.BooleanField(default=False, )
    done_at = models.DateTimeField(null=True, blank=True)
    profile = models.ForeignKey('Profile', on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return f'{self.text}: {self.is_done}'


# Create your models here.
