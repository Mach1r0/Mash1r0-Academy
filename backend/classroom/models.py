from django.db import models
from teacher.models import Teacher
from student.models import Student

class Class(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    teacher = models.ForeignKey('teacher.Teacher', on_delete=models.CASCADE)
    students = models.ManyToManyField('student.Student')