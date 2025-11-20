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
from graphql import GraphQLError

from starlette.middleware.cors import CORSMiddleware

# from .dataloaders import TeamLoader

type_defs = load_schema_from_path("./app/schema.graphql")

query = QueryType()
mutation = MutationType()

user = ObjectType("User")
channel = ObjectType("Channel")
thread = ObjectType("Thread")
message = ObjectType("Message")
violation_breakdown = ObjectType("ViolationBreakdown")
violation_summary = ObjectType("ViolationSummary")
moderation_status = ObjectType("ModerationStatus")
blacklist_word = ObjectType("BlacklistWord")
blacklist_stats = ObjectType("BlacklistStats")
violation = ObjectType("Violation")
channel_stats = ObjectType("ChannelStats")
user_moderation_full_status = ObjectType("UserModerationFullStatus")

# player = ObjectType("Player")

# team_loader = TeamLoader()

logging.basicConfig(level=logging.DEBUG,
					format='%(asctime)s:%(levelname)s:%(name)s:%(message)s')

ADMIN_API_KEY = os.getenv("MODERATION_ADMIN_KEY", None)
base_user_service_url = "https://users.inf326.nursoft.dev/v1"
base_channel_service_url = "https://channel-api.inf326.nur.dev/v1/channels"
base_message_service_url = os.getenv("MESSAGE_SERVICE_BASE", "https://messages-service.nursoft.dev")
SEARCH_SERVICE_BASE = os.getenv("SEARCH_SERVICE_BASE", "https://searchservice.inf326.nursoft.dev")

base_progra_chatbot_service_url = "https://chatbotprogra.inf326.nursoft.dev/chat"
base_moderation_service_url = "https://moderation.inf326.nur.dev/api/v1"

# ESTAS URL DEBEN CAMBIARSE SI O SI, DEJE ESTAS DE MOMENTO PORQUE ES LA INFO QUE SE TIENE HASTA AHORA, PERO DEBEN
# CAMBIARSE A LA ADAPTACIÓN EN EL CLUSTER
base_wikipedia_chatbot_service_url = "http://wikipedia-chatbot-134-199-176-197.nip.io/chat-wikipedia"
base_presence_service_url = "http://presence-134-199-176-197.nip.io/api/v1.0.0"

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

# ----------------------------------------------     USER-SERVICE   ------------------------------------------------------------

@query.field("getUser")
async def resolve_get_user(obj, resolve_info: GraphQLResolveInfo, token):
	headers = {
		"Authorization": "Bearer "+token
	}

	response = requests.get(base_user_service_url+"/users/me", headers=headers)
	if response.status_code == 200 or response.status_code == 201:
		return response.json()
	
	raise GraphQLError("Invalid token or user not found")
	

@mutation.field("createUser")
def resolve_create_user(obj, resolve_info: GraphQLResolveInfo, email, username, password, full_name):
	payload = dict(email=email,
					username=username,
					password=password)

	if full_name:
		payload['full_name'] = full_name

	response = requests.post(base_user_service_url+"/users/register", json=payload)

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

	raise GraphQLError(f"User creation failed: {response.text}")

@mutation.field("updateUser")
def resolve_update_user(obj, resolve_info: GraphQLResolveInfo, full_name):
	payload = dict()

	if full_name:
		payload['full_name'] = full_name

	response = requests.patch(base_user_service_url+"/users/me", json=payload)

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

	raise GraphQLError(f"User update failed: {response.text}")

@mutation.field("loginUser")
def resolve_delete_user(obj, resolve_info: GraphQLResolveInfo, username_or_email, password):
	payload = dict(username_or_email=username_or_email,
					password=password)

	response = requests.post(base_user_service_url+"/auth/login", json=payload)

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

	# Manejo de error estándar
	raise GraphQLError(f"Login failed: {response.text}")

# ----------------------------------------------     CHANNEL-SERVICE   ------------------------------------------------------------

@query.field("getChannel")
async def resolve_get_channel(obj, resolve_info: GraphQLResolveInfo, channel_id):
	# return await channel_loader.load(channel_id)

	# Without dataloader this code will make n+1 requests:

	response = requests.get(base_channel_service_url+f"/{channel_id}")
	if response.status_code == 200 or response.status_code == 201:
		channel = response.json()

		if "channel_type" in channel:
			channel["channel_type"] = channel["channel_type"].upper()
		
		return channel

	raise GraphQLError(f"Channel not found: {response.text}")

