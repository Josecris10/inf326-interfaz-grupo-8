import { useState } from "react";
import {
	Badge,
	Box,
	Button,
	Container,
	Flex,
	Heading,
	HStack,
	Input,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

import { MOCK_CHANNELS } from "../data/mock_channels";
import type { Channel } from "../types/channel";

export default function HomePage() {
	const [search, setSearch] = useState("");
	const [filteredChannels, setFilteredChannels] = useState<Channel[]>(MOCK_CHANNELS);
	const navigate = useNavigate();

	const handleChannelClick = (channel: Channel) => {
		navigate(`/channels/${channel.id}`, {
			state: { channel }
		});
	};

	const handleSearch = () => {
		const q = search.trim().toLowerCase();
		if (!q) {
			setFilteredChannels(MOCK_CHANNELS);
			return;
		}
		setFilteredChannels(MOCK_CHANNELS.filter((ch) =>
			ch.name.toLowerCase().includes(q)
		));
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
						_hover={{
							bg: "#fff",
							color: "#004B85",
						}}
						onClick={() => handleSearch()}
					>
						<FiSearch />
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
				>
					<Text>
						Cerrar Sesión
					</Text>
				</Button>
			</Flex>

			{/* Contenido central con lista de canales */}
			<Container maxW="4xl" py={8}>
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
										bg={channel.channel_type === "public" ? "grey" : "yellow.500"}
										color="white"
									>
										{channel.channel_type === "public" ? "Publico" : "Privado"}
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
								<Text>
									{channel.threads.length} hilos
								</Text>
							</HStack>
						</Box>
					))}
				</Stack>
			</Container>
		</Box>
	);
}