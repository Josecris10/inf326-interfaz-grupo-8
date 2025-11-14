// src/pages/LoginPage.tsx
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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: llamada a tu API de login
		console.log({ email, password });
		navigate("/home");
	};

	return (
		<AuthLayout
			title="Iniciar sesión"
			subtitle="Ingresa tus credenciales para acceder."
		>
			<form onSubmit={handleSubmit}>
				<Stack gap={4}>
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

					<Button type="submit">
						Entrar
					</Button>

					<Text fontSize="sm" color="fg.muted">
						¿No tienes cuenta?{" "}
						<ChakraLink asChild>
							<RouterLink to="/register">
								Regístrate aquí
							</RouterLink>
						</ChakraLink>
					</Text>
				</Stack>
			</form>
		</AuthLayout>
	);
}