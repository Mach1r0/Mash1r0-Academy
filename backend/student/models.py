from django.db import models
from user import User


class Studant(models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='studant_profile')
    bio = models.TextField(blank=True)
    age = models.IntegerField()
    
    def __str__(self):
        return f"Studant: {self.user.name}"
    
    def save(self, *args, **kwargs):
        if self.user.role != 'studant':
            self.user.role = 'studant'
            self.user.save()
        super(Studant, self).save(*args, **kwargs)