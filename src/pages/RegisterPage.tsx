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
import { createUser } from "@/services/users_service";

export default function RegisterPage() {
	const [username, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [full_name, setFull_name] = useState("");

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const Res = await createUser({
				email,
				username,
				password,
				full_name
			})
			alert("✅ Usuario registrado correctamente");
		} catch (error) {
			console.log(error);
			alert("Ocurrió un error inesperado, intente más tarde");
		}
	};

	return (
		<AuthLayout
			title="Crear cuenta"
			subtitle="Regístrate para empezar a usar la plataforma."
		>
			<form onSubmit={handleSubmit}>
				<Stack gap={4}>
					<Field.Root>
						<Field.Label>Nombre de usuario <span color="#f00">(*)</span></Field.Label>
						<Input
							value={username}
							onChange={(e) => setName(e.target.value)}
							placeholder="Tu nombre de usuario"
							required
						/>
					</Field.Root>

					<Field.Root>
						<Field.Label>Email <span color="#f00">(*)</span></Field.Label>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="tu@correo.com"
							required
						/>
					</Field.Root>

					<Field.Root>
						<Field.Label>Contraseña (longitud de al menos 8 caracteres)<span color="#f00">(*)</span></Field.Label>
						<Input
							type="password"
							value={password}
							minLength={8}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="********"
							required
						/>
					</Field.Root>

					<Field.Root>
						<Field.Label>Nombre completo</Field.Label>
						<Input
							value={full_name}
							onChange={(e) => setFull_name(e.target.value)}
							placeholder="Nombres y Apellidos"
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