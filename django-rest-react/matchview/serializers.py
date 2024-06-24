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



# ########################################################## live serializers ################################################################


class PlayerStatusLiveSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='player_id.first_name')
    
    class Meta:
        model = MatchTeamPlayer
        fields = [
            'id', 'player_id', 'first_name', 'is_striker', 'is_non_striker', 'is_bowling',
            'batting_runs_scored', 'batting_balls_faced', 'batting_fours', 'batting_sixes',
            'batting_strike_rate', 'bowling_overs', 'bowling_runs_conceded', 'bowling_wickets',
            'bowling_maiden_overs', 'bowling_economy'
        ]

class BallLiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = BallByBall
        fields = [
            'over', 'ball_in_over', 'runs', 'extras', 'extras_type', 'how_out', 'innings',
            'onstrike', 'offstrike', 'people_involved'
        ]

class MatchLiveSerializer(serializers.ModelSerializer):
    home_team = serializers.CharField(source='home_team.team_name')
    away_team = serializers.CharField(source='away_team.team_name')
    current_striker = serializers.SerializerMethodField()
    current_non_striker = serializers.SerializerMethodField()
    current_bowler = serializers.SerializerMethodField()
    current_over = serializers.SerializerMethodField()
    last_ball = serializers.SerializerMethodField()
    last_ball_innings_1 = serializers.SerializerMethodField()
    last_ball_innings_2 = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = [
            'id', 'home_team', 'away_team', 'current_striker', 'current_non_striker',
            'current_bowler', 'current_over', 'last_ball', 'last_ball_innings_1', 'last_ball_innings_2',
            'created_by', 'date', 'ground_location', 'toss_winner', 'elected_to',
            'batting_first', 'overs', 'status', 'innings'
        ]

    def get_current_striker(self, obj):
        try:
            player = MatchTeamPlayer.objects.get(match_id=obj, is_striker=True)
            return PlayerStatusLiveSerializer(player).data
        except MatchTeamPlayer.DoesNotExist:
            return None

    def get_current_non_striker(self, obj):
        try:
            player = MatchTeamPlayer.objects.get(match_id=obj, is_non_striker=True)
            return PlayerStatusLiveSerializer(player).data
        except MatchTeamPlayer.DoesNotExist:
            return None

    def get_current_bowler(self, obj):
        try:
            player = MatchTeamPlayer.objects.get(match_id=obj, is_bowling=True)
            return PlayerStatusLiveSerializer(player).data
        except MatchTeamPlayer.DoesNotExist:
            return None

    def get_current_over(self, obj):
        current_innings = obj.innings
        try:
            latest_ball = BallByBall.objects.filter(match_id=obj, innings=current_innings).order_by('-over', '-ball_in_over').first()
            if latest_ball:
                current_over_number = latest_ball.over
                balls = BallByBall.objects.filter(match_id=obj, innings=current_innings, over=current_over_number).order_by('ball_in_over')
                return BallByBallCommentarySerializer(balls, many=True).data
            else:
                return []
        except BallByBall.DoesNotExist:
            return []

    def get_last_ball(self, obj):
        current_innings = obj.innings
        try:
            ball = BallByBall.objects.filter(match_id=obj, innings=current_innings).order_by('-over', '-ball_in_over').first()
            return BallLiveSerializer(ball).data
        except BallByBall.DoesNotExist:
            return None

    def get_last_ball_innings_1(self, obj):
        try:
            ball = BallByBall.objects.filter(match_id=obj, innings=1).order_by('-over', '-ball_in_over').first()
            return BallLiveSerializer(ball).data
        except BallByBall.DoesNotExist:
            return None

    def get_last_ball_innings_2(self, obj):
        if obj.innings < 2:
            return None
        try:
            ball = BallByBall.objects.filter(match_id=obj, innings=2).order_by('-over', '-ball_in_over').first()
            return BallLiveSerializer(ball).data
        except BallByBall.DoesNotExist:
            return None
