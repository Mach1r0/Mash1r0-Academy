from django.db import models
from student.models import Student
from questions.models import Question

class StudentResponse(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    booleanIsCorrect = models.BooleanField()

    def __str__(self):
        return self.booleanIsCorrect