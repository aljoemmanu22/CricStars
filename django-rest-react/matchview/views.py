# views.py

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from match.models import Match
from .serializers import MatchSerializer, MatchDetailSerializer
from match.serializers import MatchTeamPlayerSerializer
from rest_framework.permissions import IsAuthenticated
from accounts.models import User
from rest_framework import generics, status
from match.models import Match, MatchTeamPlayer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view

from django.http import JsonResponse
from scoring.models import BallByBall


class MatchesViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='live-scheduled')
    def get_live_scheduled_matches(self, request):
        live_matches = Match.objects.filter(status='live')
        scheduled_matches = Match.objects.filter(status='scheduled')
        live_serializer = MatchSerializer(live_matches, many=True)
        scheduled_serializer = MatchSerializer(scheduled_matches, many=True)
        return Response({
            'live_matches': live_serializer.data,
            'scheduled_matches': scheduled_serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='user-live-scheduled')
    def get_user_live_scheduled_matches(self, request):
        user = request.user
        live_matches = Match.objects.filter(status='live', created_by=user)
        scheduled_matches = Match.objects.filter(status='scheduled', created_by=user)
        live_serializer = MatchSerializer(live_matches, many=True)
        scheduled_serializer = MatchSerializer(scheduled_matches, many=True)
        return Response({
            'live_matches': live_serializer.data,
            'scheduled_matches': scheduled_serializer.data
        })


# views.py
class MatchDetailView(generics.RetrieveAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchDetailSerializer

    def get(self, request, *args, **kwargs):
        match_id = self.kwargs['pk']
        match = get_object_or_404(Match, id=match_id)

        home_team_players = MatchTeamPlayer.objects.filter(match_id=match_id, team_id=match.home_team.id)
        away_team_players = MatchTeamPlayer.objects.filter(match_id=match_id, team_id=match.away_team.id)

        home_team_players_data = []
        for player in home_team_players:
            user = User.objects.get(id=player.player_id.id)
            home_team_players_data.append({
                'id': user.id,
                'name': user.first_name,
                'role': user.role,
                'batting_style': user.batting_style,
                'bowling_style': user.bowling_style,
                'is_striker': player.is_striker,
                'is_non_striker': player.is_non_striker,
                'is_bowling': player.is_bowling
            })

        away_team_players_data = []
        for player in away_team_players:
            user = User.objects.get(id=player.player_id.id)
            away_team_players_data.append({
                'id': user.id,
                'name': user.first_name,
                'role': user.role,
                'batting_style': user.batting_style,
                'bowling_style': user.bowling_style,
                'is_striker': player.is_striker,
                'is_non_striker': player.is_non_striker,
                'is_bowling': player.is_bowling
            })

        current_striker = None
        current_non_striker = None
        current_bowler = None

        if match.status == 'live':
            current_striker = MatchTeamPlayer.objects.filter(match_id=match_id, is_striker=True).first()
            current_non_striker = MatchTeamPlayer.objects.filter(match_id=match_id, is_non_striker=True).first()
            current_bowler = MatchTeamPlayer.objects.filter(match_id=match_id, is_bowling=True).first()

            if current_striker:
                user = User.objects.get(id=current_striker.player_id.id)
                current_striker_data = MatchTeamPlayerSerializer(current_striker).data
                current_striker_data['name'] = user.first_name
            else:
                current_striker_data = None

            if current_non_striker:
                user = User.objects.get(id=current_non_striker.player_id.id)
                current_non_striker_data = MatchTeamPlayerSerializer(current_non_striker).data
                current_non_striker_data['name'] = user.first_name
            else:
                current_non_striker_data = None

            if current_bowler:
                user = User.objects.get(id=current_bowler.player_id.id)
                current_bowler_data = MatchTeamPlayerSerializer(current_bowler).data
                current_bowler_data['name'] = user.first_name
            else:
                current_bowler_data = None
        else:
            current_striker_data = None
            current_non_striker_data = None
            current_bowler_data = None

        # Fetch the last ball data for the current match
        last_ball = BallByBall.objects.filter(match_id=match_id).order_by('-over', '-ball_in_over').first()
        if last_ball:
            last_ball_data = {
                'onstrike': last_ball.onstrike,
                'offstrike': last_ball.offstrike,
                'bowler': last_ball.bowler,
                'over': last_ball.over,
                'ball_in_over': last_ball.ball_in_over,
                'total_runs': last_ball.total_runs,
                'total_wickets': last_ball.total_wickets,
                'how_out': last_ball.how_out,
                'people_involved': last_ball.people_involved,
                'runs': last_ball.runs,
                'extras': last_ball.extras,
                'extras_type': last_ball.extras_type,
                'innings': last_ball.innings
            }
        else:
            last_ball_data = None

        match_data = {
            'match': MatchDetailSerializer(match).data,
            'home_team': {
                'id': match.home_team.id,
                'name': match.home_team.team_name
            },
            'away_team': {
                'id': match.away_team.id,
                'name': match.away_team.team_name
            },
            'home_team_players': home_team_players_data,
            'away_team_players': away_team_players_data,
            'current_striker': current_striker_data,
            'current_non_striker': current_non_striker_data,
            'current_bowler': current_bowler_data,
            'last_ball': last_ball_data
        }
        return Response(match_data)



@api_view(['POST'])
def update_player_info(request):
    try:
        user_id = request.data['user_id']
        role = request.data.get('role', '')
        batting_style = request.data.get('batting_style', '')
        bowling_style = request.data.get('bowling_style', '')

        user = User.objects.get(id=user_id)
        if role:
            user.role = role
        if batting_style:
            user.batting_style = batting_style
        if bowling_style:
            user.bowling_style = bowling_style
        user.save()

        return Response({'status': 'success', 'message': 'Player information updated successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    # views.py



def live_scorecard(request, match_id):
    match = get_object_or_404(Match, id=match_id)
    ball_by_ball_data = BallByBall.objects.filter(match_id=match_id).order_by('over', 'ball_in_over')
    
    current_innings = ball_by_ball_data.last().innings if ball_by_ball_data.exists() else 1

    batters = {}
    bowlers = {}
    current_over_balls = []
    total_runs = 0
    total_wickets = 0

    for ball in ball_by_ball_data:
        if ball.innings != current_innings:
            continue
        total_runs += ball.runs + ball.extras
        if ball.how_out:
            total_wickets += 1
            batters[ball.onstrike] = batters.get(ball.onstrike, {'runs': 0, 'balls': 0, '4s': 0, '6s': 0, 'how_out': ball.how_out, 'people_involved': ball.people_involved})
        if ball.bowler not in bowlers:
            bowlers[ball.bowler] = {'overs': 0, 'maidens': 0, 'runs_conceded': 0, 'wickets': 0}
        batters[ball.onstrike] = batters.get(ball.onstrike, {'runs': 0, 'balls': 0, '4s': 0, '6s': 0})
        batters[ball.onstrike]['runs'] += ball.runs
        batters[ball.onstrike]['balls'] += 1
        if ball.runs == 4:
            batters[ball.onstrike]['4s'] += 1
        elif ball.runs == 6:
            batters[ball.onstrike]['6s'] += 1
        bowlers[ball.bowler]['runs_conceded'] += ball.runs + ball.extras
        if ball.how_out:
            bowlers[ball.bowler]['wickets'] += 1
        current_over_balls.append(ball.runs + ball.extras)

    response_data = {
        'match': {
            'home_team': match.home_team.team_name,
            'away_team': match.away_team.team_name,
            'current_innings': current_innings,
            'total_runs': total_runs,
            'total_wickets': total_wickets,
            'current_over_balls': current_over_balls,
        },
        'batters': [
            {
                'name': batter,
                'runs': stats['runs'],
                'balls': stats['balls'],
                '4s': stats['4s'],
                '6s': stats['6s'],
                'strike_rate': round((stats['runs'] / stats['balls']) * 100, 2) if stats['balls'] > 0 else 0,
                'how_out': stats.get('how_out', 'not out'),
                'people_involved': stats.get('people_involved', ''),
            }
            for batter, stats in batters.items()
        ],
        'bowlers': [
            {
                'name': bowler,
                'overs': stats['overs'],
                'maidens': stats['maidens'],
                'runs_conceded': stats['runs_conceded'],
                'wickets': stats['wickets'],
                'economy_rate': round(stats['runs_conceded'] / stats['overs'], 2) if stats['overs'] > 0 else 0,
            }
            for bowler, stats in bowlers.items()
        ],
    }

    return JsonResponse(response_data)





import logging
from rest_framework.parsers import JSONParser

logger = logging.getLogger(__name__)

@api_view(['POST'])
def update_score(request):
    try:
        data = JSONParser().parse(request)
        logger.debug(f'Received data: {data}')
        
        match_id = data.get('match_id')
        onstrike = data.get('onstrike')
        offstrike = data.get('offstrike')
        bowler = data.get('bowler')
        over = data.get('over')
        ball_in_over = data.get('ball_in_over')
        total_runs = data.get('total_runs')
        total_wickets = data.get('total_wickets')
        how_out = data.get('how_out')
        people_involved = data.get('people_involved')
        runs = data.get('runs')
        extras = data.get('extras')
        extras_type = data.get('extras_type')
        innings = data.get('innings')

        if not (match_id and onstrike and bowler and over is not None and ball_in_over is not None):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch the Match instance
        match = Match.objects.get(id=match_id)
        if match.status != 'live':
            match.status = 'live'
            match.save()

        # Create or update the BallByBall entry
        ball, created = BallByBall.objects.get_or_create(
            match_id=match,
            over=over,
            ball_in_over=ball_in_over,
            innings=innings,
            defaults={
                'onstrike': onstrike,
                'offstrike': offstrike,
                'bowler': bowler,
                'total_runs': total_runs,
                'total_wickets': total_wickets,
                'how_out': how_out,
                'people_involved': people_involved,
                'runs': runs,
                'extras': extras,
                'extras_type': extras_type
            }
        )

        if not created:
            # Update existing entry
            ball.onstrike = onstrike
            ball.offstrike = offstrike
            ball.bowler = bowler
            ball.total_runs = total_runs
            ball.total_wickets = total_wickets
            ball.how_out = how_out
            ball.people_involved = people_involved
            ball.runs = runs
            ball.extras = extras
            ball.extras_type = extras_type
            ball.over = over
            ball.ball_in_over = ball_in_over
            ball.save()
        
        player = MatchTeamPlayer.objects.get(player_id=onstrike, match_id=match_id)
        bowler_stats = MatchTeamPlayer.objects.get(player_id=bowler, match_id=match_id)

        if runs == 0:
            player.batting_balls_faced += 1
            player.save()

        if runs > 0:
            player.batting_balls_faced += 1
            player.batting_runs_scored += runs
            if runs == 4:
                player.batting_fours += 1
                bowler_stats.bowling_fours += 1
            if runs == 6:
                player.batting_sixes += 1
                bowler_stats.bowling_sixes += 1
            player.save()
            bowler_stats.bowling_runs_conceded += runs
            bowler_stats.save()
        
        # Additional logic for updating player stats...
        # Update MatchTeamPlayer stats if it's not an extras ball
        
        if how_out:
            # Update player's how_out and people_involved
            player = MatchTeamPlayer.objects.get(player_id=onstrike, match_id=match_id)
            player.how_out = how_out
            player.people_involved = people_involved
            player.save()

            # Check if the wicket is not run out, then credit the wicket to the bowler
            if how_out != 'run out':
                bowler_player = MatchTeamPlayer.objects.get(player_id=bowler, match_id=match_id)
                bowler_player.bowling_wickets += 1
                bowler_player.save()

        # Handle extras
        if extras:
            if extras_type == 'wide':
                bowler_stats.bowling_wides += 1
            elif extras_type == 'no_ball':
                bowler_stats.bowling_noballs += 1
            bowler_stats.bowling_runs_conceded += 1
            bowler_stats.save()

        

        return Response({'message': 'Score updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f'Error updating score: {e}')
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


