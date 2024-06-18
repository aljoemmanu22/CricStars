from django.db import models
from match.models import Match


# Create your models here.
class BallByBall(models.Model):
    """
    BallByBall table will be used store details about the event of each ball
    
    Each of the private properties below is a column/attribute in the table.
    
    The purpose of each column names is pretty self-explanantory. 
    """

    # Will store the match id of the latest game
    match_id = models.ForeignKey(Match, related_name='match_id',
                                 on_delete=models.PROTECT)
    onstrike = models.CharField(max_length=30, blank=True, null=True)
    offstrike = models.CharField(max_length=30, blank=True, null=True)
    bowler = models.CharField(max_length=30, blank=True, null=True)
    over = models.IntegerField(default=0, blank=True, null=True)
    ball_in_over = models.IntegerField(default=0, blank=True, null=True)
    total_runs = models.IntegerField(default=0, blank=True, null=True)
    total_wickets = models.IntegerField(default=0, blank=True, null=True)
    how_out = models.CharField(max_length=20, blank=True, null=True)
    who_out = models.CharField(max_length=20, blank=True, null=True)
    people_involved = models.JSONField(blank=True, null=True)
    runs = models.IntegerField(default=0, blank=True, null=True)
    extras = models.IntegerField(default=0, blank=True, null=True)
    extras_type = models.CharField(max_length=20, blank=True, null=True)
    innings = models.IntegerField(default=1)
    wides = models.IntegerField(default=0, blank=True, null=True)
    noBalls = models.IntegerField(default=0, blank=True, null=True)
    legbyes = models.IntegerField(default=0, blank=True, null=True)
    byes = models.IntegerField(default=0, blank=True, null=True)
    total_extras = models.IntegerField(default=0, blank=True, null=True) 
    runs_inover = models.IntegerField(default=0, blank=True, null=True)
    wickets_inover = models.IntegerField(default=0, blank=True, null=True)

    def __str__(self):
        """
        When a 'BallByBall' record/object is referred to in the Django admin view 
        (according to searching/admin.py file) , we cannot display everything in the 
        record. The value returned by this function will be the value seen. So in 
        this case, to represent a 'Team' instance, you will see the value stored in the 
        'team_name' field for that record.
        """
        return 'Match: {}, Ball: {}.{}'.format(self.match_id,
                                               self.over,
                                               self.ball_in_over)