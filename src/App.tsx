import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ChannelPage from "./pages/ChannelPage";
import ThreadPage from "./pages/ThreadPage";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/home" element={<HomePage />} />
			<Route path="/channels/:id" element={<ChannelPage />} />
			<Route path="/threads/:id" element={<ThreadPage />} />
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
}

export default App;