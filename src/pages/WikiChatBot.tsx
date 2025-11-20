import { useState, useRef, useEffect } from "react";
import {
	Box,
	Button,
	Flex,
	Heading,
	Stack,
	Text,
	Input,
	HStack,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { FiSend } from "react-icons/fi";
import { RiRobot3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import type { ChatMessage } from "@/types/wiki.chatbot";
import { getMessageWikipediaChatbot } from "@/services/wiki_chatbot_service";

export default function WikiChatBot() {
	const navigate = useNavigate();

	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: 1,
			sender: "bot",
			content: "Hola 👋 Soy el Bot de Wikipedia. Te ayudare a consultar información enciclopédica.",
		},
	]);

	const [input, setInput] = useState("");
	const scrollRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSend = async () => {
		const text = input.trim();
		if (!text) return;

		const newMessage: ChatMessage = {
			id: Date.now(),
			sender: "user",
			content: text,
		};

		setMessages((prev) => [...prev, newMessage]);
		setInput("");
		let res = "";

		try {
			const msgRes = await getMessageWikipediaChatbot(text);
			res = msgRes.message;
		} catch (error) {
			res = 'Ocurrió un error inesperado, intenta mas tarde';
			console.log(error);
		}
		
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now() + 1,
					sender: "bot",
					content: res,
				},
			]);
		}, 600);
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
			>
				<Stack gap={1}>
					<Heading size="3xl" color="#fff">
						ChatBot de Wikipedia
					</Heading>
					<Text fontSize="lg" color="#eceaeaff">
						Capaz de entregar definiciones y resúmenes a partir de información enciclopédica!
					</Text>
				</Stack>

				<Button
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
					<Text fontSize="lg">Volver</Text>
				</Button>
			</Flex>

			<Flex justify="center" mt={8}>
				<Box
					w="90%"
					maxW="900px"
					bg="bg.surface"
					borderRadius="lg"
					borderWidth="1px"
					borderColor="border.subtle"
					backgroundColor={"#edececff"}
					p={4}
					display="flex"
					flexDirection="column"
					h="75vh"
				>
					<Box
						flex="1"
						overflowY="auto"
						ref={scrollRef}
						pr={2}
						mb={3}
					>
						<Stack gap={4}>
							{messages.map((msg) => (
								<Flex
									key={msg.id}
									justify={msg.sender === "user" ? "flex-end" : "flex-start"}
								>
									<HStack
										align="flex-start"
										maxW="70%"
										bg={msg.sender === "user" ? "#004B85" : "#fff"}
										color={msg.sender === "user" ? "white" : "black"}
										p={3}
										borderRadius="md"
										boxShadow="sm"
									>
										{/* Ícono del bot */}
										{msg.sender === "bot" && (
											<Avatar
												size="sm"
												icon={<RiRobot3Line />}
												bg="#004B85"
												color="white"
											/>
										)}

										<Text whiteSpace="pre-wrap">{msg.content}</Text>
									</HStack>
								</Flex>
							))}
						</Stack>
					</Box>

					{/* Input + botón enviar */}
					<HStack>
						<Input
							placeholder="Escribe tu pregunta..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							bg="bg.subtle"
							flex="1"
						/>
						<Button
							bg="#004B85"
							color="#fff"
							_hover={{
								bg: "#003b6b",
							}}
							px={6}
							onClick={handleSend}
						>
							<FiSend size={20} />
						</Button>
					</HStack>
				</Box>
			</Flex>
		</Box>
	);
}