@query.field("getChannels")
async def resolve_get_channels(obj, resolve_info: GraphQLResolveInfo):
	# return await channel_loader.load(channel_id)

	# Without dataloader this code will make n+1 requests:

	response = requests.get(base_channel_service_url+"/")
	if response.status_code == 200 or response.status_code == 201:
		channels = response.json()

		for ch in channels:
			if "channel_type" in ch:
				ch["channel_type"] = ch["channel_type"].upper()

		return channels
	
	raise GraphQLError(f"Unexpected error occured: {response.text}")

@mutation.field("createChannel")
def resolve_create_channel(obj, resolve_info: GraphQLResolveInfo, name, channel_type, owner_id, users):
	payload = dict(
		name=name,
		channel_type=channel_type,
		owner_id=owner_id,
		users=users
	)

	response = requests.post(base_channel_service_url, json=payload)

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

	raise GraphQLError(f"Channel creation failed: {response.text}")

@mutation.field("updateChannel")
def resolve_update_channel(obj, resolve_info: GraphQLResolveInfo, channel_id, name, owner_id, channel_type):
	payload = dict(name=name,
					owner_id=owner_id,
					channel_type=channel_type)

	response = requests.put(base_channel_service_url+f"/{channel_id}", json=payload)

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

	raise GraphQLError(f"Channel update failed: {response.text}")

@mutation.field("reactivateChannel")
def resolve_reactivate_channel(obj, resolve_info: GraphQLResolveInfo, channel_id):
	response = requests.post(base_channel_service_url+f"/{channel_id}/reactivate")

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

	raise GraphQLError(f"Channel reactivation failed: {response.text}")

@mutation.field("deleteChannel")
def resolve_delete_channel(obj, resolve_info: GraphQLResolveInfo, channel_id):
	
	response = requests.delete(base_channel_service_url+f"/{channel_id}")

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

	raise GraphQLError(f"Channel elimination failed: {response.text}")


# ----------------------------------------------     MESSAGE-SERVICE   ------------------------------------------------------------

@query.field("getMessage")
def resolve_get_message(obj, resolve_info: GraphQLResolveInfo, thread_id, user_id):
	headers = {
		"X-User-Id": str(user_id)
	}

	response = requests.get(base_message_service_url+f"/threads/{thread_id}/messages", headers=headers)

	if response.status_code == 200 or response.status_code == 201:
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

	if response.status_code == 200 or response.status_code == 201:
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

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

@mutation.field("deleteMessage")
def resolve_delete_message(obj, resolve_info: GraphQLResolveInfo, thread_id, message_id, user_id):
	headers = {
		"X-User-Id": str(user_id)
	}
	
	response = requests.delete(base_message_service_url+f"/threads/{thread_id}/messages/{message_id}", headers=headers)

	if response.status_code == 200 or response.status_code == 201:
		return True



# ----------------------------------------------     SEARCH-SERVICE   ------------------------------------------------------------

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
			params["channel_type"] = str(channel_type).lower()
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
		if response.status_code == 200 or response.status_code == 201:
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

		if response.status_code == 200 or response.status_code == 201:
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
		if response.status_code == 200 or response.status_code == 201:
			data = resp.json()
			return data.get("messages", [])
	except Exception as e:
		logging.exception("searchMessages error: %s", e)

	return []


# ----------------------------------------------     CHATBOTS   ------------------------------------------------------------

@query.field("getMessagePrograChatbot")
async def resolve_get_message_progra_chatbot(obj, resolve_info: GraphQLResolveInfo, message):
	payload = dict(message=message)

	response = requests.post(base_progra_chatbot_service_url, json=payload)
	if response.status_code == 200 or response.status_code == 201:
		return response.json()

@query.field("getMessageWikipediaChatbot")
async def resolve_get_message_wikipedia_chatbot(obj, resolve_info: GraphQLResolveInfo, message):
	payload = dict(message=message)

	response = requests.post(base_wikipedia_chatbot_service_url, json=payload)
	if response.status_code == 200 or response.status_code == 201:
		return response.json()


# ----------------------------------------------     PRESENCE-SERVICE   ------------------------------------------------------------

@query.field("getPresence")
def resolve_get_presence(obj, resolve_info: GraphQLResolveInfo, statusEnum):
	# Obtener objetos de datos de presencia almacenados para los diferentes usuarios
	param = ""

	if statusEnum:
		param = "?status=" + statusEnum

	response = requests.get(base_presence_service_url+"/presence"+param)

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

