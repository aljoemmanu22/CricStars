# Generated by Django 4.2.11 on 2024-05-17 06:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_user_batting_style_user_bowling_style_user_gender_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='location',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
