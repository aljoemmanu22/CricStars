
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MatchesViewSet

router = DefaultRouter()
router.register(r'matches', MatchesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]