
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchesViewSet, MatchDetailView, update_player_info, live_scorecard, update_score

router = DefaultRouter()
router.register(r'matches', MatchesViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('match-detail/<int:pk>/', MatchDetailView.as_view(), name='match-detail'),
    path('update-player-info/', update_player_info, name='update-player-info'),
    path('live_scorecard/<int:match_id>/', live_scorecard, name='live_scorecard'),
    path('update-score/', update_score, name='update-score'),
]