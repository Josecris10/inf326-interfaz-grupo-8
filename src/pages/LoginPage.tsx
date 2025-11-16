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
import { loginUser } from "../services/users_service";
import { setAuthToken } from "../services/storage";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const tokenRes = await loginUser({
				username_or_email: email,
				password
			})
			setAuthToken(tokenRes.access_token)
			navigate("/home");
		} catch (error) {
			console.log(error);
			navigate("/home");
		}
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

					<Button
						type="submit"
						bg="#008452"
						color="#fff"
						_hover={{
							bg: "#fff",
							color: "#008452",
						}}
					>
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