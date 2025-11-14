import type { Channel } from "@/types/channel";

export const MOCK_CHANNELS: Channel[] = [
	{
		id: 1,
		name: "INF326 - Interfaz Grupo 8",
		owner_id: 1,
		users: [
			{ id: 1, joined_at: Date.now() - 1000 * 60 * 60 * 24 * 5 },
			{ id: 2, joined_at: Date.now() - 1000 * 60 * 60 * 24 * 4 },
			{ id: 3, joined_at: Date.now() - 1000 * 60 * 60 * 24 * 1 },
		],
		threads: ["thr-001", "thr-002", "thr-003"],
		is_active: true,
		channel_type: "public",
		created_at: Date.now() - 1000 * 60 * 60 * 24 * 10,
		updated_at: Date.now() - 1000 * 60 * 5,
		deleted_at: null,
	},

	{
		id: 2,
		name: "Frontend & UI",
		owner_id: 10,
		users: [
			{ id: 10, joined_at: Date.now() - 1000 * 60 * 60 * 24 * 30 },
			{ id: 14, joined_at: Date.now() - 1000 * 60 * 60 * 24 * 12 },
			{ id: 15, joined_at: Date.now() - 1000 * 60 * 60 * 24 * 2 },
			{ id: 20, joined_at: Date.now() - 1000 * 60 * 20 },
		],
		threads: ["thr-010", "thr-011"],
		is_active: true,
		channel_type: "public",
		created_at: Date.now() - 1000 * 60 * 60 * 24 * 40,
		updated_at: Date.now() - 1000 * 60 * 30,
		deleted_at: null,
	},

	{
		id: 3,
		name: "Backend & APIs",
		owner_id: 20,
		users: [
			{ id: 20, joined_at: Date.now() - 1000 * 60 * 60 * 24 * 6 },
			{ id: 22, joined_at: Date.now() - 1000 * 60 * 60 * 6 },
		],
		threads: ["thr-020"],
		is_active: true,
		channel_type: "private",
		created_at: Date.now() - 1000 * 60 * 60 * 24 * 90,
		updated_at: Date.now() - 1000 * 60 * 60,
		deleted_at: null,
	},

	{
		id: 4,
		name: "Off-topic / Random",
		owner_id: 30,
		users: [
			{ id: 30, joined_at: Date.now() - 1000 * 60 * 60 * 24 * 1 },
			{ id: 31, joined_at: Date.now() - 1000 * 60 * 15 },
			{ id: 32, joined_at: Date.now() - 1000 * 60 * 10 },
			{ id: 33, joined_at: Date.now() - 1000 * 60 * 5 },
		],
		threads: [],
		is_active: true,
		channel_type: "public",
		created_at: Date.now() - 1000 * 60 * 60 * 24 * 3,
		updated_at: Date.now() - 1000 * 60 * 2,
		deleted_at: null,
	},
];