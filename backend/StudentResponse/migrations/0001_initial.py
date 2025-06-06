# Generated by Django 5.1.6 on 2025-04-10 02:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StudentResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response', models.TextField()),
                ('booleaniscorrect', models.BooleanField(db_column='booleanIsCorrect', default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Student Response',
                'verbose_name_plural': 'Student Responses',
                'db_table': 'StudentResponse_studentresponse',
            },
        ),
    ]
