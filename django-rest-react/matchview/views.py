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
                'is_bowling': player.is_bowling,
                'is_batted' : player.is_bowling,
                'is_bowled' : player.is_bowled
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
                'is_bowling': player.is_bowling,
                'is_batted' : player.is_bowling,
                'is_bowled' : player.is_bowled
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
        last_ball = BallByBall.objects.filter(match_id=match_id).order_by('-id').first()
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
from django.db import connection

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
        who_out = data.get('who_out')

        
        if not (match_id and onstrike and bowler and over is not None and ball_in_over is not None):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch the Match instance
        match = Match.objects.get(id=match_id)
        if match.status != 'live':
            match.status = 'live'
            match.save()

        

        if extras_type != 'wd' and extras_type != 'nb':
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
                    'extras_type': extras_type,
                    'who_out': who_out
                }
            )
        else:
            created = BallByBall.objects.create(
                match_id=match,
                over=over,
                innings=innings,
                onstrike = onstrike,
                offstrike = offstrike,
                bowler = bowler,
                total_runs = total_runs,
                total_wickets = total_wickets,
                how_out = how_out,
                people_involved = people_involved,
                runs = runs,
                extras = extras,
                extras_type = extras_type,
                ball_in_over = ball_in_over,
                who_out = who_out
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

        if ball_in_over == 6 and extras_type == '' or extras_type == 'lb':
            bowler_stats.bowling_overs += 1

        if player.is_batted != True:
            player.is_batted = True
        
        if bowler_stats.is_bowled != True:
            player.is_bowled = True

        if runs == 0 and extras_type == '':
            player.batting_balls_faced += 1
            player.save()

        if runs > 0 and extras_type == '':
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


        # Handle extras
        if extras or extras_type != '':
            if extras_type == 'wide':
                bowler_stats.bowling_wides += 1
                bowler_stats.bowling_runs_conceded += 1
            elif extras_type == 'no_ball':
                bowler_stats.bowling_noballs += 1
                bowler_stats.bowling_runs_conceded += 1 + runs
                player.batting_runs_scored += runs

            bowler_stats.bowling_runs_conceded += 1
            bowler_stats.save()


        if how_out:
            player.how_out = how_out
            player.people_involved = people_involved
            if how_out != 'run_out':
                bowler_stats.bowling_wickets += 1
            out_player = MatchTeamPlayer.objects.get(player_id=who_out, match_id=match_id)
            
            print(f'Before change - Striker: {out_player.is_striker}, Non-Striker: {out_player.is_non_striker}')

            if out_player.is_striker:
                out_player.is_striker = False
                print('view', who_out, 'set is_striker to False')
            elif out_player.is_non_striker:
                out_player.is_non_striker = False
                print('view', who_out, 'set is_non_striker to False')

            print(f'After change - Striker: {out_player.is_striker}, Non-Striker: {out_player.is_non_striker}')

            # Direct SQL query to update the database
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE match_matchteamplayer
                    SET is_striker = %s, is_non_striker = %s
                    WHERE player_id_id = %s AND match_id_id = %s
                """, [out_player.is_striker, out_player.is_non_striker, who_out, match_id])

            # Refresh object from the database
            out_player.refresh_from_db()
            print(f'After save - Striker: {out_player.is_striker}, Non-Striker: {out_player.is_non_striker}')
            
            bowler_stats.save()
            player.save()


        return Response({'message': 'Score updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f'Error updating score: {e}')
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def update_striker_nonstriker(request):
    try:
        data = request.data
        match_id = data.get('match_id')
        striker_id = data.get('striker_id')
        non_striker_id = data.get('non_striker_id')

        # Reset previous strikers
        MatchTeamPlayer.objects.filter(match_id=match_id, is_striker=True).update(is_striker=False)
        MatchTeamPlayer.objects.filter(match_id=match_id, is_non_striker=True).update(is_non_striker=False)

        # Set new strikers
        if striker_id:
            striker = get_object_or_404(MatchTeamPlayer, match_id=match_id, player_id=striker_id)
            striker.is_striker = True
            striker.save()

        if non_striker_id:
            non_striker = get_object_or_404(MatchTeamPlayer, match_id=match_id, player_id=non_striker_id)
            non_striker.is_non_striker = True
            non_striker.save()

        return JsonResponse({'message': 'Striker and non-striker updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
def update_bowler(request):
    try:
        data = request.data
        match_id = data.get('match_id')
        new_bowler_id = data.get('new_bowler_id')
        
        # Find and update the current bowler to set is_bowling to False
        current_bowler = MatchTeamPlayer.objects.filter(match_id=match_id, is_bowling=True).first()
        if current_bowler:
            current_bowler.is_bowling = False
            current_bowler.save()
        
        # Find and update the new bowler to set is_bowling to True
        new_bowler = get_object_or_404(MatchTeamPlayer, match_id=match_id, player_id=new_bowler_id)
        new_bowler.is_bowling = True
        new_bowler.save()

        return JsonResponse({'message': 'Bowler updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    



@api_view(['POST'])
def new_batter_selection(request):
    try:
        data = request.data
        match_id = data.get('match_id')
        player_id = data.get('player_id')
        is_non_striker = data.get('is_non_striker', False)
        
        if not (match_id and player_id):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the player instance
        player = MatchTeamPlayer.objects.get(match_id=match_id, player_id=player_id)

        # Set is_batted to True
        player.is_batted = True

        # Update is_striker or is_non_striker
        if is_non_striker:
            player.is_non_striker = True
            player.is_striker = False
        else:
            player.is_striker = True
            player.is_non_striker = False

        player.save()

        return Response({'message': 'Player status updated successfully'}, status=status.HTTP_200_OK)
    except MatchTeamPlayer.DoesNotExist:
        return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
