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
import { createThread } from "../services/threads_service";

export default function ChannelPage() {
	const [qSearch, setQSearch] = useState("");
	const [aSearch, setASearch] = useState("");
	const [cSearch, setCSearch] = useState("");
	const [tSearch, setTSearch] = useState("");
	const [filteredThreads, setFilteredThreads] = useState<Thread[]>(MOCK_THREADS);

	const userId = 1;
	const [newTitle, setNewTitle] = useState("");
	const [newContent, setNewContent] = useState("");
	const [newCategory, setNewCategory] = useState("");
	const [newTags, setNewTags] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);

	const navigate = useNavigate();

	const location = useLocation() as {
		state: { channel: Channel };
	};
	const channel = location.state.channel;

	const handleQSearch = () => {
		const q = qSearch.trim().toLowerCase();
		if (!q) {
			setFilteredThreads(MOCK_THREADS);
			return;
		}
		setFilteredThreads(
			MOCK_THREADS.filter(
				(t) =>
					t.title.toLowerCase().includes(q) ||
					t.content.toLowerCase().includes(q)
			)
		);
	};

	const handleASearch = () => {
		const a = aSearch.trim().toLowerCase();
		if (!a) {
			setFilteredThreads(MOCK_THREADS);
			return;
		}
		setFilteredThreads(
			MOCK_THREADS.filter((t) =>
				String(t.author_id).toLowerCase().includes(a)
			)
		);
	};

	const handleCSearch = () => {
		const c = cSearch.trim().toLowerCase();
		if (!c) {
			setFilteredThreads(MOCK_THREADS);
			return;
		}
		setFilteredThreads(
			MOCK_THREADS.filter((t) =>
				t.category.toLowerCase().includes(c)
			)
		);
	};

	const handleTSearch = () => {
		const t = tSearch.trim().toLowerCase();
		if (!t || t === "") {
			setFilteredThreads(MOCK_THREADS);
			return;
		}
		setFilteredThreads(
			MOCK_THREADS.filter((thread) =>
				thread.tags.toLowerCase().includes(t)
			)
		);
	};

	const handleCreateThread = async () => {
		const title = newTitle.trim();
		const content = newContent.trim();
		const category = newCategory.trim();
		const tags = newTags.trim();

		if (!title || !content) {
			setCreateError("Título y contenido son obligatorios.");
			return;
		}

		setCreateError(null);

		try {
			setIsCreating(true);

			const newThread = await createThread({
				channel_id: String(channel.id),
				title,
				content,
				author_id: userId,
				category: category || "general",
				tags: tags || "",
			});

			// agrega el nuevo hilo a la lista filtrada actual
			setFilteredThreads((prev) => [...prev, newThread]);

			setNewTitle("");
			setNewContent("");
			setNewCategory("");
			setNewTags("");
		} catch (err) {
			setCreateError(
				err instanceof Error ? err.message : "Error al crear el hilo."
			);
		} finally {
			setIsCreating(false);
		}
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
							<Text fontSize={"lg"}>Volver</Text>
						</Button>
					</Flex>
				</Container>
			</Box>

			{/* Contenido */}
			<Container maxW="6xl" py={8}>
				<Stack gap={2}>
					{/* Info canal */}
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
										bg={
											channel.is_active
												? "green.500"
												: "red.500"
										}
										color="white"
									>
										{channel.is_active ? "Activo" : "Inactivo"}
									</Badge>
								</Flex>

								<Flex justify="space-between">
									<Text>Tipo de canal</Text>
									<Badge
										bg={
											channel.channel_type === "public"
												? "grey"
												: "yellow.500"
										}
										color="white"
									>
										{channel.channel_type === "public"
											? "Publico"
											: "Privado"}
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

					{/* Crear hilo + lista de hilos */}
					<Box
						bg="bg.surface"
						borderRadius="lg"
						borderWidth="1px"
						borderColor="border.subtle"
						p={2}
					>
						<Heading size="md" mb={4}>
							Hilos del canal
						</Heading>

						{/* Formulario para crear hilo */}
						<Box
							bg="bg.surface"
							borderRadius="md"
							borderWidth="1px"
							borderColor="border.subtle"
							backgroundColor={"#edececff"}
							p={4}
							mb={4}
						>
							<Heading size="sm" mb={3}>
								Crear nuevo hilo
							</Heading>

							<Stack gap={2}>
								<Input
									placeholder="Título del hilo"
									value={newTitle}
									onChange={(e) => setNewTitle(e.target.value)}
									bg="bg.subtle"
								/>
								<Input
									placeholder="Contenido"
									value={newContent}
									onChange={(e) => setNewContent(e.target.value)}
									bg="bg.subtle"
								/>
								<Input
									placeholder="Categoría (ej: dudas, anuncio, tarea...)"
									value={newCategory}
									onChange={(e) => setNewCategory(e.target.value)}
									bg="bg.subtle"
								/>
								<Input
									placeholder="Tags separados por comas"
									value={newTags}
									onChange={(e) => setNewTags(e.target.value)}
									bg="bg.subtle"
								/>

								{createError && (
									<Text fontSize="sm" color="red.500">
										{createError}
									</Text>
								)}

								<Flex justify="flex-end">
									<Button
										onClick={handleCreateThread}
										colorScheme="blue"
										disabled={isCreating}
									>
										{isCreating ? "Creando..." : "Crear hilo"}
									</Button>
								</Flex>
							</Stack>
						</Box>

						{/* Buscadores + lista de hilos */}
						<Stack gap={4}>
							<HStack flex="1" gap={2} justify="center">
								{/* búsquedas existentes: q, autor, categoría, tags */}
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
									onClick={handleQSearch}
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
									onClick={handleASearch}
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
									onClick={handleCSearch}
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
									onClick={handleTSearch}
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
											onClick={() =>
												navigate(`/threads/${thread.id}`, {
													state: { thread, channel },
												})
											}
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
												<Text>Tags: {thread.tags}</Text>
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