from django.db import models
from student.models import Student
from questions.models import Question
from user.models import User

class StudentResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey('questions.Question', on_delete=models.CASCADE, related_name='responses')
    answer_text = models.TextField(blank=True)
    is_correct = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'question']
        verbose_name = 'Student Response'
        verbose_name_plural = 'Student Responses'
    
    def __str__(self):
        status = 'correct' if self.is_correct else 'incorrect'
        return f"{self.user.username} - Q{self.question.id} - {status}"