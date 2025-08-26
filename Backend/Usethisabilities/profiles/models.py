from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, default='avatars/default.png')
    honors = models.ManyToManyField('Honor', through='ProfileHonor')

    def __str__(self):
        return f"Profile({self.user})"


class ProfileHonor(models.Model):
    validity_period = models.PositiveIntegerField(blank=True, null=True)
    acquired_at = models.DateTimeField(auto_now_add=True)
    bought = models.BooleanField(default=False)
    profile = models.ForeignKey('Profile',
                                on_delete=models.CASCADE,
                                related_name="owned_honors")
    honor = models.ForeignKey('Honor',
                              on_delete=models.CASCADE,
                              related_name="profile_honors")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["profile", "honor"],
                name="uniq_profile_honor"
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


# Create your models here.
