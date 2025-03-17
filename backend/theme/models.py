from django.db import models
from teacher.models import Teacher
from student.models import Student

class Theme(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    questions = models.ManyToManyField('questions.Question', related_name='themes', blank=True, null=True)
     

    def __str__(self):
        return self.name
    
class SubTheme(models.Model):
    name = models.CharField(max_length=100)
    questions = models.ManyToManyField('questions.Question', related_name='subthemes')
    description = models.TextField()
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, related_name='subthemes')
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name