import { useState } from "react";
import { useEffect } from "react";
import {
	Badge,
	Box,
	Button,
	Container,
	Flex,
	Heading,
	HStack,
	Input,
	NativeSelect,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaBook } from "react-icons/fa";
import { FaCalculator } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { FaWikipediaW } from "react-icons/fa";

import { searchChannel } from "../services/search_service";
import type { Channel, ChannelType } from "../types/channel";
import { createChannel } from "../services/channels_service";
import { getUserID } from "@/services/storage";
import { PresenceStatsCard } from "@/components/auth/Presence";

export default function HomePage() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [newName, setNewName] = useState("");
	const [newType, setNewType] = useState<"public" | "private">("public");
	const [isCreating, setIsCreating] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);

	const navigate = useNavigate();
	
	const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
	const [search, setSearch] = useState("");

	const [channelType, setChannelType] = useState("");
	const [isActive, setIsActive] = useState("");

	useEffect(() => {
		async function fetchAll() {
			const params: Record<string, string | number | boolean> = {};

			params.q = "";
			params.channel_type = "public";
			params.is_active = true;
			params.limit = 50;
			params.offset = 0;
			
			try {
				const all = await searchChannel(params);
				setFilteredChannels(all);
			} catch (err) {
				console.error("Error al cargar canales:", err);
				setFilteredChannels([]);
			}
		}
		fetchAll();
	}, []);

	const handleChannelClick = (channel: Channel) => {
		navigate(`/channels/${channel.id}`, { state: { channel } });
	};

	const handleSearchClick = async () => {
		const params: Record<string, string | number | boolean> = {};

		const q = search.trim();
		if (q) params.q = q;

		if (channelType) params.channel_type = channelType.toLowerCase();
		if (isActive) params.is_active = isActive === "true";

		params.limit = 50;
		params.offset = 0;

		try {
			const result = await searchChannel(params);
			console.log(result);
			setFilteredChannels(result);
		} catch (err) {
			console.error("Error al buscar canales:", err);
			setFilteredChannels([]);
		}
	};

	const handleCreateChannel = async () => {
		const name = newName.trim();
		if (!name) {
			setCreateError("Debes ingresar un nombre para el canal.");
			return;
		}

		setCreateError(null);

		try {
			setIsCreating(true);

			const createdChannel = await createChannel({
				name,
				channel_type: newType.toLowerCase() as ChannelType,
				owner_id: String(getUserID()),
				users: []
			});

			setFilteredChannels((prevChannels) => [...prevChannels, createdChannel]);

			setNewName("");
			setNewType("public");
		} catch (err) {
			setCreateError(
				err instanceof Error ? err.message : "Error inesperado al crear el canal."
			);
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<Box minH="100vh" bg="bg.subtle">
			<Flex
				as="header"
				px={6}
				py={4}
				align="center"
				justify="space-between"
				borderBottomWidth="4px"
				borderColor="#F7AE00"
				bg="#004B85"
				position="sticky"
				top={0}
				zIndex={10}
				w="100%"
				flexWrap="wrap"
			>

				{/* Izquierda */}
				<HStack gap={2}>
					<Heading size="4xl" color="#fff">
						INF326 Community
					</Heading>
				</HStack>

				{/* Botón menú (solo móvil) */}
				<Button
					display={{ base: "flex", md: "none" }}
					onClick={() => setMenuOpen(!menuOpen)}
					bg="#003B65"
					color="white"
					_hover={{ bg: "#002B55" }}
				>
					{menuOpen ? "Cerrar menú" : "Menú"}
				</Button>

				{/* CONTENIDO RESPONSIVE */}
				<Flex
					w="100%"
					mt={4}
					gap={4}
					display={{ base: menuOpen ? "flex" : "none", md: "flex" }}
					flexWrap="wrap"
					align="center"
					justify="space-between"
				>
					{/* Buscador + filtros */}
					<Flex flex="1" gap={2} flexWrap="wrap">
						<Input
							placeholder="Buscar por palabra clave..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							bg="bg.subtle"
							flex="1"
							minW="200px"
						/>

						<Box minW="140px">
							<NativeSelect.Root variant="outline" size="md">
								<NativeSelect.Field
									bg="bg.subtle"
									value={channelType}
									onChange={(e) => setChannelType(e.target.value)}
								>
									<option value="public">Público</option>
									<option value="private">Privado</option>
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</Box>

						<Box minW="140px">
							<NativeSelect.Root variant="outline" size="md">
								<NativeSelect.Field
									bg="bg.subtle"
									value={isActive}
									onChange={(e) => setIsActive(e.target.value)}
								>
									<option value="true">Activo</option>
									<option value="false">Inactivo</option>
								</NativeSelect.Field>
								<NativeSelect.Indicator />
							</NativeSelect.Root>
						</Box>

						<Button
							variant="outline"
							bg="#004B85"
							color="white"
							_hover={{ bg: "#003B65" }}
							onClick={handleSearchClick}
						>
							<FiSearch />
						</Button>
					</Flex>

					{/* Botones de navegación */}
					<HStack gap={2} flexWrap="wrap">
						<Button variant="outline" p={2} bg="#004B85" color="#fff" onClick={() => navigate("/academic")}>
							<FaBook />
						</Button>
						<Button variant="outline" p={2} bg="#004B85" color="#fff" onClick={() => navigate("/calculator")}>
							<FaCalculator />
						</Button>
						<Button variant="outline" p={2} bg="#004B85" color="#fff" onClick={() => navigate("/programation")}>
							<FaLaptopCode />
						</Button>
						<Button variant="outline" p={2} bg="#004B85" color="#fff" onClick={() => navigate("/utility")}>
							<FaTools />
						</Button>
						<Button variant="outline" p={2} bg="#004B85" color="#fff" onClick={() => navigate("/wikipedia")}>
							<FaWikipediaW />
						</Button>
					</HStack>

					{/* Stats */}
					<PresenceStatsCard />

					{/* Logout */}
					<Button
						variant="outline"
						p={2}
						bg="#D60019"
						color="#fff"
						_hover={{ bg: "#fff", color: "#D60019" }}
						onClick={() => navigate("/login")}
					>
						<Text fontSize="lg">Cerrar Sesión</Text>
					</Button>
				</Flex>
			</Flex>

			<Container maxW="4xl" py={8}>
				<Box
					bg="bg.surface"
					borderRadius="lg"
					borderWidth="1px"
					borderColor="border.subtle"
					backgroundColor={"#edececff"}
					p={4}
					mb={6}
				>
					<Heading size="md" mb={4}>
						Crear nuevo canal
					</Heading>

					<Stack gap={3}>
						<Box>
							<Text fontSize="sm" mb={1}>
								Nombre del canal
							</Text>
							<Input
								placeholder="Ej: algoritmos, ayudantías, memes..."
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								bg="bg.subtle"
							/>
						</Box>

						<Box>
							<Text fontSize="sm" mb={1}>
								Tipo de canal
							</Text>
							<select
								value={newType}
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
									setNewType(e.target.value as "public" | "private")
								}
								style={{
									width: "100%",
									padding: "8px",
									borderRadius: "8px",
									border: "1px solid #ccc",
								}}
							>
								<option value="public">Público</option>
								<option value="private">Privado</option>
							</select>
						</Box>

						{createError && (
							<Text fontSize="sm" color="red.500">
								{createError}
							</Text>
						)}

						<Flex justify="flex-end">
							<Button
								onClick={handleCreateChannel}
								colorScheme="blue"
								disabled={isCreating}
							>
								{isCreating ? "Creando..." : "Crear canal"}
							</Button>
						</Flex>
					</Stack>
				</Box>

				<Stack gap={4}>
					{filteredChannels?.length === 0 && (
						<Box
							bg="bg.surface"
							borderRadius="lg"
							borderWidth="1px"
							borderColor="border.subtle"
							color={"#ccc"}
							p={6}
							textAlign="center"
						>
							<Text color="fg.muted">
								No se encontraron canales con ese nombre.
							</Text>
						</Box>
					)}

					{filteredChannels.filter((channel) => channel.deleted_at === null).map((channel) => (
						<Box
							key={channel.id}
							bg="bg.surface"
							borderRadius="lg"
							borderWidth="1px"
							borderColor="border.subtle"
							backgroundColor={"#edececff"}
							p={4}
							cursor="pointer"
							transition="all 0.15s ease-out"
							_hover={{
								bg: "bg.muted",
								transform: "translateY(-2px)",
								boxShadow: "md",
							}}
							onClick={() => handleChannelClick(channel)}
						>
							<Flex justify="space-between" align="center">
								<HStack gap={2}>
									<Heading size="sm">
										{channel.name}
									</Heading>

									<Badge
										bg={channel.channel_type.toLowerCase() === "public" ? "grey" : "yellow.500"}
										color="white"
									>
										{channel.channel_type.toLowerCase() === "public" ? "Publico" : "Privado"}
									</Badge>
								</HStack>

								<Text fontSize="xs" color="fg.muted">
									Propietario: <strong>{channel.owner_id}</strong>
								</Text>
							</Flex>

							<Badge
								bg={channel.is_active ? "green.500" : "red.500"}
								color="white"
							>
								{channel.is_active ? "Activo" : "Inactivo"}
							</Badge>

							<HStack
								mt={3}
								gap={4}
								fontSize="xs"
								color="fg.muted"
							>
								<Text>
									{channel.users.length} usuarios
								</Text>
							</HStack>
						</Box>
					))}
				</Stack>
			</Container>
		</Box>
	);
}
