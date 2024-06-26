# Generated by Django 4.2.11 on 2024-06-13 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_alter_user_current_team_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='bowling_total_balls_faced',
            new_name='batting_total_balls_faced',
        ),
        migrations.AddField(
            model_name='user',
            name='bowling_total_overs_bowled',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
