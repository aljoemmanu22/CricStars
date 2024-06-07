from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Match, Team, User, MatchTeamPlayer
from .serializers import MatchSerializer, TeamSerializer, UserSerializer
from rest_framework import viewsets, status
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated, AllowAny

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='user-teams')
    def get_user_teams(self, request):
        user = request.user

#########################################
        # played_for_teams = MatchTeamPlayer.objects.filter(player_id=user)
        # Teams the user has played for
        # teams_played_for = played_for_teams.values_list('team_id', flat=True).distinct()
        
        # Teams the user has played against
        # user_matches = MatchTeamPlayer.objects.filter(player_id=user)

        # teams_played_against = user_matches.exclude(team_id__in=user_matches.values_list('team_id', flat=True)).values_list('team_id', flat=True).distinct()
#########################################   

        teams_played_for = Team.objects.all()
        teams_played_against = Team.objects.all()     
        
        return Response({
            "teams_played_for": TeamSerializer(teams_played_for, many=True).data,
            "teams_played_against": TeamSerializer(teams_played_against, many=True).data
        })

    
    @action(detail=True, methods=['post'])
    def add_players(self, request, pk=None):
        match = self.get_object()
        players_data = request.data.get('players', [])
        
        if len(players_data) > 24:
            return Response({"error": "Cannot add more than 24 players to a team."}, status=status.HTTP_400_BAD_REQUEST)
        
        for player_data in players_data:
            phone_number = player_data.get('phone_number')
            first_name = player_data.get('first_name')
            team_id = player_data.get('team_id')
            
            if not phone_number or not first_name or not team_id:
                return Response({"error": "Player data must include phone number, first name, and team ID."}, status=status.HTTP_400_BAD_REQUEST)

            user, created = User.objects.get_or_create(phone_number=phone_number, defaults={'first_name': first_name})
            team = Team.objects.get(id=team_id)
            MatchTeamPlayer.objects.create(player_id=user, team_id=team, match_id=match)
        
        return Response({"status": "Players added successfully."}, status=status.HTTP_200_OK)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

