import logging
import requests
import os

from aiodataloader import DataLoader

base_channel_service_url = "http://channel-api-service:8000/v1/channels"
SEARCH_SERVICE_BASE = os.getenv("SEARCH_SERVICE_BASE", "http://searchservice.inf326.nursoft.dev")

# class ChannelLoader(DataLoader):
#     async def batch_load_fn(self, keys):
#         try:
#             response = requests.get(f"http://demo_04_service_02/teams",
#                                 params={"id[]": keys})
        
#         except:
#             return [None for _ in keys]
        
#         result = {team['id']: team for team in response.json()}

#         # Here we call a function to return a user for each key in keys in order
#         return [result[key] for key in keys]
