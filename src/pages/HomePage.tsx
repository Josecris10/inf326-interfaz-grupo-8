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
import { FiSearch, FiSliders } from "react-icons/fi";
import { FaBook } from "react-icons/fa";
import { FaCalculator } from "react-icons/fa";
import { FaLaptopCode } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { FaWikipediaW } from "react-icons/fa";

//import { MOCK_CHANNELS } from "../data/mock_channels";
import { searchChannel } from "../services/search_service";
import type { Channel } from "../types/channel";
import { createChannel } from "../services/channels_service";

export default function HomePage() {
	//const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);

	const userId = 1;
	const [newName, setNewName] = useState("");
	const [newType, setNewType] = useState<"public" | "private">("public");
	const [isCreating, setIsCreating] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);

	const navigate = useNavigate();
	
	const [_, setChannels] = useState<Channel[]>([]);
	const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
	const [search, setSearch] = useState("");

	const [showAdvanced, setShowAdvanced] = useState(false);
	const [channelType, setChannelType] = useState("");
	const [isActive, setIsActive] = useState("");
	
	
	// const channels = useMemo(() => MOCK_CHANNELS, []);

	// const filteredChannels = useMemo(() => {
	// 	let result = channels;

	// 	const q = search.trim().toLowerCase();
	// 	if (q) {
	// 		result = result.filter((c) =>
	// 			(c.name ?? "").toLowerCase().includes(q)
	// 		);
	// 	}

	// 	return result;
	// }, [channels, search]);

	useEffect(() => {
		async function fetchAll() {
			try {
				const all = await searchChannel(undefined);
				setChannels(all);
				setFilteredChannels(all);
			} catch (err) {
				console.error("Error al cargar canales:", err);
				setChannels([]);
				setFilteredChannels([]);
			}
		}

		fetchAll();
	}, []);



	const handleChannelClick = (channel: Channel) => {
		navigate(`/channels/${channel.id}`, { state: { channel } });
	};

	const handleSearchClick = async () => {
		const params: any = {};

		// Búsqueda libre
		const q = search.trim();
		if (q) params.q = q;

		// Filtros
		if (channelType) params.channel_type = channelType.toUpperCase();
		if (isActive) params.is_active = isActive === "true";

		// Paginación automática
		params.limit = 50;
		params.offset = 0;

		try {
			const result = await searchChannel(params);
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

			const newChannel = await createChannel({
				name,
				owner_id: String(userId),
				users: [],
				channel_type: newType.toUpperCase(),
			});

			setChannels((prev) => [...prev, newChannel]);
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
			{/* Navbar tipo Reddit */}
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
			>
				<HStack gap={2}>
					<Heading size="4xl" color={"#fff"}>
						INF326 Community
					</Heading>
				</HStack>

				<HStack maxW="lg" flex="1" ml={8} gap={2}>
					<Input
						placeholder="Buscar por palabra clave..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						bg="bg.subtle"
					/>

					<Button
						aria-label="Buscar"
						variant="outline"
						p={2}
						bg="#004B85"
						color="#fff"
						onClick={handleSearchClick}
					>
						<FiSearch />
					</Button>
				</HStack>

				<Box position="relative">
					<Button
						size="sm"
						variant="outline"
						bg="#004B85"
						color="#fff"
						onClick={() => setShowAdvanced(!showAdvanced)}
					>
						<HStack gap={2}>
							<FiSliders />
							<Text>Filtros</Text>
							{(channelType || isActive) && (
								<Badge colorScheme="green" borderRadius="full">●</Badge>
							)}
						</HStack>
					</Button>

					{showAdvanced && (
						<Box
							position="absolute"
							top="110%"
							right="0"
							w="260px"
							p={4}
							bg="white"
							borderRadius="md"
							borderWidth="1px"
							borderColor="gray.200"
							boxShadow="xl"
							zIndex={9999}
						>
							{/* filtros */}
							<Stack gap={2}>
								{/* TIPO */}
								<Box>
									<Text fontSize="sm" mb={1} fontWeight="medium">
										Tipo
									</Text>
									<NativeSelect.Root bg="white" size="sm" borderRadius="md">
										<NativeSelect.Field
											value={channelType}
											onChange={(e) => setChannelType(e.target.value)}
										>
											<option value="">Todos</option>
											<option value="public">Público</option>
											<option value="private">Privado</option>
										</NativeSelect.Field>
									</NativeSelect.Root>
								</Box>

								{/* ESTADO */}
								<Box>
									<Text fontSize="sm" mb={1} fontWeight="medium">
										Estado
									</Text>
									<NativeSelect.Root bg="white" size="sm" borderRadius="md">
										<NativeSelect.Field
											value={isActive}
											onChange={(e) => setIsActive(e.target.value)}
										>
											<option value="">Todos</option>
											<option value="true">Activo</option>
											<option value="false">Inactivo</option>
										</NativeSelect.Field>
									</NativeSelect.Root>
								</Box>
							</Stack>
						</Box>
					)}
				</Box>
				<HStack maxW="sm" flex="1" ml={8} gap={2}>
					<Button
						aria-label="Academico"
						variant="outline"
						p={2}
						bg="#004B85"
						color="#fff"
						onClick={() => navigate("/academic")}
					>
						<FaBook />
					</Button>
					<Button
						aria-label="Calculadora"
						variant="outline"
						p={2}
						bg="#004B85"
						color="#fff"
						onClick={() => navigate("/calculator")}
					>
						<FaCalculator />
					</Button>
					<Button
						aria-label="Programacion"
						variant="outline"
						p={2}
						bg="#004B85"
						color="#fff"
						onClick={() => navigate("/programation")}
					>
						<FaLaptopCode />
					</Button>
					<Button
						aria-label="Utilidad"
						variant="outline"
						p={2}
						bg="#004B85"
						color="#fff"
						onClick={() => navigate("/utility")}
					>
						<FaTools />
					</Button>
					<Button
						aria-label="Wikipedia"
						variant="outline"
						p={2}
						bg="#004B85"
						color="#fff"
						onClick={() => navigate("/wikipedia")}
					>
						<FaWikipediaW />
					</Button>
				</HStack>
				<Button
					aria-label="Cerrar Sesión"
					variant="outline"
					p={2}
					bg="#D60019"
					color="#fff"
					_hover={{
						bg: "#fff",
						color: "#D60019",
					}}
					onClick={() => navigate("/login")}
				>
					<Text fontSize={"lg"}>
						Cerrar Sesión
					</Text>
				</Button>
			</Flex>

			{/* Contenido central con lista de canales */}
			<Container maxW="4xl" py={8}>
				{/* Sección para crear un canal */}
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
							{/* select nativo HTML para evitar problemas con Chakra Select */}
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

                {/* Lista tipo Reddit */}
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

					{filteredChannels.map((channel) => (
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
								{/* <Text>
									{channel.threads.length} hilos
								</Text> */}
							</HStack>
						</Box>
					))}
				</Stack>
			</Container>
		</Box>
	);
}
