# serializers.py

from rest_framework import serializers
from match.models import Match, Team
from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']  # Include other fields as necessary

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'team_name']  # Include other fields as necessary

class MatchSerializer(serializers.ModelSerializer):
    home_team = TeamSerializer(read_only=True)
    away_team = TeamSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Match
        fields = '__all__'
