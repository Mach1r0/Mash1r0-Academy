from django.db import models
from teacher.models import Teacher
from student.models import Student
from django.utils.text import slugify

class Theme(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    questions = models.ManyToManyField('questions.Question', related_name='themes')
    slug = models.SlugField()


    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Theme, self).save(*args, **kwargs)
    
class SubTheme(models.Model):
    name = models.CharField(max_length=100)
    questions = models.ManyToManyField('questions.Question', related_name='subthemes')
    description = models.TextField()
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, related_name='subthemes')
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    slug = models.SlugField()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(SubTheme, self).save(*args, **kwargs)