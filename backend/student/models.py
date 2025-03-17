from django.db import models
from user.models import User


class Student(models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='studant_profile')
    bio = models.TextField(blank=True)
    matricula = models.IntegerField()
    image = models.ImageField(upload_to='student-image/', blank=True, null=True)
    
    def __str__(self):
        return f"Studant: {self.user.name}"
    
    def save(self, *args, **kwargs):
        if self.user.role != 'studant':
            self.user.role = 'studant'
            self.user.save()
        super(Student, self).save(*args, **kwargs)