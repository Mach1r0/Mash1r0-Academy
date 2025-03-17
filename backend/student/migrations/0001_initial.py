# Generated by Django 5.1.6 on 2025-03-17 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bio', models.TextField(blank=True)),
                ('matricula', models.IntegerField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='student-image/')),
            ],
        ),
    ]
