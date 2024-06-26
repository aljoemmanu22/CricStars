# views.py

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from match.models import Match
from .serializers import MatchSerializer, MatchDetailSerializer, TeamSerializer, BatterSerializer, BowlerSerializer, BallByBallSerializer, MatchTeamPlayerSerializerr, BallByBallCommentarySerializer
from match.serializers import MatchTeamPlayerSerializer
from rest_framework.permissions import IsAuthenticated
from accounts.models import User
from rest_framework import generics, status
from match.models import Match, MatchTeamPlayer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from django.db.models import F, FloatField, ExpressionWrapper

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

        enhanced_live_matches = []
        for match in live_matches:
            last_ball_innings1 = BallByBall.objects.filter(match_id=match, innings=1).order_by('-over', '-ball_in_over').first()
            last_ball_innings2 = BallByBall.objects.filter(match_id=match, innings=2).order_by('-over', '-ball_in_over').first()
            
            match_data = {
                'match': MatchSerializer(match).data,
                'last_ball_innings1': {
                    'total_runs': last_ball_innings1.total_runs,
                    'total_wickets': last_ball_innings1.total_wickets,
                    'overs': last_ball_innings1.over,
                    'balls': last_ball_innings1.ball_in_over,
                } if last_ball_innings1 else None,
                'last_ball_innings2': {
                    'total_runs': last_ball_innings2.total_runs,
                    'total_wickets': last_ball_innings2.total_wickets,
                    'overs': last_ball_innings2.over,
                    'balls': last_ball_innings2.ball_in_over,
                } if last_ball_innings2 else None,
            }
            enhanced_live_matches.append(match_data)

        scheduled_serializer = MatchSerializer(scheduled_matches, many=True)

        return Response({
            'live_matches': enhanced_live_matches,
            'scheduled_matches': scheduled_serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='user-live-scheduled')
    def get_user_live_scheduled_matches(self, request):
        user = request.user
        live_matches = Match.objects.filter(status='live', created_by=user)
        scheduled_matches = Match.objects.filter(status='scheduled', created_by=user)

        enhanced_live_matches = []
        for match in live_matches:
            last_ball_innings1 = BallByBall.objects.filter(match_id=match, innings=1).order_by('-over', '-ball_in_over').first()
            last_ball_innings2 = BallByBall.objects.filter(match_id=match, innings=2).order_by('-over', '-ball_in_over').first()
            
            match_data = {
                'match': MatchSerializer(match).data,
                'last_ball_innings1': {
                    'total_runs': last_ball_innings1.total_runs,
                    'total_wickets': last_ball_innings1.total_wickets,
                    'overs': last_ball_innings1.over,
                    'balls': last_ball_innings1.ball_in_over,
                } if last_ball_innings1 else None,
                'last_ball_innings2': {
                    'total_runs': last_ball_innings2.total_runs,
                    'total_wickets': last_ball_innings2.total_wickets,
                    'overs': last_ball_innings2.over,
                    'balls': last_ball_innings2.ball_in_over,
                } if last_ball_innings2 else None,
            }
            enhanced_live_matches.append(match_data)

        scheduled_serializer = MatchSerializer(scheduled_matches, many=True)

        return Response({
            'live_matches': enhanced_live_matches,
            'scheduled_matches': scheduled_serializer.data
        })

    @action(detail=False, methods=['get'], url_path='scorecard-past')
    def get_past_matches(self, request):
        past_matches = Match.objects.filter(status='past')
        past_serializer = MatchSerializer(past_matches, many=True)
        
        enhanced_matches = []
        for match in past_matches:
            last_ball_innings1 = BallByBall.objects.filter(match_id=match, innings=1).order_by('-over', '-ball_in_over').first()
            last_ball_innings2 = BallByBall.objects.filter(match_id=match, innings=2).order_by('-over', '-ball_in_over').first()
            # If innings 2 does not exist, try to get the last ball of innings 3
            if not last_ball_innings2:
                last_ball_innings2 = BallByBall.objects.filter(match_id=match, innings=3).order_by('-over', '-ball_in_over').first()
            match_data = {
                'match': MatchSerializer(match).data,
                'last_ball_innings1': {
                    'total_runs': last_ball_innings1.total_runs,
                    'total_wickets': last_ball_innings1.total_wickets,
                    'overs': last_ball_innings1.over,
                    'balls': last_ball_innings1.ball_in_over,
                } if last_ball_innings1 else None,
                'last_ball_innings2': {
                    'total_runs': last_ball_innings2.total_runs,
                    'total_wickets': last_ball_innings2.total_wickets,
                    'overs': last_ball_innings2.over,
                    'balls': last_ball_innings2.ball_in_over,
                } if last_ball_innings2 else None,
            }
            enhanced_matches.append(match_data)
        
        return Response({
            'past_matches': enhanced_matches,
        })

    

@api_view(['POST'])
def handleStartMatch(request):
    try:
        data = request.data
        match_id = data.get('match_id')
        if not match_id:
            return Response({'error': 'Match ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        match = Match.objects.get(id=match_id)
        match.status = 'live'
        match.innings = 1
        match.save()

        return Response({'message': 'Match started successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def handleInningsChange(request):
    try:
        data = request.data
        match_id = data.get('match_id')
        if not match_id:
            return Response({'error': 'Match ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        match = Match.objects.get(id=match_id)
        if match.innings == 1:
            match.innings += 1
        match.save()
        print('done')

        # Reset is_striker and is_non_striker fields for all players
        players = MatchTeamPlayer.objects.filter(match_id=match_id)
        players.update(is_striker=False, is_non_striker=False, is_bowling=False)

        return Response({'message': 'Innings changed successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def handleEndMatch(request):
    try:
        data = request.data
        print("Incoming data:", data)  # Add logging to check incoming data
        match_id = data.get('match_id')
        result = data.get('result')

        if not match_id:
            return Response({'error': 'Match ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not result:
            return Response({'error': 'Match result is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            match = Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return Response({'error': 'Match not found'}, status=status.HTTP_404_NOT_FOUND)

        match.status = 'past'
        match.result = result
        match.save()

        match_players = MatchTeamPlayer.objects.filter(match_id=match_id)

        for player in match_players:
            user = player.player_id

            # Ensure fields are initialized
            user.batting_total_runs_scored = user.batting_total_runs_scored or 0
            user.batting_inning = user.batting_inning or 0
            user.batting_high_score = user.batting_high_score or 0
            user.batting_total_balls_faced = user.batting_total_balls_faced or 0
            user.batting_100s = user.batting_100s or 0
            user.batting_50s = user.batting_50s or 0
            user.bowling_total_overs_bowled = user.bowling_total_overs_bowled or 0
            user.bowling_runs_conceded = user.bowling_runs_conceded or 0
            user.bowling_wickets = user.bowling_wickets or 0
            user.bowling_best_figures = user.bowling_best_figures or 'NA'
            user.bowling_5ws = user.bowling_5ws or 0

            # Update batting statistics
            if player.is_batted:
                user.batting_total_runs_scored += player.batting_runs_scored or 0
                user.batting_inning += 1
                if player.batting_runs_scored > user.batting_high_score:
                    user.batting_high_score = player.batting_runs_scored
                user.batting_total_balls_faced += player.batting_balls_faced or 0

                # Update batting 50s and 100s
                if player.batting_runs_scored >= 100:
                    user.batting_100s += 1
                elif player.batting_runs_scored >= 50:
                    user.batting_50s += 1

            # Update bowling statistics
            if player.is_bowled:
                user.bowling_total_overs_bowled += player.bowling_overs or 0
                user.bowling_runs_conceded += player.bowling_runs_conceded or 0
                user.bowling_wickets += player.bowling_wickets or 0

                # Update bowling best figures
                current_best_figures = user.bowling_best_figures.split('/')
                if current_best_figures[0] == 'NA' or player.bowling_wickets > int(current_best_figures[0]) or (player.bowling_wickets == int(current_best_figures[0]) and player.bowling_runs_conceded < int(current_best_figures[1])):
                    user.bowling_best_figures = f"{player.bowling_wickets}/{player.bowling_runs_conceded}"

                # Update 5-wicket hauls
                if player.bowling_wickets >= 5:
                    user.bowling_5ws += 1

            # Recalculate averages and strike rates
            if user.batting_total_balls_faced > 0:
                user.batting_strike_rate = (user.batting_total_runs_scored / user.batting_total_balls_faced) * 100
            if user.batting_inning > 0:
                user.batting_average = user.batting_total_runs_scored / user.batting_inning

            if user.bowling_total_overs_bowled > 0:
                user.bowling_economy = user.bowling_runs_conceded / user.bowling_total_overs_bowled
            if user.bowling_wickets > 0:
                user.bowling_average = user.bowling_runs_conceded / user.bowling_wickets
                user.bowling_strike_rate = user.bowling_total_overs_bowled / user.bowling_wickets

            user.save()

        return Response({'success': 'Match ended and statistics updated'}, status=status.HTTP_200_OK)

    except Exception as e:
        print("Error ending match:", str(e))
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
                'is_batted' : player.is_batted,
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

        innings = match.innings
        # Fetch the last ball data for the current match
        last_ball = BallByBall.objects.filter(match_id=match_id, innings=innings).order_by('-id').first()
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
                'innings': last_ball.innings,
                'wides':last_ball.wides,
                'noBalls':last_ball.noBalls,
                'legbyes':last_ball.legbyes,
                'byes':last_ball.byes,
                'total_extras':last_ball.total_extras,
                'runs_inover':last_ball.runs_inover,
                'wickets_inover':last_ball.wickets_inover
            }
        else:
            last_ball_data = None

        # Fetch the events for the current over
        current_over_events = BallByBall.objects.filter(match_id=match_id, innings=innings, over=last_ball.over if last_ball else 0).order_by('ball_in_over')
        current_over_data = [
            {
                'runs': event.runs,
                'extras': event.extras,
                'extras_type': event.extras_type,
                'how_out': event.how_out,
            }
            for event in current_over_events
        ]

        first_innings_last_ball = None
        if match.innings != 1:
            first_innings_last_ball = BallByBall.objects.filter(match_id=match_id, innings=1).order_by('-id').first()
            if first_innings_last_ball:
                first_innings_last_ball = {
                    'onstrike': first_innings_last_ball.onstrike,
                    'offstrike': first_innings_last_ball.offstrike,
                    'bowler': first_innings_last_ball.bowler,
                    'over': first_innings_last_ball.over,
                    'ball_in_over': first_innings_last_ball.ball_in_over,
                    'total_runs': first_innings_last_ball.total_runs,
                    'total_wickets': first_innings_last_ball.total_wickets,
                    'how_out': first_innings_last_ball.how_out,
                    'people_involved': first_innings_last_ball.people_involved,
                    'runs': first_innings_last_ball.runs,
                    'extras': first_innings_last_ball.extras,
                    'extras_type': first_innings_last_ball.extras_type,
                    'innings': first_innings_last_ball.innings,
                    'wides':first_innings_last_ball.wides,
                    'noBalls':first_innings_last_ball.noBalls,
                    'legbyes':first_innings_last_ball.legbyes,
                    'byes':first_innings_last_ball.byes,
                    'total_extras':first_innings_last_ball.total_extras,
                    'runs_inover':first_innings_last_ball.runs_inover,
                    'wickets_inover':first_innings_last_ball.wickets_inover
                }
            else:
                first_innings_last_ball = None
        
        first_innings_total = 0
        if innings == 2:
            first_innings_total_runs = BallByBall.objects.filter(match_id=match_id, innings=1).order_by('-id').first()
            if first_innings_total_runs:
                first_innings_total = first_innings_total_runs.total_runs

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
            'last_ball': last_ball_data,
            'current_over': current_over_data,
            'first_innings_last_ball': first_innings_last_ball,
            'first_innings_total': first_innings_total
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
from django.db import transaction


def broadcast_match_update(match_id):
    channel_layer = get_channel_layer()
    match = Match.objects.get(id=match_id)
    match_data = MatchLiveSerializer(match).data
    async_to_sync(channel_layer.group_send)(
        f'match_{match_id}',
        {
            'type': 'match_update',
            'match_data': match_data
        }
    )


logger = logging.getLogger(__name__)

@transaction.atomic
@api_view(['POST']) 
def update_score(request): 
    try:
        data = JSONParser().parse(request)
        logger.debug(f'Received data: {data}')
        
        # Extract and convert data fields to appropriate types
        try:
            match_id = int(data.get('match_id'))
            onstrike = int(data.get('onstrike'))
            offstrike = int(data.get('offstrike'))
            bowler = int(data.get('bowler'))
            over = int(data.get('over'))
            ball_in_over = int(data.get('ball_in_over'))
            total_runs = int(data.get('total_runs'))
            total_wickets = int(data.get('total_wickets'))
            how_out = data.get('how_out', '')
            people_involved = data.get('people_involved', '')
            runs = int(data.get('runs'))
            extras = int(data.get('extras'))
            extras_type = data.get('extras_type', '')
            innings = int(data.get('innings'))
            who_out = data.get('who_out', '')
            wides = int(data.get('wides'))
            noBalls = int(data.get('noBalls'))
            legbyes = int(data.get('legbyes'))
            byes = int(data.get('byes'))
            total_extras = int(data.get('total_extras'))
            runs_inover = int(data.get('runs_inover'))
            wickets_inover = int(data.get('wickets_inover'))
        except (ValueError, TypeError) as e:
            logger.error(f'Data conversion error: {e}')
            return Response({'error': f'Data conversion error: {e}'}, status=status.HTTP_400_BAD_REQUEST)
    
        if extras_type:
            total_extras += extras

        if extras_type and ball_in_over != 1:
            runs_inover += extras
        
        if how_out and ball_in_over != 1:
            wickets_inover += 1
            
        if not (match_id and onstrike and bowler and over is not None and ball_in_over is not None):
            return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        match = Match.objects.get(id=match_id)

        if ball_in_over == 1 and over != 0:
            prev_ball = BallByBall.objects.filter(match_id=match).order_by('-over', '-ball_in_over').first()
            if prev_ball:
                if prev_ball.ball_in_over == 1:
                    runs_inover += runs
                else:
                    runs_inover = runs
                    if extras_type:
                        runs_inover += extras
                if how_out:
                    wickets_inover = 1
                else:
                    wickets_inover = 0

        if match.status != 'live':
            match.status = 'live'
            match.save()

        if extras_type not in ['wd', 'nb', 'bye']:
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
                    'who_out': who_out,
                    'wides': wides,
                    'noBalls': noBalls,
                    'legbyes': legbyes,
                    'byes': byes,
                    'total_extras': total_extras
                }
            )
        else:
            if ball_in_over == 0:
                ball_in_over += 1
            created = BallByBall.objects.create(
                match_id=match,
                over=over,
                innings=innings,
                onstrike=onstrike,
                offstrike=offstrike,
                bowler=bowler,
                total_runs=total_runs,
                total_wickets=total_wickets,
                how_out=how_out,
                people_involved=people_involved,
                runs=runs,
                extras=extras,
                extras_type=extras_type,
                ball_in_over=ball_in_over,
                who_out=who_out,
                wides=wides,
                noBalls=noBalls,
                legbyes=legbyes,
                byes=byes,
                total_extras=total_extras
            )

        if not created:
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
            ball.wides = wides
            ball.noBalls = noBalls
            ball.legbyes = legbyes
            ball.byes = byes
            ball.total_extras = total_extras
            ball.save()

        if not who_out:
            player = MatchTeamPlayer.objects.get(player_id=onstrike, match_id=match_id)
        else:
            out_player = MatchTeamPlayer.objects.get(player_id=who_out, match_id=match_id)
        bowler_stats = MatchTeamPlayer.objects.get(player_id=bowler, match_id=match_id)

        if not who_out:
            if not player.is_batted:
                player.is_batted = True
            
            if not bowler_stats.is_bowled:
                bowler_stats.is_bowled = True

            if runs == 0 and not extras_type:
                player.batting_balls_faced += 1
                player.save()

            if runs > 0 and not extras_type:
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
                if ball_in_over == 6:
                    bowled_over = int(bowler_stats.bowling_overs)
                    bowler_stats.bowling_overs = f"{bowled_over + 1}.0"
                else:
                    bowled_over = int(bowler_stats.bowling_overs)
                    bowler_stats.bowling_overs = f"{bowled_over}.{ball_in_over}"
                bowler_stats.save()

            if extras or extras_type:
                if extras_type == 'wd':
                    bowler_stats.bowling_wides += 1
                    bowler_stats.bowling_runs_conceded += extras
                elif extras_type == 'nb':
                    bowler_stats.bowling_noballs += 1
                    bowler_stats.bowling_runs_conceded += 1 + runs
                    player.batting_runs_scored += runs
                elif extras_type == 'lb':
                    if ball_in_over == 6:
                        bowled_over = int(bowler_stats.bowling_overs)
                        bowler_stats.bowling_overs = f"{bowled_over + 1}.0"
                    else:
                        bowled_over = int(bowler_stats.bowling_overs)
                        bowler_stats.bowling_overs = f"{bowled_over}.{ball_in_over}"
                bowler_stats.save()
                player.save()
            
            if player.batting_balls_faced > 0:
                player.batting_strike_rate = (player.batting_runs_scored / player.batting_balls_faced) * 100
                player.save()

            # Ensure bowler_stats.bowling_overs is a float before comparison
            if float(bowler_stats.bowling_overs) > 0:
                bowler_stats.bowling_economy = bowler_stats.bowling_runs_conceded / float(bowler_stats.bowling_overs)
                bowler_stats.save()

        if how_out:
            out_player.how_out = how_out
            out_player.people_involved = people_involved
            if how_out != 'run_out':
                bowler_stats.bowling_wickets += 1
            if how_out == 'run_out':
                batter = MatchTeamPlayer.objects.get(player_id=onstrike, match_id=match_id)
                if runs > 0:
                    batter.batting_runs_scored += runs
                    bowler_stats.bowling_runs_conceded += runs
                batter.batting_balls_faced += 1
                batter.save()
            out_player.is_non_striker = False
            out_player.is_striker = False
            out_player.save()
            out_player.refresh_from_db()
            if ball_in_over == 6:
                bowler_stats.bowling_overs = f"{over + 1}.0"
            else:
                bowler_stats.bowling_overs = f"{over}.{ball_in_over}"
            bowler_stats.save()
            bowler_stats.save()
        
        # Broadcast the match update
        broadcast_match_update(match.id)

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


################################################ User ScoreCard Starts ##############################################


@api_view(['GET'])
def scorecard_match_details(request, match_id):
    try:
        match = Match.objects.get(id=match_id)
        home_team = match.home_team
        away_team = match.away_team

        # Get the last ball of each innings
        last_ball_innings1 = BallByBall.objects.filter(match_id=match, innings=1).order_by('-over', '-ball_in_over', '-id').first()
        # First, try to get the last ball of innings 2
        last_ball_innings2 = BallByBall.objects.filter(match_id=match, innings=2).order_by('-over', '-ball_in_over', '-id').first()

        # If innings 2 does not exist, try to get the last ball of innings 3
        if not last_ball_innings2:
            last_ball_innings2 = BallByBall.objects.filter(match_id=match, innings=3).order_by('-over', '-ball_in_over', '-id').first()
            


        match_data = {
            'match_details': MatchDetailSerializer(match).data,
            'home_team': TeamSerializer(home_team).data,
            'away_team': TeamSerializer(away_team).data,
            'last_ball_innings1': {
                'total_runs': last_ball_innings1.total_runs,
                'total_wickets': last_ball_innings1.total_wickets,
                'overs': last_ball_innings1.over,
                'balls': last_ball_innings1.ball_in_over,
            } if last_ball_innings1 else None,
            'last_ball_innings2': {
                'total_runs': last_ball_innings2.total_runs,
                'total_wickets': last_ball_innings2.total_wickets,
                'overs': last_ball_innings2.over,
                'balls': last_ball_innings2.ball_in_over,
            } if last_ball_innings2 else None,
        }

        return Response(match_data, status=200)
    except Match.DoesNotExist:
        return Response({'error': 'Match not found'}, status=404)
    

###################################################### summary ##############################################################


class SummaryViewSet(viewsets.ViewSet):
    
    @action(detail=True, methods=['get'], url_path='summary-card')
    def get_match_summary(self, request, pk=None):
        match_id = pk
        
        # Top three batting performances
        top_batters = MatchTeamPlayer.objects.filter(match_id=match_id, is_batted=True).order_by('-batting_runs_scored')[:3]
        
        # Calculate and save batting strike rate for each batter
        for batter in top_batters:
            if batter.batting_balls_faced != 0:
                batter.batting_strike_rate = round((batter.batting_runs_scored / batter.batting_balls_faced) * 100, 2)
            else:
                batter.batting_strike_rate = 0
            batter.save()  # Save the updated batting strike rate to the database

        # Top three bowling performances
        top_bowlers = MatchTeamPlayer.objects.filter(match_id=match_id, is_bowled=True).annotate(
            economy=ExpressionWrapper(
                F('bowling_runs_conceded') / F('bowling_overs'),
                output_field=FloatField()
            )
        ).order_by('-bowling_wickets', 'economy')[:3]

        # Calculate and save bowling economy for each bowler
        for bowler in top_bowlers:
            bowler.bowling_economy = bowler.economy
            bowler.save()  # Save the updated bowling economy to the database

        batter_serializer = BatterSerializer(top_batters, many=True)
        bowler_serializer = BowlerSerializer(top_bowlers, many=True)
        
        return Response({
            'top_batters': batter_serializer.data,
            'top_bowlers': bowler_serializer.data
        })

########################################### extended scorecard ###############################################


@api_view(['GET'])
def extended_match_scorecard(request, match_id):
    try:
        match = get_object_or_404(Match, id=match_id)
        home_team = match.home_team
        away_team = match.away_team

        last_ball_innings1 = BallByBall.objects.filter(match_id=match, innings=1).order_by('-over', '-ball_in_over').first()
        last_ball_innings2 = BallByBall.objects.filter(match_id=match, innings=2).order_by('-over', '-ball_in_over').first()

        # If innings 2 does not exist, try to get the last ball of innings 3
        if not last_ball_innings2:
            last_ball_innings2 = BallByBall.objects.filter(match_id=match, innings=3).order_by('-over', '-ball_in_over').first()

        # Get the last ball of each innings where how_out is null
        bal_by_ball_innings1wickets = BallByBall.objects.filter(match_id=match, innings=1, how_out__isnull=True)
        bal_by_ball_innings2wickets = BallByBall.objects.filter(match_id=match, innings=2, how_out__isnull=True)

        # Determine which team batted first
        if match.batting_first == 'home':
            innings_1_batting = MatchTeamPlayer.objects.filter(match_id=match, is_batted=True, team_id=home_team)
            innings_1_Not_Batted = MatchTeamPlayer.objects.filter(match_id=match, is_batted=False, team_id=home_team)
            innings_1_bowling = MatchTeamPlayer.objects.filter(match_id=match, is_bowled=True, team_id=away_team)
            innings_2_batting = MatchTeamPlayer.objects.filter(match_id=match, is_batted=True, team_id=away_team)
            innings_2_Not_Batted = MatchTeamPlayer.objects.filter(match_id=match, is_batted=False, team_id=away_team)
            innings_2_bowling = MatchTeamPlayer.objects.filter(match_id=match, is_bowled=True, team_id=home_team)
        else:
            innings_1_batting = MatchTeamPlayer.objects.filter(match_id=match, is_batted=True, team_id=away_team)
            innings_1_Not_Batted = MatchTeamPlayer.objects.filter(match_id=match, is_batted=False, team_id=away_team)
            innings_1_bowling = MatchTeamPlayer.objects.filter(match_id=match, is_bowled=True, team_id=home_team)
            innings_2_batting = MatchTeamPlayer.objects.filter(match_id=match, is_batted=True, team_id=home_team)
            innings_2_Not_Batted = MatchTeamPlayer.objects.filter(match_id=match, is_batted=False, team_id=home_team)
            innings_2_bowling = MatchTeamPlayer.objects.filter(match_id=match, is_bowled=True, team_id=away_team)

        match_data = MatchSerializer(match).data
        home_team_data = TeamSerializer(home_team).data
        away_team_data = TeamSerializer(away_team).data
        innings_1_batting_data = MatchTeamPlayerSerializerr(innings_1_batting, many=True).data
        innings_1_Not_Batted_data = MatchTeamPlayerSerializerr(innings_1_Not_Batted, many=True).data
        innings_1_bowling_data = MatchTeamPlayerSerializerr(innings_1_bowling, many=True).data
        innings_2_batting_data = MatchTeamPlayerSerializerr(innings_2_batting, many=True).data
        innings_2_Not_Batted_data = MatchTeamPlayerSerializerr(innings_2_Not_Batted, many=True).data
        innings_2_bowling_data = MatchTeamPlayerSerializerr(innings_2_bowling, many=True).data
        bal_by_ball_innings1wickets_data = BallByBallSerializer(bal_by_ball_innings1wickets, many=True).data
        bal_by_ball_innings2wickets_data = BallByBallSerializer(bal_by_ball_innings2wickets, many=True).data
        last_ball_innings1_data = BallByBallSerializer(last_ball_innings1).data
        last_ball_innings2_data = BallByBallSerializer(last_ball_innings2).data
        context = {
            'match_details': match_data,
            'home_team': home_team_data,
            'away_team': away_team_data,
            'innings_1_batting': innings_1_batting_data,
            'innings_1_bowling': innings_1_bowling_data,
            'innings_2_batting': innings_2_batting_data,
            'innings_2_bowling': innings_2_bowling_data,
            'bal_by_ball_innings1wickets': bal_by_ball_innings1wickets_data,
            'bal_by_ball_innings2wickets': bal_by_ball_innings2wickets_data,
            'last_ball_innings1': last_ball_innings1_data,
            'last_ball_innings2': last_ball_innings2_data,
            'innings_1_Not_Batted': innings_1_Not_Batted_data,
            'innings_2_Not_Batted': innings_2_Not_Batted_data,
        }

        return Response(context)
    except Match.DoesNotExist:
        return Response({'error': 'Match not found'}, status=404)



########################################################### commentary ##############################################################


@api_view(['GET'])
def extended_commentary(request, match_id):
    try:
        match = get_object_or_404(Match, id=match_id)
        
        # Determine the batting first and second teams
        if match.batting_first == 'home':
            batting_first = match.home_team.team_name
            batting_second = match.away_team.team_name
        else:
            batting_first = match.away_team.team_name
            batting_second = match.home_team.team_name

        # Fetch ball-by-ball data for commentary
        commentary_innings1 = BallByBall.objects.filter(match_id=match, innings=1)
        commentary_innings2 = BallByBall.objects.filter(match_id=match, innings=2)
        if not commentary_innings2:
            commentary_innings2 = BallByBall.objects.filter(match_id=match, innings=3)
        commentary_data_1 = BallByBallCommentarySerializer(commentary_innings1, many=True).data
        commentary_data_2 = BallByBallCommentarySerializer(commentary_innings2, many=True).data
        

        context = {
            'batting_first': batting_first,
            'batting_second': batting_second,
            'com_innings_1': commentary_data_1,
            'com_innings_2': commentary_data_2,
        }

        return Response(context)
    except Match.DoesNotExist:
        return Response({'error': 'Match not found'}, status=404)


# ######################################################## MOM , BB, BB #############################################################


@api_view(['GET'])
def match_awards(request, match_id):
    match = get_object_or_404(Match, id=match_id)
    awards = match.calculate_awards()
    return JsonResponse(awards)


@api_view(['GET'])
def player_points(request, match_id):
    players = MatchTeamPlayer.objects.filter(match_id=match_id)
    
    player_points_list = []
    
    for player in players:
        batting_mvp_points = (player.batting_runs_scored / 10) + (player.batting_strike_rate / 100)
        if player.bowling_overs > 0:
            bowling_mvp_points = (player.bowling_wickets) + (7 / player.bowling_economy)
        else:
            bowling_mvp_points = 0
        
        total_mvp_points = batting_mvp_points + bowling_mvp_points
        
        player_info = {
            'player_id': player.player_id.id,
            'name': player.player_id.first_name,
            'team_name': player.team_id.team_name,
            'batting_mvp_points': batting_mvp_points,
            'bowling_mvp_points': bowling_mvp_points,
            'total_mvp_points': total_mvp_points
        }
        
        player_points_list.append(player_info)
    
    sorted_player_points = sorted(player_points_list, key=lambda x: x['total_mvp_points'], reverse=True)
    
    return JsonResponse({'players': sorted_player_points})


@api_view(['GET'])
def match_teams_players(request, match_id):
    try:
        match = Match.objects.get(id=match_id)
        home_team_players = MatchTeamPlayer.objects.filter(match_id=match_id, team_id=match.home_team_id)
        away_team_players = MatchTeamPlayer.objects.filter(match_id=match_id, team_id=match.away_team_id)

        home_team_players_data = [{
            'player_name': player.player_id.first_name,  # Assuming User model has a username field
            'team_name': player.team_id.team_name           # Assuming Team model has a name field
        } for player in home_team_players]

        away_team_players_data = [{
            'player_name': player.player_id.first_name,
            'team_name': player.team_id.team_name
        } for player in away_team_players]

        return Response({
            'home_team_players': home_team_players_data,
            'away_team_players': away_team_players_data
        })
    except Match.DoesNotExist:
        return Response(status=404)
    

# views.py
from rest_framework import generics
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers import MatchLiveSerializer

import logging

logger = logging.getLogger(__name__)

class MatchLiveDetailView(generics.RetrieveAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchLiveSerializer

    def broadcast_match_update(self, match_data):
        logger.info(f"Broadcasting match update: {match_data}")
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'match_{match_data["id"]}',
            {
                'type': 'match_update',
                'match_data': match_data
            }
        )

    def get(self, request, *args, **kwargs):
        match_data = super().get(request, *args, **kwargs).data
        self.broadcast_match_update(match_data)
        return Response(match_data)


################################# live implementation ##################################

# views.py
from django.http import JsonResponse
import time
import random
import string
import os
from agora_token_builder import RtcTokenBuilder

def start_stream(request, match_id):
    match = get_object_or_404(Match, id=match_id)
    match.is_streaming = True
    match.save()
    return JsonResponse({'status': 'streaming started'})

def stop_stream(request, match_id):
    match = get_object_or_404(Match, id=match_id)
    match.is_streaming = False
    match.save()
    return JsonResponse({'status': 'streaming stopped'})

def generate_agora_token(request):
    AGORA_APP_ID = os.getenv('AGORA_APP_ID')
    AGORA_APP_CERTIFICATE = os.getenv('AGORA_APP_CERTIFICATE')
    
    channel_name = request.GET.get('channelName')
    uid = 0
    expiration_time_in_seconds = 3600
    current_timestamp = int(time.time())
    privilege_expired_ts = current_timestamp + expiration_time_in_seconds

    token = RtcTokenBuilder.buildTokenWithUid(AGORA_APP_ID, AGORA_APP_CERTIFICATE, channel_name, uid, 1, privilege_expired_ts)
    
    return JsonResponse({'token': token, 'uid': uid})
