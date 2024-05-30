# views.py

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from match.models import Match
from .serializers import MatchSerializer
from rest_framework.permissions import IsAuthenticated
from accounts.models import User

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
