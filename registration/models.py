from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from main_page.models import *
from django.db import models


class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(
            email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class MyUser(AbstractBaseUser):
    email = models.CharField(primary_key=True, max_length=100)
    nickname = models.CharField(max_length=20)
    objects = MyUserManager()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD= 'email'

    def get_full_name(self):
        # The user is identified by their email address
        return self.email

    def get_short_name(self):
        # The user is identified by their email address
        return self.email

    def __str__(self):  # __unicode__ on Python 2
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        return self.is_admin

class UserProfile(models.Model):
    user = models.OneToOneField(MyUser)
    head_img = models.CharField(max_length=255)
    user_follow = models.ManyToManyField(MyUser, related_name='follow_set')
    intro = models.TextField(default="TA 还没有添加任何介绍")
    label = models.TextField(default="TA 还没有添加任何标签")
    phone = models.CharField(max_length=20, blank=True, null=True)
    route_follow = models.ManyToManyField(Route, blank=True, null=True)

    def __str__(self):
        return self.user.email
