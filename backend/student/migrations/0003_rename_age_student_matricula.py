# Generated by Django 5.1.6 on 2025-03-06 12:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0002_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='student',
            old_name='age',
            new_name='matricula',
        ),
    ]
