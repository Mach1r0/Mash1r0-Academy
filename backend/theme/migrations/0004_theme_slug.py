# Generated by Django 5.1.6 on 2025-03-19 12:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('theme', '0003_subtheme_questions_theme_questions'),
    ]

    operations = [
        migrations.AddField(
            model_name='theme',
            name='slug',
            field=models.SlugField(default='nome'),
            preserve_default=False,
        ),
    ]
