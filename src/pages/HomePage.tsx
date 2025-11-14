// src/pages/HomePage.tsx
import { useMemo, useState } from "react";
import {
	Badge,
	Box,
	Container,
	Flex,
	Heading,
	HStack,
	Button,
	Input,
	Stack,
	Text,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type Channel = {
	id: string;
	name: string;
	description: string;
	members: number;
	isNew?: boolean;
};

const MOCK_CHANNELS: Channel[] = [
	{
		id: "inf326",
		name: "INF326 - Interfaz Grupo 8",
		description: "Canal para coordinar avances, issues y PRs del proyecto.",
		members: 18,
		isNew: true,
	},
	{
		id: "frontend",
		name: "Frontend & UI",
		description: "Discusión de componentes, Chakra, diseño y UX.",
		members: 25,
	},
	{
		id: "backend",
		name: "Backend & APIs",
		description: "FastAPI, auth, endpoints y arquitectura.",
		members: 19,
	},
	{
		id: "random",
		name: "Off-topic / Random",
		description: "Memes, descansos y todo lo que no va en los otros canales.",
		members: 12,
	},
];

export default function HomePage() {
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	const filteredChannels = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return MOCK_CHANNELS;
		return MOCK_CHANNELS.filter((ch) =>
			ch.name.toLowerCase().includes(q)
		);
	}, [search]);

	const handleChannelClick = (channel: Channel) => {
		// Más adelante puedes validar auth, etc.
		// Por ahora solo navegamos a una ruta por canal
		navigate(`/channels/${channel.id}`);
	};

	return (
		<Box minH="100vh" bg="bg.subtle">
			{/* Navbar tipo Reddit */}
			<Flex
				as="header"
				px={6}
				py={3}
				align="center"
				justify="space-between"
				borderBottomWidth="1px"
				borderColor="border.subtle"
				bg="bg.surface"
				position="sticky"
				top={0}
				zIndex={10}
			>
				<HStack gap={2}>
					<Box
						w={8}
						h={8}
						borderRadius="full"
						bg="blue.500"
					/>
					<Heading size="md">
						INF326 Community
					</Heading>
				</HStack>

				<HStack maxW="lg" flex="1" ml={8} gap={2}>
					<Input
						placeholder="Buscar canal por nombre..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						bg="bg.subtle"
					/>
					<Button
						aria-label="Buscar"
						variant="outline"
						p={2}
					>
						<FiSearch />
					</Button>
				</HStack>
			</Flex>

			{/* Contenido central con lista de canales */}
			<Container maxW="4xl" py={8}>
				<Stack gap={4}>
					{filteredChannels.length === 0 && (
						<Box
							bg="bg.surface"
							borderRadius="lg"
							borderWidth="1px"
							borderColor="border.subtle"
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
								<Heading size="sm">
									{channel.name}
								</Heading>
								<HStack gap={2}>
									<Text fontSize="xs" color="fg.muted">
										{channel.members} miembros
									</Text>
									{channel.isNew && (
										<Badge colorScheme="green">
											Nuevo
										</Badge>
									)}
								</HStack>
							</Flex>

							<Text
								mt={2}
								fontSize="sm"
								color="fg.muted"
							>
								{channel.description}
							</Text>
						</Box>
					))}
				</Stack>
			</Container>
		</Box>
	);
}