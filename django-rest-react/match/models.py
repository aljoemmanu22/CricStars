from django.db import models
from accounts.models import User
from datetime import datetime


class Team(models.Model):
    team_name = models.CharField(max_length=50, blank=True)
    home_ground = models.CharField(max_length=50, blank=True)
    logo = models.ImageField(upload_to='team_logos/', blank=True, null=True)

    def __str__(self):
        return self.team_name
    

class Match(models.Model):

    # User who created the match
    created_by = models.ForeignKey(User, related_name='matches', on_delete=models.SET_NULL, null=True, blank=True)

    home_team = models.ForeignKey(Team, related_name='home_team',
                                  on_delete=models.PROTECT, default=0)
    away_team = models.ForeignKey(Team, related_name='away_team',
                                  on_delete=models.PROTECT, default=0)
    date = models.DateField()

    ground_location = models.CharField(
        max_length=50, blank=True, null=True,
        choices=(('home', 'home'), ('away', 'away')),
        default='home')

    umpire_1 = models.CharField(max_length=50, blank=True, null=True)
    umpire_2 = models.CharField(max_length=50, blank=True, null=True)
    weather = models.CharField(max_length=30,
                               choices=(
                                   ('1', 'sunny'),
                                   ('2', 'sunny spells'),
                                   ('3', 'windy'),
                                   ('4', 'showers'),
                                   ('5', 'heavy rain'),
                                   ('6', 'rain and sun'),
                                   ('7', 'cloudy'),
                                   ('8', 'overcast'),
                                   ('9', 'other'),),
                               default='0')
    
    batting_first = models.CharField(
        max_length=50, blank=True, null=True,
        choices=(('home', 'home'), ('away', 'away')),
        default='home')
    overs = models.IntegerField(default=1)
    # The results will be set as a string once we have finished scoring a game.

    
    # overs_per_bowler = models.IntegerField(default=1)
    result = models.CharField(max_length=50, blank=True, null=True)
    # result = models.CharField(max_length=50, default='x')
    status = models.CharField(max_length=50, blank=True, null=True, default='scheduled')

    def __str__(self):
        return str(self.home_team) + ' vs ' + str(self.away_team)    


class MatchTeamPlayer(models.Model):
    """
    Table will be used to link the Match, Team and Player entities. This will
    allow for there to be a one-to-many relationship between each of these
    entities. Should also make it easier to query data when producing stats
    """

    player_id = models.ForeignKey(User, on_delete=models.PROTECT)
    team_id = models.ForeignKey(Team, on_delete=models.PROTECT)
    match_id = models.ForeignKey(Match, on_delete=models.PROTECT)
    date = models.DateField(default=datetime.now, blank=True, null=True)

    def __str__(self):
        return str(self.player_id)