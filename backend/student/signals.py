
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Student

@receiver(post_save, sender=Student)
def update_user_role(sender, instance, created, **kwargs):
    user = instance.user
    user.role = 'student'
    user.save(update_fields=['role'])