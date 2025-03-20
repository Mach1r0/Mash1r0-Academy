from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Teacher

@receiver(post_save, sender=Teacher)
def update_user_role(sender, instance, created, **kwargs):
    user = instance.user
    user.role = 'teacher'
    user.save(update_fields=['role'])