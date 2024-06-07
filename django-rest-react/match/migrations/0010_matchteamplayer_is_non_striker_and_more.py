# Generated by Django 4.2.11 on 2024-06-05 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('match', '0009_matchteamplayer_batting_balls_faced_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='matchteamplayer',
            name='is_non_striker',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AddField(
            model_name='matchteamplayer',
            name='is_striker',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
