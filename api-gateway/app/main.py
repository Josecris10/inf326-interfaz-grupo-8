import time
import logging
import requests
import os

from ariadne import QueryType
from ariadne import MutationType
from ariadne import ObjectType
from ariadne import make_executable_schema
from ariadne import load_schema_from_path

from ariadne.asgi import GraphQL

from graphql.type import GraphQLResolveInfo

from starlette.middleware.cors import CORSMiddleware

# from .dataloaders import TeamLoader

type_defs = load_schema_from_path("./app/schema.graphql")

query = QueryType()
mutation = MutationType()

message = ObjectType("Message")
# player = ObjectType("Player")

# team_loader = TeamLoader()

logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s:%(levelname)s:%(name)s:%(message)s')

base_user_service_url = "http://users-service:80"
base_channel_service_url = os.getenv("CHANNEL_SERVICE_BASE", "http://channel-api-service:8000/v1/channels")
base_message_service_url = os.getenv("MESSAGE_SERVICE_BASE", "http://messages-service.nursoft.dev")
SEARCH_SERVICE_BASE = os.getenv("SEARCH_SERVICE_BASE", "http://searchservice.inf326.nursoft.devc")

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

@query.field("getUser")
async def resolve_get_user(obj, resolve_info: GraphQLResolveInfo, token):
    headers = {
        "Authorization": "Bearer "+token
    }

    response = requests.get(base_user_service_url+"/users/me", headers=headers)
    if response.status_code == 200:
        return response.json()

@mutation.field("createUser")
def resolve_create_user(obj, resolve_info: GraphQLResolveInfo, email, username, password, full_name):
    payload = dict(email=email,
                    username=username,
                    password=password)

    if full_name:
        payload['full_name'] = full_name

    response = requests.post(base_user_service_url+"/users/register", json=payload)

    if response.status_code == 201:
        return response.json()

@mutation.field("updateUser")
def resolve_update_user(obj, resolve_info: GraphQLResolveInfo, full_name):
    payload = dict()

    if full_name:
        payload['full_name'] = full_name

    response = requests.patch(base_channel_service_url+"/users/me", json=payload)

    if response.status_code == 200:
        return response.json()

@mutation.field("loginUser")
def resolve_delete_user(obj, resolve_info: GraphQLResolveInfo, username_or_email, password):
    payload = dict(username_or_email=username_or_email,
                    password=password)

    response = requests.post(base_channel_service_url+"/auth/login", json=payload)

    if response.status_code == 201:
        return response.json()





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
def resolve_update_channel(obj, resolve_info: GraphQLResolveInfo, channel_id, name, owner_id, channel_type):
    payload = dict(name=name,
                    owner_id=owner_id,
                    channel_type=channel_type)

    response = requests.put(base_channel_service_url+f"/{channel_id}", json=payload)

    if response.status_code == 200:
        return response.json()

@mutation.field("reactivateChannel")
def resolve_reactivate_channel(obj, resolve_info: GraphQLResolveInfo, channel_id):
    response = requests.post(base_channel_service_url+f"/{channel_id}/reactivate")

    if response.status_code == 200:
        return response.json()

@mutation.field("deleteChannel")
def resolve_delete_channel(obj, resolve_info: GraphQLResolveInfo, channel_id):
    
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


@query.field("searchChannels")
def resolve_search_channels(obj, resolve_info: GraphQLResolveInfo, 
    q=None,
    channel_id=None,
    owner_id=None,
    channel_type=None,
    is_active=None,
    limit=None,
    offset=None
                            
):
    """
    Gateway -> delegates to: GET /api/channel/search_channel?q={query}
    Returns: array of channels (as JSON)
    """
    try:
        params = {}
        if q is not None:
            params["q"] = q
        if channel_id is not None:
            params["channel_id"] = channel_id
        if owner_id is not None:
            params["owner_id"] = owner_id
        if channel_type is not None:
            params["channel_type"] = channel_type
        if is_active is not None:
            params["is_active"] = str(is_active).lower() 
        if limit is not None:
            params["limit"] = limit
        if offset is not None:
            params["offset"] = offset
        resp = requests.get(
            f"{SEARCH_SERVICE_BASE}/api/channel/search_channel", 
            params=params if params else None,
            timeout=5
        )
        if resp.status_code == 200:
            data = resp.json()
            normalized = []
            for ch in data:
                # Por si acaso algún item viene raro
                if isinstance(ch, dict):
                    ct = ch.get("channel_type")
                    if ct:
                        ch["channel_type"] = ct.upper()
                normalized.append(ch)

            return normalized
    except Exception as e:
        logging.exception("searchChannels error: %s", e)
    return []


@query.field("searchThreads")
def resolve_search_threads(obj, resolve_info: GraphQLResolveInfo,
                           channel_id=None, category=None, author=None,
                           tag=None, keyword=None, start_date=None, end_date=None):
    try:
        if keyword:
            resp = requests.get(f"{SEARCH_SERVICE_BASE}/api/threads/keyword/{keyword}", timeout=5)
        elif tag:
            resp = requests.get(f"{SEARCH_SERVICE_BASE}/api/threads/tag/{tag}", timeout=5)
        elif author:
            resp = requests.get(f"{SEARCH_SERVICE_BASE}/api/threads/author/{author}", timeout=5)
        elif category:
            resp = requests.get(f"{SEARCH_SERVICE_BASE}/api/threads/category/{category}", timeout=5)
        elif start_date and end_date:
            resp = requests.get(f"{SEARCH_SERVICE_BASE}/api/threads/daterange", params={"start_date": start_date, "end_date": end_date}, timeout=5)
        elif channel_id:
        
            resp = requests.get(f"{SEARCH_SERVICE_BASE}/api/threads/id/{channel_id}", timeout=5)
        else:
            # Si no hay filtros, retornar vacío
            return []

        if resp.status_code == 200:
            # Asegúrate de devolver una lista
            data = resp.json()
            if isinstance(data, dict):
                return data.get("threads", [])
            elif isinstance(data, list):
                return data
            else:
                return []
    except Exception as e:
        logging.exception("searchThreads error: %s", e)

    return []


@query.field("searchMessages")
def resolve_search_messages(obj, resolve_info: GraphQLResolveInfo, thread_id, query=None):
    """
    ThreadPage message search.
    Delegates to: GET /api/message/search_message with params thread_id and q (if supported)
    """
    try:
        params = {"thread_id": thread_id}
        if query:
            params["q"] = query

        resp = requests.get(f"{SEARCH_SERVICE_BASE}/api/message/search_message", params=params, timeout=6)
        if resp.status_code == 200:
            data = resp.json()
            return data.get("messages", [])
    except Exception as e:
        logging.exception("searchMessages error: %s", e)

    return []


schema = make_executable_schema(type_defs, query, mutation, message)
app = CORSMiddleware(GraphQL(schema, debug=True), allow_origins=['*'], allow_methods=("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"))
