# Generated by Django 5.1.6 on 2025-03-20 15:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('content', '0001_initial'),
        ('questions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='questions',
            field=models.ManyToManyField(related_name='content_questions', to='questions.question'),
        ),
    ]
