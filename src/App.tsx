import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Stack,
	Text,
} from "@chakra-ui/react";

function App() {
	return (
		<Box bg="bg.subtle" minH="100vh">
			<Flex
				as="header"
				px={6}
				py={4}
				align="center"
				justify="space-between"
				borderBottomWidth="1px"
				borderColor="border.subtle"
			>
				<Heading size="md">INF326 Chakra Base</Heading>
			</Flex>

			<Container maxW="4xl" py={10}>
				<Stack
					gap={6}
					bg="bg.surface"
					p={8}
					rounded="xl"
					shadow="lg"
				>
					<Heading size="lg">Bienvenido 👋</Heading>
					<Text color="fg.muted">
						Este es tu proyecto base usando Chakra UI v3 con React + Vite.
					</Text>

					<Flex gap={4} wrap="wrap">
						<Button>Botón principal</Button>
						<Button variant="outline">Botón secundario</Button>
					</Flex>
				</Stack>
			</Container>
		</Box>
	);
}

export default App;