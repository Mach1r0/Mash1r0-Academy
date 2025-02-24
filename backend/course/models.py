from django.db import models
from teacher.models import Teacher
from student.models import Student

class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    teacher =models.ForeignKey('teacher.Teacher', on_delete=models.CASCADE)
    students = models.ManyToManyField('student.Student')
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name