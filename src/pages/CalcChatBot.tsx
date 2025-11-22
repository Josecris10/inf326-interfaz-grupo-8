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
import type { ChatMessage } from "@/types/calc.chatbot";
import { SolveEquationCalculoChatbotReply, SolveIntegralCalculoChatbotReply, SolveDifferentiateCalculoChatbotReply } from "@/services/calc_chatbot_service";

export default function CalcChatBot() {
	const navigate = useNavigate();
	const [mode, setMode] = useState("ecuaciones"); 

	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: 1,
			sender: "bot",
			content: `Hola 👋 Soy el Bot de Cálculo. Te ayudo a resolver ecuaciones, derivadas e integrales. Arriba puedes elegir el tipo de operación que quieres resolver. Escribe únicamente la expresión matemática, sin texto adicional. Recuerda usar símbolos explícitos: 5*x + 10 en lugar de 5x + 10, y ** para potencias (por ejemplo, x**2). ¡Listo cuando quieras! 😊`,
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
			if (mode == "ecuaciones"){
				const msgRes = await SolveEquationCalculoChatbotReply(text);
				let aux = msgRes.solution
				res = "Las raíces de tu ecuación son las siguientes: " + aux.toString();
			} else if (mode == "integrales"){
				const msgRes = await SolveIntegralCalculoChatbotReply(text);
				res = "La integral de tu expresión es la siguiente: " + msgRes.result;
			} else {
				const msgRes = await SolveDifferentiateCalculoChatbotReply(text);
				res = "La derivada de tu expresión es la siguiente: " + msgRes.result;
			}
			
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
						ChatBot de Cálculo
					</Heading>
					<Text fontSize="lg" color="#eceaeaff">
						Te ayuda a responder operaciones matemáticas complejas!
					</Text>
				</Stack>

				<HStack mb={4} justify="center">
					<select
						value={mode}
						onChange={(e) => setMode(e.target.value)}
						style={{
						padding: "10px 14px",
						borderRadius: "12px",
						border: "1px solid #bbb",
						fontSize: "15px",
						backgroundColor: "white",
						boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
						cursor: "pointer",
						transition: "all 0.2s ease",
						}}
						onMouseOver={(e) => {
						e.currentTarget.style.boxShadow = "0 3px 8px rgba(0, 0, 0, 0.12)";
						}}
						onMouseOut={(e) => {
						e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.08)";
						}}
					>
						<option value="ecuaciones">Ecuaciones</option>
						<option value="derivadas">Derivadas</option>
						<option value="integrales">Integrales</option>
					</select>
				</HStack>
				
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