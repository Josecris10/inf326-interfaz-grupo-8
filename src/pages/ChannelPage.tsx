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
import { FiSearch } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

import { MOCK_THREADS } from "../data/mock_threads";
import type { Channel } from "../types/channel";
import type { Thread } from "../types/thread";

export default function ChannelPage() {
	const [qSearch, setQSearch] = useState("");
	const [aSearch, setASearch] = useState("");
	const [cSearch, setCSearch] = useState("");
	const [tSearch, setTSearch] = useState("");
	const [filteredThreads, setFilteredThreads] = useState<Thread[]>(MOCK_THREADS);
	const navigate = useNavigate();

	const location = useLocation() as {
		state: { channel: Channel }
	};
	const channel = location.state.channel;

	const handleQSearch = () => {
		const q = qSearch.trim().toLowerCase();
		if (!q) {
			setFilteredThreads(MOCK_THREADS);
			return;
		}
		setFilteredThreads(MOCK_THREADS.filter((t) =>
			t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q)
		));
	};

	const handleASearch = () => {
		const a = aSearch.trim().toLowerCase();
		if (!a) {
			setFilteredThreads(MOCK_THREADS);
			return;
		}
		setFilteredThreads(MOCK_THREADS.filter((t) =>
			String(t.author_id).toLowerCase().includes(a)
		));
	};

	const handleCSearch = () => {
		const c = cSearch.trim().toLowerCase();
		if (!c) {
			setFilteredThreads(MOCK_THREADS);
			return;
		}
		setFilteredThreads(MOCK_THREADS.filter((t) =>
			t.category.toLowerCase().includes(c)
		));
	};

	const handleTSearch = () => {
		const t = tSearch.trim().toLowerCase();
		if (!t || t === "") {
			setFilteredThreads(MOCK_THREADS);
			return;
		}
		setFilteredThreads(MOCK_THREADS.filter((thread) =>
			thread.tags.toLowerCase().includes(t)
		));
	};

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
							<Heading size="3xl" color={"#fff"}>
								{channel.name}
							</Heading>
							<Text fontSize="sm" color="#eceaeaff">
								Fecha de creación: {channel.created_at}
							</Text>
						</Stack>

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
							onClick={() => navigate("/home")}
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
							<Heading size="lg" mb={4}>
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

						<Stack gap={4}>
							<HStack flex="1" gap={2} justify="center">
								<Input
									placeholder="Buscar por palabra clave..."
									value={qSearch}
									onChange={(e) => setQSearch(e.target.value)}
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
									onClick={() => handleQSearch()}
								>
									<FiSearch />
								</Button>

								<Input
									placeholder="Buscar por autor..."
									value={aSearch}
									onChange={(e) => setASearch(e.target.value)}
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
									onClick={() => handleASearch()}
								>
									<FiSearch />
								</Button>

								<Input
									placeholder="Buscar por categoria..."
									value={cSearch}
									onChange={(e) => setCSearch(e.target.value)}
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
									onClick={() => handleCSearch()}
								>
									<FiSearch />
								</Button>

								<Input
									placeholder="Buscar por tags..."
									value={tSearch}
									onChange={(e) => setTSearch(e.target.value)}
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
									onClick={() => handleTSearch()}
								>
									<FiSearch />
								</Button>
							</HStack>

							{filteredThreads.length === 0 ? (
								<Text fontSize="sm" color="fg.muted">
									No se han encontrado hilos...
								</Text>
							) : (
								<Stack gap={4}>
									{filteredThreads.map((thread) => (
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
											onClick={() => navigate(`/threads/${thread.id}`, {
												state: { thread, channel}
											})}
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
						</Stack>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}