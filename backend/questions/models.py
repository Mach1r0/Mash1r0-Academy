from django.db import models
from course.models import Course 

class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('EASY', 'Easy'),
        ('MEDIUM', 'Medium'),
        ('HARD', 'Hard'),
    ]

    title = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_questions')
    difficulty = models.CharField(choices=DIFFICULTY_CHOICES, max_length=10)
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title