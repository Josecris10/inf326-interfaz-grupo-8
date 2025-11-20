const TOKEN_KEY = "authToken";
const TOKEN_TYPE = "bearer";
const USER_ID = "id";
const EMAIL = "email@example.com";
const USERNAME = "username";
const FULL_NAME = "full_name";

//========== AuthToken ==========
export function getAuthToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
	localStorage.removeItem(TOKEN_KEY);
}

//========== Token Type ==========
export function getTokenType(): string | null {
	return localStorage.getItem(TOKEN_TYPE);
}

export function setTokenType(token_type: string): void {
	localStorage.setItem(TOKEN_TYPE, token_type);
}

export function removeTokenType(): void {
	localStorage.removeItem(TOKEN_TYPE);
}

//========== User ID ==========
export function getUserID(): string | null {
	return localStorage.getItem(USER_ID);
}

export function setUserID(user_id: string): void {
	localStorage.setItem(USER_ID, user_id);
}

export function removeUserID(): void {
	localStorage.removeItem(USER_ID);
}

//========== Email ==========
export function getEmail(): string | null {
	return localStorage.getItem(EMAIL);
}

export function setEmail(email: string): void {
	localStorage.setItem(EMAIL, email);
}

export function removeEmail(): void {
	localStorage.removeItem(EMAIL);
}

//========== Username ==========
export function getUsername(): string | null {
	return localStorage.getItem(USERNAME);
}

export function setUsername(username: string): void {
	localStorage.setItem(USERNAME, username);
}

export function removeUsername(): void {
	localStorage.removeItem(USERNAME);
}

//========== Full name ==========
export function getFullName(): string | null {
	return localStorage.getItem(FULL_NAME);
}

export function setFullName(full_name: string): void {
	localStorage.setItem(FULL_NAME, full_name);
}

export function removeFullName(): void {
	localStorage.removeItem(FULL_NAME);
}