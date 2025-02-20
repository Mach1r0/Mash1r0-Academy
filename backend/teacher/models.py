from django.db import models
from user.models import User

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    bio = models.TextField(blank=True)
    qualification = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"Teacher: {self.user.name}"
    
    def save(self, *args, **kwargs):
        if self.user.role != 'teacher':
            self.user.role = 'teacher'
            self.user.save()
        super(Teacher, self).save(*args, **kwargs)
