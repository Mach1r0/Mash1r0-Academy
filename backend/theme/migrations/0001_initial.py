# Generated by Django 5.1.6 on 2025-04-10 02:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('questions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Theme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('slug', models.SlugField()),
                ('questions', models.ManyToManyField(related_name='themes', to='questions.question')),
            ],
        ),
        migrations.CreateModel(
            name='SubTheme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('slug', models.SlugField()),
                ('questions', models.ManyToManyField(related_name='subthemes', to='questions.question')),
                ('theme', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subthemes', to='theme.theme')),
            ],
        ),
    ]
