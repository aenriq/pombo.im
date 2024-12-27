import React, { createContext } from "react";
import { type User } from "firebase/auth";

interface UserContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	username: string;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);
