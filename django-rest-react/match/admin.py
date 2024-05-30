from django.contrib import admin

from .models import Team, Match, MatchTeamPlayer

# Setting each model such that it can be accessed in the Django admin view.
admin.site.register(Team)
admin.site.register(Match)
admin.site.register(MatchTeamPlayer)