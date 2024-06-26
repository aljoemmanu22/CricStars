
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import stop_stream, start_stream, generate_agora_token ,MatchLiveDetailView, match_teams_players, player_points, match_awards,extended_commentary, extended_match_scorecard, SummaryViewSet, MatchesViewSet, MatchDetailView, update_player_info, live_scorecard, update_score, update_striker_nonstriker, update_bowler, new_batter_selection, handleStartMatch, handleInningsChange, handleEndMatch, scorecard_match_details

router = DefaultRouter()
router.register(r'matches', MatchesViewSet)
router.register(r'summary', SummaryViewSet, basename='summary')

urlpatterns = [
    path('', include(router.urls)),
    path('match-detail/<int:pk>/', MatchDetailView.as_view(), name='match-detail'),
    path('update-player-info/', update_player_info, name='update-player-info'),
    path('live_scorecard/<int:match_id>/', live_scorecard, name='live_scorecard'),
    path('update-score/', update_score, name='update-score'),
    path('update-striker-nonstriker/', update_striker_nonstriker, name='update-striker-nonstriker'),
    path('update-bowler/', update_bowler, name='update_bowler'),
    path('new-batter-selection/', new_batter_selection, name='new-batter-selection'),
    path('start-match/', handleStartMatch, name='start-match'),
    path('innings-change/', handleInningsChange, name='innings-change'),
    path('end-match/', handleEndMatch, name='end-match'),
    path('scorecard-match-detail/<int:match_id>/',scorecard_match_details, name='scorecard-match-detail'),
    path('extended-match-scorecard/<int:match_id>/',extended_match_scorecard, name='extended-match-scorecard'),
    path('extended-commentary/<int:match_id>/',extended_commentary, name='extended-commentary'),
    path('matches/<int:match_id>/awards/', match_awards, name='match_awards'),
    path('matches/<int:match_id>/points/', player_points, name='player_points'),
    path('matches/<int:match_id>/teams/players/', match_teams_players, name='match_teams_players'),
    path('scorecard-match-live-detail/<int:pk>/', MatchLiveDetailView.as_view(), name='match-live-detail'),

    path('start-stream/<int:match_id>/', start_stream, name='start_stream'),
    path('stop-stream/<int:match_id>/', stop_stream, name='stop_stream'),
    path('generate-token/', generate_agora_token, name='generate-token'),
]