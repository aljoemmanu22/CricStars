from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchViewSet, TeamViewSet, UserViewSet

router = DefaultRouter()
router.register(r'matches', MatchViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
