from django.contrib.auth.models import UserManager


class CustomUserManager(UserManager):
    def create_user(self, email, password=None, **extra_fields):
        # password=None because u can create a user just for check something
        # **extra_fields said django that other fields need to write in dictionary
        if not email:
            raise ValueError("Email required") # besides that, there are TypeError, NameError... (search in obsidian)

        email = self.normalize_email(email) # lowercase email

        extra_fields.pop("is_stuff", None)
        extra_fields.pop("is_superuser", None)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_stuff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if not extra_fields.get("is_stuff"):
            raise ValueError("Superuser is required is_stuff = True")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser is required is_superuser = True")

        return self.create_user(self, username, **extra_fields)
