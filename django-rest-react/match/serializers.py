from rest_framework import serializers
from .models import Match, Team, User, MatchTeamPlayer

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class MatchTeamPlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchTeamPlayer
        fields = '__all__'