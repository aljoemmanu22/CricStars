# Generated by Django 4.2.11 on 2024-06-11 05:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('match', '0014_match_innings'),
    ]

    operations = [
        migrations.AddField(
            model_name='matchteamplayer',
            name='batting_strike_rate',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
        migrations.AddField(
            model_name='matchteamplayer',
            name='bowling_economy',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