@query.field("getPresenceStats")
def resolve_get_presence_stats(obj, resolve_info: GraphQLResolveInfo):
	# Obtener estadísticas de presencia; totales online y offline
	response = requests.get(base_presence_service_url+"/presence/stats")

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

@query.field("getPresenceUser")
def resolve_get_presence_user(obj, resolve_info: GraphQLResolveInfo, userId):
	# Obtener datos de presencia para un usuario en particular
	response = requests.get(base_presence_service_url+"/presence/"+userId)

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

@mutation.field("registerPresence")
def resolve_register_presence(obj, resolve_info: GraphQLResolveInfo, userId, device, ip):
	payload = {}
	payload["userId"] = userId

	if device:
		payload["device"] = device

	if ip:
		payload["ip"] = ip

	response = requests.post(base_presence_service_url+"/presence", json=payload)

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

@mutation.field("updatePresence")
def resolve_update_presence(obj, resolve_info: GraphQLResolveInfo, userId, status, heartbeat):
	payload = {}

	if status:
		payload["status"] = status #Cambiar a online u offline

	if heartbeat:
		payload["heartbeat"] = heartbeat #Actualizar de forma interna la última hora donde se obtuvo el estado del usuario, no es compatible si se ingresa de forma simultanea con status

	response = requests.patch(base_presence_service_url+"/presence/"+userId, json=payload)

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

@mutation.field("deletePresence")
def resolve_delete_presence(obj, resolve_info: GraphQLResolveInfo, userId):
	response = requests.patch(base_presence_service_url+"/presence/"+userId)

	if response.status_code == 200 or response.status_code == 201:
		return response.json()

# ----------------------------------------------     MODERATION-SERVICE   ------------------------------------------------------------
@query.field("getUserChannelStatus")
def resolve_get_user_channel_status(obj, resolve_info: GraphQLResolveInfo, user_id, channel_id):
	"""
	Delegates to: GET /api/v1/moderation/status/{user_id}/{channel_id}
	"""
	try:
		url = f"{base_moderation_service_url}/moderation/status/{user_id}/{channel_id}"
		response = requests.get(url, timeout=5)

		if response.status_code == 200 or response.status_code == 201:
			return response.json()
		
		logging.warning(f"Moderation status failed for {user_id}/{channel_id}: {response.text}")
	except Exception as e:
		logging.exception("getUserChannelStatus error: %s", e)
	
	# Retorna un estado por defecto si falla la conexión o el código de estado no es 200
	return {
		"channel_id": channel_id,
		"is_banned": False,
		"last_violation": None,
		"strike_count": 0,
		"strike_reset_at": None,
		"user_id": user_id,
	}

@query.field("getUserModerationStatus")
def resolve_get_user_moderation_status(obj, resolve_info: GraphQLResolveInfo, user_id, channel_id):
	"""
	ADMIN. Delegates to: GET /api/v1/admin/users/{user_id}/status
	Retorna UserModerationFullStatus (anulable).
	"""
	try:
		headers = {"X-API-Key": ADMIN_API_KEY}
		url = f"{base_moderation_service_url}/admin/users/{user_id}/status?channel_id={channel_id}" 
		response = requests.get(url, headers=headers, timeout=5)

		if response.status_code == 200 or response.status_code == 201:
			data = response.json()
			
			data['user_id'] = user_id
			data['channel_id'] = channel_id
			
			if data.get('strike_count') is None:
				data['strike_count'] = 0
			
			if data.get('violation_summary') is None:
				data['violation_summary'] = {
					"total": 0, 
					"by_severity": {"high": 0, "low": 0, "medium": 0}
				}
			
			return data
		
		logging.error(f"Moderation Status endpoint returned status {response.status_code}")
		return None

	except Exception as e:
		logging.exception("getUserModerationStatus failed.")
		return None

@query.field("getUserViolations")
def resolve_get_user_violations(obj, resolve_info: GraphQLResolveInfo, user_id, channel_id):
	"""
	ADMIN. Delegates to: GET /api/v1/admin/users/{user_id}/violations?channel_id={channel_id}
	NOTE: Requires API Key header X-API-Key (implementation omitted for simplicity)
	"""
	try:
		headers = {
			"X-API-Key": ADMIN_API_KEY
		}
		url = f"{base_moderation_service_url}/admin/users/{user_id}/violations?channel_id={channel_id}"
		# Aquí deberías agregar headers = {"X-API-Key": "YOUR_ADMIN_KEY"}
		response = requests.get(url, headers=headers, timeout=5) 

		if response.status_code == 200 or response.status_code == 201:
			data = response.json()
			data['user_id'] = user_id
			data['channel_id'] = channel_id
			if data.get('current_strikes') is None:
				data['current_strikes'] = 0
			if data.get('total_violations') is None:
				data['total_violations'] = 0
			if data.get('is_banned') is None:
				data['is_banned'] = False
			return data
	except Exception as e:
		logging.exception("getUserViolations error: %s", e)
		return None

