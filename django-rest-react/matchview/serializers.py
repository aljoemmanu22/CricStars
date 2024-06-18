# serializers.py

from rest_framework import serializers
from match.models import Match, Team, MatchTeamPlayer
from scoring.models import BallByBall 
from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']  # Include other fields as necessary

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__' # Include other fields as necessary  ///////////////////////////////////////////////////////////////////

class MatchSerializer(serializers.ModelSerializer):
    home_team = TeamSerializer(read_only=True)
    away_team = TeamSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Match
        fields = '__all__'


class MatchDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'


class BatterSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player_id.first_name')
    
    class Meta:
        model = MatchTeamPlayer
        fields = ['player_name', 'batting_runs_scored', 'batting_balls_faced', 'batting_fours', 'batting_sixes','batting_strike_rate']

class BowlerSerializer(serializers.ModelSerializer):
    player_name = serializers.CharField(source='player_id.first_name')
    economy = serializers.FloatField()

    class Meta:
        model = MatchTeamPlayer
        fields = ['player_name', 'bowling_wickets', 'bowling_runs_conceded', 'bowling_overs', 'economy', 'bowling_maiden_overs']


class BallByBallSerializer(serializers.ModelSerializer):
    class Meta:
        model = BallByBall
        fields = '__all__'

class UserSerializerr(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name']

class MatchTeamPlayerSerializerr(serializers.ModelSerializer):
    player = UserSerializerr(source='player_id', read_only=True)

    class Meta:
        model = MatchTeamPlayer
        fields = '__all__'


class BallByBallCommentarySerializer(serializers.ModelSerializer):
    striker = serializers.SerializerMethodField()
    non_striker = serializers.SerializerMethodField()
    bowler = serializers.SerializerMethodField()

    class Meta:
        model = BallByBall
        fields = [
            'match_id',
            'onstrike',
            'offstrike',
            'bowler',
            'over',
            'ball_in_over',
            'total_runs',
            'total_wickets',
            'how_out',
            'who_out',
            'people_involved',
            'runs',
            'extras',
            'extras_type',
            'innings',
            'striker',
            'non_striker',
            'bowler',
            'wides',
            'noBalls',
            'legbyes',
            'byes',
            'total_extras',
            'runs_inover',
            'wickets_inover',
        ]

    def get_striker(self, obj):
        striker = MatchTeamPlayer.objects.get(player_id=obj.onstrike, match_id=obj.match_id)
        return {
            'first_name': striker.player_id.first_name,
            'last_name': striker.player_id.last_name,
            'batting_runs_scored': striker.batting_runs_scored,
            'batting_balls_faced': striker.batting_balls_faced,
            'batting_fours': striker.batting_fours,
            'batting_sixes': striker.batting_sixes,
            'batting_strike_rate': striker.batting_strike_rate,
            'batting_stlye': striker.player_id.batting_style,
            
        }

    def get_non_striker(self, obj):
        non_striker = MatchTeamPlayer.objects.get(player_id=obj.offstrike, match_id=obj.match_id)
        return {
            'first_name': non_striker.player_id.first_name,
            'last_name': non_striker.player_id.last_name,
            'batting_runs_scored': non_striker.batting_runs_scored,
            'batting_balls_faced': non_striker.batting_balls_faced,
            'batting_fours': non_striker.batting_fours,
            'batting_sixes': non_striker.batting_sixes,
            'batting_strike_rate': non_striker.batting_strike_rate,
            'batting_stlye': non_striker.player_id.batting_style,
            
        }

    def get_bowler(self, obj):
        bowler = MatchTeamPlayer.objects.get(player_id=obj.bowler, match_id=obj.match_id)
        return {
            'first_name': bowler.player_id.first_name,
            'last_name': bowler.player_id.last_name,
            'bowling_overs': bowler.bowling_overs,
            'bowling_runs_conceded': bowler.bowling_runs_conceded,
            'bowling_wickets': bowler.bowling_wickets,
            'bowling_maiden_overs': bowler.bowling_maiden_overs,
            'bowling_noballs': bowler.bowling_noballs,
            'bowling_wides': bowler.bowling_wides,
            'bowling_fours': bowler.bowling_fours,
            'bowling_sixes': bowler.bowling_sixes,
            'bowling_economy': bowler.bowling_economy,
            'bowling_style': bowler.player_id.bowling_style,
        }
