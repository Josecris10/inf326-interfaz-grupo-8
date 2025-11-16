import type { ReactNode } from "react";
import {
	Box,
	Container,
	Flex,
	Heading,
	Stack,
	Text,
} from "@chakra-ui/react";

type AuthLayoutProps = {
	title: string;
	subtitle?: string;
	children: ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
	return (
		<Flex
			minH="100vh"
			bg="bg.subtle"
			align="center"
			justify="center"
			backgroundColor="#004B85"
		>	
			<Stack>
				<Heading size="6xl" color="#fff" mb={2} alignSelf={"center"}>
					USM Community
				</Heading>
				<Container maxW="md">
					<Box
						bg="bg.surface"
						p={8}
						borderRadius="xl"
						boxShadow="lg"
						backgroundColor={"#fff"}
					>
						<Heading size="lg" mb={2}>
							{title}
						</Heading>
						{subtitle && (
							<Text mb={6} color="fg.muted">
								{subtitle}
							</Text>
						)}
						{children}
					</Box>
				</Container>
			</Stack>
		</Flex>
	);
}