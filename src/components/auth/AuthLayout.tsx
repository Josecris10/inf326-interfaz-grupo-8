import type { ReactNode } from "react";
import {
	Box,
	Container,
	Flex,
	Heading,
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
		>
			<Container maxW="md">
				<Box
					bg="bg.surface"
					p={8}
					borderRadius="xl"
					boxShadow="lg"
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
		</Flex>
	);
}