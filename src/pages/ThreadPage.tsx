import { useState, useRef, useMemo } from "react";
import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	HStack,
	Input,
	Stack,
	Text,
	Textarea,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { TbPointFilled } from "react-icons/tb";
import { LuAudioLines } from "react-icons/lu";
import { FaFile } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { IoText } from "react-icons/io5";

import { MOCK_MESSAGES } from "../data/mock_messages";
import type { Channel } from "../types/channel";
import type { Thread } from "../types/thread";

export default function ThreadPage() {
	const [search, setSearch] = useState("");
	const [newMessage, setNewMessage] = useState("");
	const navigate = useNavigate();

	const location = useLocation() as {
		state: { thread: Thread; channel: Channel };
	};
	const thread = location.state.thread;
	const channel = location.state.channel;

	const replyFormRef = useRef<HTMLDivElement | null>(null);

	const threadMessages = useMemo(
		() => MOCK_MESSAGES.filter((m) => Number(m.thread_id) === thread.id),
		[thread.id]
	);

	const filteredMessages = useMemo(() => {
		let result = threadMessages;

		const q = search.trim().toLowerCase();
		if (q) {
			result = result.filter((m) =>
				(m.content ?? "").toLowerCase().includes(q)
			);
		}

		return result;
	}, [threadMessages, search]);

	const handleScrollToReply = () => {
		replyFormRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const handleSendMessage = () => {
		if (!newMessage.trim()) return;
		console.log("Nuevo mensaje para el hilo:", {
			thread_id: thread.id,
			content: newMessage,
		});
		setNewMessage("");
	};

	return (
		<Box minW="100vh" bg="bg.subtle">
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
							<Heading size="3xl" color="#fff">
								{thread.title}
							</Heading>
							<Text fontSize="sm" color="#eceaeaff">
								Fecha de creación: {thread.creation_date}
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
							onClick={() =>
								navigate(`/channels/${channel.id}`, {
									state: { channel },
								})
							}
						>
							<Text fontSize={"lg"}>
								Volver
							</Text>
						</Button>
					</Flex>
				</Container>
			</Box>

			{/* Contenido */}
			<Container maxW="6xl" py={8}>
				<Stack gap={3} alignItems="center">
					{/* Box principal del hilo */}
					<Box
						key={thread.id}
						w="100%"
						maxW="900px"
						borderRadius="lg"
						borderWidth="1px"
						borderColor="border.subtle"
						backgroundColor="#edececff"
						p={4}
					>
						<HStack>
							<Heading size="xl">
								{thread.title}
							</Heading>
							<TbPointFilled />
							<Text fontSize="lg">
								creado por {thread.author_id} hace {thread.creation_date}
							</Text>
						</HStack>

						<Text
							mt={3}
							fontSize="lg"
							color="fg.muted"
						>
							{thread.content}
						</Text>

						<Flex mt={4} justify="flex-end">
							<Button
								aria-label="Responder"
								variant="outline"
								p={2}
								bg="#004B85"
								color="#fff"
								_hover={{
									bg: "#fff",
									color: "#004B85",
								}}
								onClick={handleScrollToReply}
							>
								Responder
							</Button>
						</Flex>
					</Box>

					{/* Buscador dentro del thread */}
					<HStack>
						<Input
							placeholder="Buscar por palabra clave..."
							minW="lg"
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
						>
							<FiSearch />
						</Button>
					</HStack>

					{/* Lista de mensajes del hilo */}
					{filteredMessages.map((message) => (
						<Box
							key={message.id}
							w="85%"
							maxW="900px"
							borderRadius="md"
							borderWidth="1px"
							borderColor="border.subtle"
							backgroundColor="#edececff"
							p={4}
							position="relative"
						>
							<Flex
								position="absolute"
								top={3}
								right={3}
								align="center"
							>
								{message.type === "audio" ? (
									<LuAudioLines />
								) : message.type === "file" ? (
									<FaFile />
								) : (
									<IoText />
								)}
							</Flex>

							<HStack>
								<Heading size="lg">
									{message.user_id}
								</Heading>
								<TbPointFilled />
								<Text fontSize="sm">
									hace {message.created_at}
								</Text>
							</HStack>

							<Text
								mt={1}
								fontSize="md"
								color="fg.muted"
							>
								{message.content}
							</Text>

							<Flex mt={4} justify="flex-end">
								<Text fontSize="sm">
									Última vez actualizado: {message.updated_at}
								</Text>
							</Flex>
						</Box>
					))}

					{/* Formulario de respuesta */}
					<Box
						ref={replyFormRef}
						w="85%"
						maxW="900px"
						borderRadius="md"
						borderWidth="1px"
						borderColor="border.subtle"
						backgroundColor="#edececff"
						p={4}
						mt={4}
					>
						<Heading size="md" mb={2}>
							Responder al hilo
						</Heading>
						<Textarea
							placeholder="Escribe tu mensaje..."
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							rows={4}
							bg="bg.subtle"
						/>
						<Flex justify="flex-end" mt={2}>
							<Button
								aria-label="Buscar"
								variant="outline"
								p={2}
								bg="#008452"
								color="#fff"
								_hover={{
									bg: "#fff",
									color: "#008452",
								}}
								onClick={handleSendMessage}
								disabled={!newMessage.trim()}
							>
								Enviar
							</Button>
						</Flex>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}