"""
ASGI config for django_rest_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import django_rest_backend.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_rest_backend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Handle traditional HTTP requests
    "websocket": AuthMiddlewareStack(
        URLRouter(
            django_rest_backend.routing.websocket_urlpatterns  # Route WebSocket connections
        )
    ),
})
