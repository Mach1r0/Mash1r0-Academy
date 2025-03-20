from django.db import models
from student.models import Student
from questions.models import Question

class StudentResponse(models.Model):
    student = models.ForeignKey('student.Student', on_delete=models.CASCADE, related_name='responses', )
    question = models.ForeignKey('questions.Question', on_delete=models.CASCADE, related_name='responses')
    response = models.TextField() 
    booleaniscorrect = models.BooleanField(db_column='booleanIsCorrect', default=False)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'StudentResponse_studentresponse'
        unique_together = ['student', 'question']
        verbose_name = 'Student Response'
        verbose_name_plural = 'Student Responses'
    
    def __str__(self):
        status = 'correct' if self.booleaniscorrect else 'incorrect'
        return f"{self.student.user.username} - Q{self.question.id} - {status}"