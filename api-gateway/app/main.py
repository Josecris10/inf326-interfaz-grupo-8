import time
import logging
import requests

from ariadne import QueryType
from ariadne import MutationType
from ariadne import ObjectType
from ariadne import make_executable_schema
from ariadne import load_schema_from_path

from ariadne.asgi import GraphQL

from graphql.type import GraphQLResolveInfo

from starlette.middleware.cors import CORSMiddleware

from .dataloaders import TeamLoader

type_defs = load_schema_from_path("./app/schema.graphql")

query = QueryType()
mutation = MutationType()

message = ObjectType("Message")
# player = ObjectType("Player")

# team_loader = TeamLoader()

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s:%(levelname)s:%(name)s:%(message)s')

base_channel_service_url = "http://channel-api-service:8000/v1/channels"
base_message_service_url = "http://messages-service.nursoft.dev"
# @query.field("getPlayer")
# def resolve_get_player(obj, resolve_info: GraphQLResolveInfo, id):
#     response = requests.get(f"http://demo_04_service_01/players/{id}")

#     if response.status_code == 200:
#         return response.json()


# @team.field("players")
# @query.field("listPlayers")
# def resolve_list_players(obj, resolve_info: GraphQLResolveInfo, team_id=None):
#     # Make it slow
#     time.sleep(3)

#     if obj and not team_id:
#         team_id = obj.get('id')

#     if team_id:
#         response = requests.get(
#             f"http://demo_04_service_01/players?team_id={team_id}")
#     else:
#         response = requests.get(f"http://demo_04_service_01/players")

#     if response.status_code == 200:
#         return response.json()

# @query.field("listTeams")
# def resolve_list_players(obj, resolve_info: GraphQLResolveInfo):
#     response = requests.get(f"http://demo_04_service_02/teams")

#     if response.status_code == 200:
#         return response.json()

# @player.field("team")
# @query.field("getTeam")
# async def resolve_get_team(obj, resolve_info: GraphQLResolveInfo, id=None):
#     if obj and not id:
#         id = obj.get('team_id')

#     if not id:
#         return None

#     return await team_loader.load(id)

#     # Without dataloader this code will make n+1 requests when index of player is called:

#     # response = requests.get(f"http://demo_04_service_02/teams/{id}")
#     # if response.status_code == 200:
#     #     return response.json()


# @mutation.field("createTeam")
# def resolve_create_team(obj, resolve_info: GraphQLResolveInfo, name, country, description=None):
#     payload = dict(name=name,
#                    country=country)

#     if description:
#         payload['description'] = description

#     return requests.post(f"http://demo_04_service_02/teams", json=payload).json()



@query.field("getChannel")
async def resolve_get_channel(obj, resolve_info: GraphQLResolveInfo, channel_id):
    # return await channel_loader.load(channel_id)

    # Without dataloader this code will make n+1 requests:

    response = requests.get(base_channel_service_url+f"/{channel_id}")
    if response.status_code == 200:
        return response.json()

@mutation.field("createChannel")
def resolve_create_channel(obj, resolve_info: GraphQLResolveInfo, name, owner_id, users, channel_type):
    payload = dict(name=name,
                    owner_id=owner_id,
                    users=users,
                    channel_type=channel_type)

    response = requests.post(base_channel_service_url, json=payload)

    if response.status_code == 201:
        return response.json()

@mutation.field("updateChannel")
def resolve_update_message(obj, resolve_info: GraphQLResolveInfo, channel_id, name, owner_id, channel_type):
    payload = dict(name=name,
                    owner_id=owner_id,
                    channel_type=channel_type)

    response = requests.put(base_channel_service_url+f"/{channel_id}", json=payload)

    if response.status_code == 200:
        return response.json()

@mutation.field("reactivateChannel")
def resolve_update_message(obj, resolve_info: GraphQLResolveInfo, channel_id):
    response = requests.post(base_channel_service_url+f"/{channel_id}/reactivate")

    if response.status_code == 200:
        return response.json()

@mutation.field("deleteMessage")
def resolve_delete_message(obj, resolve_info: GraphQLResolveInfo, channel_id):
    
    response = requests.delete(base_channel_service_url+f"/{channel_id}")

    if response.status_code == 200:
        return response.json()





@query.field("getMessage")
def resolve_get_message(obj, resolve_info: GraphQLResolveInfo, thread_id, user_id):
    headers = {
        "X-User-Id": str(user_id)
    }

    response = requests.get(base_message_service_url+f"/threads/{thread_id}/messages", headers=headers)

    if response.status_code == 200:
        return response.json()

@mutation.field("createMessage")
def resolve_create_message(obj, resolve_info: GraphQLResolveInfo, thread_id, content, type_, paths, user_id):
    headers = {
        "X-User-Id": str(user_id)
    }
    
    payload = dict(content=content,
                    type=type_,
                    paths=paths)

    response = requests.post(base_message_service_url+f"/threads/{thread_id}/messages", json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()

@mutation.field("updateMessage")
def resolve_update_message(obj, resolve_info: GraphQLResolveInfo, thread_id, message_id, content, type_, paths, user_id):
    headers = {
        "X-User-Id": str(user_id)
    }

    payload = dict(content=content,
                    type=type_,
                    paths=paths)

    response = requests.put(base_message_service_url+f"/threads/{thread_id}/messages/{message_id}", json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()

@mutation.field("deleteMessage")
def resolve_delete_message(obj, resolve_info: GraphQLResolveInfo, thread_id, message_id, user_id):
    headers = {
        "X-User-Id": str(user_id)
    }
    
    response = requests.delete(base_message_service_url+f"/threads/{thread_id}/messages/{message_id}", headers=headers)

    if response.status_code == 200:
        return True

schema = make_executable_schema(type_defs, query, mutation, message)
app = CORSMiddleware(GraphQL(schema, debug=True), allow_origins=['*'], allow_methods=("GET", "POST", "PUT", "DELETE", "OPTIONS"))
