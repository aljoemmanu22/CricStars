# Generated by Django 4.2.11 on 2024-05-24 04:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('match', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='ground_location',
            field=models.CharField(blank=True, choices=[('home', 'home'), ('away', 'away')], default='home', max_length=50, null=True),
        ),
    ]
