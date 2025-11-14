import { useMemo, useState } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";

import { MOCK_THREADS } from "../data/mock_threads";
import type { Channel } from "../types/channel";
import { FiSearch } from "react-icons/fi";

export default function ChannelPage() {
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	const location = useLocation() as {
		state: { channel: Channel }
	};
	const channel = location.state.channel;

	const channelThreads = useMemo(
		() =>
			MOCK_THREADS.filter((t) =>
				t.channel_id === channel.id
			),
		[channel.id]
	);

	return (
		<Box minH="100vh" bg="bg.subtle">
			{/* Header */}
			<Box
				bg="#004B85"
				borderBottomWidth="4px"
				borderColor="#F7AE00"
				px={6}
				py={4}
			>
				<Container maxW="8xl">
					<Flex justify="space-between" align="center">
						<Stack gap={1}>
							<Heading size="lg" color={"#fff"}>
								{channel.name}
							</Heading>
							<Text fontSize="sm" color="#eceaeaff">
								Fecha de creación: {channel.created_at}
							</Text>
						</Stack>

						<Button
							variant="outline"
							onClick={() => navigate("/home")}
							color={"#fff"}
						>
							Volver
						</Button>
					</Flex>
				</Container>
			</Box>

			{/* Contenido */}
			<Container maxW="6xl" py={8}>
				<Stack gap={2}>
					<Box
						bg="bg.surface"
						borderRadius="lg"
						borderWidth="1px"
						borderColor="border.subtle"
					>
						<Box
							bg="bg.surface"
							borderRadius="md"
							borderWidth="1px"
							borderColor="border.subtle"
							backgroundColor={"#edececff"}
							p={4}
						>
							<Heading size="md" mb={4}>
								Información del canal
							</Heading>

							<Stack gap={2} fontSize="sm" color="fg.muted">
								<Flex justify="space-between">
									<Text>Propietario</Text>
									<Text fontWeight="medium">
										{channel.owner_id}
									</Text>
								</Flex>
								
								<Flex justify="space-between">
									<Text>Actividad del canal</Text>
									<Badge
										bg={channel.is_active ? "green.500" : "red.500"}
										color="white"
									>
										{channel.is_active ? "Activo" : "Inactivo"}
									</Badge>
								</Flex>

								<Flex justify="space-between">
									<Text>Tipo de canal</Text>
									<Badge
										bg={channel.channel_type === "public" ? "grey" : "yellow.500"}
										color="white"
									>
										{channel.channel_type === "public" ? "Publico" : "Privado"}
									</Badge>
								</Flex>

								<Flex justify="space-between">
									<Text>Número de usuarios</Text>
									<Text fontWeight="medium">
										{channel.users.length}
									</Text>
								</Flex>

								<Flex justify="space-between">
									<Text>Número de hilos</Text>
									<Text fontWeight="medium">
										{channel.threads.length}
									</Text>
								</Flex>
							</Stack>
						</Box>
					</Box>
					<Box
						bg="bg.surface"
						borderRadius="lg"
						borderWidth="1px"
						borderColor="border.subtle"
						p={6}
					>
						<Heading size="md" mb={4}>
							Hilos del canal
						</Heading>

						{channelThreads.length === 0 ? (
							<Text fontSize="sm" color="fg.muted">
								Este canal aún no tiene hilos.
							</Text>
						) : (
							<Stack gap={4}>
								<HStack flex="1" gap={2} justify="center">
									<Input
										placeholder="Buscar por palabra clave..."
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										bg="bg.subtle"
									/>
									<Input
										placeholder="Buscar por autor..."
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										bg="bg.subtle"
									/>
									<Input
										placeholder="Buscar por categoria..."
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										bg="bg.subtle"
									/>
									<Input
										placeholder="Buscar por tags..."
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
									>
										<FiSearch />
									</Button>
								</HStack>
								{channelThreads.map((thread) => (
									<Box
										key={thread.id}
										borderRadius="md"
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
									>
										<Heading size="sm">
											{thread.title}
										</Heading>

										<Text
											mt={1}
											fontSize="sm"
											color="fg.muted"
										>
											{thread.content}
										</Text>

										<Stack
											mt={2}
											direction="row"
											gap={3}
											fontSize="xs"
											color="fg.muted"
										>
											<Text>
												Autor: {thread.author_id}
											</Text>
											<Text>
												Categoría: {thread.category}
											</Text>
											<Text>
												Tags: {thread.tags}
											</Text>
										</Stack>
									</Box>
								))}
							</Stack>
						)}
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}