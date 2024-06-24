# consumers.py
import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

class MatchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.match_id = self.scope['url_route']['kwargs']['match_id']
        self.match_group_name = f'match_{self.match_id}'

        logger.info(f"WebSocket connected for match ID: {self.match_id}")

        try:
            await self.channel_layer.group_add(
                self.match_group_name,
                self.channel_name
            )

            await self.accept()

            logger.info(f"Accepted WebSocket connection for match ID: {self.match_id}")
        except Exception as e:
            logger.error(f"Error connecting WebSocket for match ID {self.match_id}: {str(e)}")
            raise

    async def disconnect(self, close_code):
        logger.info(f"WebSocket disconnected with code {close_code} for match ID: {self.match_id}")

        try:
            await self.channel_layer.group_discard(
                self.match_group_name,
                self.channel_name
            )
        except Exception as e:
            logger.error(f"Error disconnecting WebSocket for match ID {self.match_id}: {str(e)}")
            raise

    async def match_update(self, event):
        match_data = event['match_data']

        # logger.debug(f"Sending match update for match ID {self.match_id}: {match_data}")

        try:
            await self.send(text_data=json.dumps({
                'match_data': match_data
            }))
        except Exception as e:
            logger.error(f"Error sending match update for match ID {self.match_id}: {str(e)}")
            raise
