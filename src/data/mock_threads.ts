import type { Thread } from "@/types/thread";

export const MOCK_THREADS: Thread[] = [
	{
		id: 1,
		title: "Problema al compilar el proyecto",
		content: "Hola equipo, ¿a alguien más le está fallando Vite al levantar el proyecto con Chakra UI v3?",
		author_id: 101,
		channel_id: 1,
		creation_date: Date.now() - 1000 * 60 * 60 * 4,
		tags: "vite, chakra, build",
		category: "pregunta",
	},
	{
		id: 2,
		title: "Propuesta de nuevo layout",
		content: "Creo que deberíamos mover la navbar a la parte superior fija, al estilo Reddit. ¿Opiniones?",
		author_id: 102,
		channel_id: 1,
		creation_date: Date.now() - 1000 * 60 * 60 * 24,
		tags: "ui, layout, diseño",
		category: "discusión",
	},
	{
		id: 3,
		title: "Guía para integrar FastAPI con el frontend",
		content: "Dejo aquí un mini tutorial para crear endpoints y consumirlos desde React con fetch o axios.",
		author_id: 201,
		channel_id: 2,
		creation_date: Date.now() - 1000 * 60 * 60 * 48,
		tags: "fastapi, frontend, api",
		category: "recurso",
	},
	{
		id: 4,
		title: "Ayuda con Docker",
		content: "No logro que el contenedor del backend reconozca las variables de entorno. ¿Alguien tiene un ejemplo?",
		author_id: 300,
		channel_id: 3,
		creation_date: Date.now() - 1000 * 60 * 30,
		tags: "docker, backend, env",
		category: "ayuda",
	},
	{
		id: 5,
		title: "Memes del proyecto",
		content: "Compartamos memes para sobrevivir esta semana 😅",
		author_id: 400,
		channel_id: 4, // random
		creation_date: Date.now() - 1000 * 60 * 60 * 3,
		tags: "memes, humor",
		category: "off-topic",
	},
];