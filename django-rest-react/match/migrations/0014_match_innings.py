# Generated by Django 4.2.11 on 2024-06-10 03:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('match', '0013_alter_matchteamplayer_people_involved'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='innings',
            field=models.IntegerField(blank=True, default=1, null=True),
        ),
    ]