@query.field("getChannelStats")
def resolve_get_channel_stats(obj, resolve_info: GraphQLResolveInfo, channelId):
	"""
	ADMIN. Delegates to: GET /api/v1/admin/channels/{channel_id}/stats
	"""
	try:
		headers = {
			"X-API-Key": ADMIN_API_KEY
		}
		url = f"{base_moderation_service_url}/admin/channels/{channelId}/stats"
		# Aquí se asume la autenticación de administrador (ej: X-API-Key)
		response = requests.get(url, headers=headers, timeout=5) 

		if response.status_code == 200 or response.status_code == 201:
			data = response.json()
			data['channel_id'] = channelId
			
			if data.get('total_violations') is None:
				data['total_violations'] = 0
			return data
		logging.error(f"Moderation Stats Service returned stauts {response.status_code} for {channelId}")
		return None
	except Exception as e:
		logging.exception("getChannelStats error: %s", e)
		return None

@mutation.field("addBlacklistWord")
def resolve_add_blacklist_word(obj, resolve_info: GraphQLResolveInfo, data):
	"""
	ADMIN. Delegates to: POST /api/v1/blacklist/words
	NOTE: Requires API Key header X-API-Key
	"""
	try:
		headers = {
			"X-API-Key": ADMIN_API_KEY
		}
		url = f"{base_moderation_service_url}/blacklist/words"
		payload = {
			"word": data.get('word'),
			"category": data.get('category') or "insult",
			"is_regex": data.get('is_regex', False),
			"language": data.get('language') or "es",
			"notes": data.get('notes'),
			"severity": data.get('severity')
		}
		payload_filtered = {k: v for k, v in payload.items() if v is not None}
		# Aquí deberías agregar headers = {"X-API-Key": "YOUR_ADMIN_KEY"}
		response = requests.post(url, json=payload_filtered, headers=headers, timeout=5)


		if response.status_code in (200, 201):
			response_json = response.json()
			
			new_id = response_json.get('data', {}).get('id')
			
			if new_id:
				return {
					"id": new_id,
					"success": response_json.get('success', True),
					"message": response_json.get('message', "Operación completada.")
				}
			
		logging.error(f"Moderation Service POST /blacklist/words failed with status {response.status_code}")
		return None
			

	except Exception as e:
		logging.exception("addBlacklistWord error: %s", e)
		return None 

@query.field("listBlacklistWords")
def resolve_list_blacklist_words(obj, resolve_info: GraphQLResolveInfo, 
								 language=None, category=None, severity=None,
								 limit=None, skip=None):
	"""
	ADMIN. Delegates to: GET /api/v1/blacklist/words
	retorna BlacklistPage { total, words }
	"""
	try:
		headers= {
			"X-API-KEY": ADMIN_API_KEY
		}
		url = f"{base_moderation_service_url}/blacklist/words"
		params = {}
		if language is not None:
			params['language'] = language
		if category is not None:
			params['category'] = category
		if severity is not None:
			params['severity'] = severity
		if limit is not None:
			params['limit'] = limit
		if skip is not None:
			params['skip'] = skip
		response = requests.get(url, params=params, headers=headers, timeout=5)
		
		if response.status_code == 200:
			data = response.json()
			if data.get('total') is None:
				data['total'] = 0
			if data.get('words') is None:
				data['words'] = []
			return data 
		logging.error(f"Moderation Service GET /blacklist/words failed with status {response.status_code}")
		return None
	except Exception as e:
		logging.exception("listBlacklistWords error: %s", e)
		return None
	

schema = make_executable_schema(
	type_defs,
	query,
	mutation,
	message,
	moderation_status,
	blacklist_stats,
	blacklist_word,
	blacklist_stats,
	violation,
	channel_stats,
	user_moderation_full_status
)
app = CORSMiddleware(
	GraphQL(schema, debug=True),
	allow_origins=['*'],
	allow_credentials=True,
	allow_methods=("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"),
	allow_headers=["*"],   # <-- ESTA ES LA CLAVE
)