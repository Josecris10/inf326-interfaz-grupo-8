// src/pages/RegisterPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import {
	Button,
	Field,
	Input,
	Link as ChakraLink,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";

export default function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: llamada a tu API de registro
		console.log({ name, email, password });
	};

	return (
		<AuthLayout
			title="Crear cuenta"
			subtitle="Regístrate para empezar a usar la plataforma."
		>
			<form onSubmit={handleSubmit}>
				<Stack gap={4}>
					<Field.Root>
						<Field.Label>Nombre</Field.Label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Tu nombre"
							required
						/>
					</Field.Root>

					<Field.Root>
						<Field.Label>Email</Field.Label>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="tu@correo.com"
							required
						/>
					</Field.Root>

					<Field.Root>
						<Field.Label>Contraseña</Field.Label>
						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="********"
							required
						/>
					</Field.Root>

					<Button
						type="submit"
						bg="#008452"
						color="#fff"
						_hover={{
							bg: "#fff",
							color: "#008452",
						}}
					>
						Registrarme
					</Button>

					<Text fontSize="sm" color="fg.muted">
						¿Ya tienes cuenta?{" "}
						<ChakraLink asChild>
							<RouterLink to="/login">
								Inicia sesión
							</RouterLink>
						</ChakraLink>
					</Text>
				</Stack>
			</form>
		</AuthLayout>
	);
}