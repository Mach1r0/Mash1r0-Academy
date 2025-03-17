from django.db import models

class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('EASY', 'Easy'),
        ('MEDIUM', 'Medium'),
        ('HARD', 'Hard'),
    ]

    title = models.TextField()
    theme = models.ForeignKey('theme.Theme', on_delete=models.CASCADE, related_name='theme_questions')
    difficulty = models.CharField(choices=DIFFICULTY_CHOICES, max_length=10)
    answer = models.TextField()
    explanation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title