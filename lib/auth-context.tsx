import { createContext, useContext, useEffect, useState } from "react";
import { ID, type Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
	user: Models.User<Models.Preferences> | null;
	isLoadingUser: boolean;
	signUp: (email: string, password: string) => Promise<string | null>;
	signIn: (email: string, password: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
	const [isLoadingUser, setIsLoadingUser] = useState(true);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const session = await account.get();
            setUser(session);
        } catch (_) {
            setUser(null);
        } finally {
			setIsLoadingUser(false);
		}
    }

	const signUp = async (email: string, password: string) => {
		try {
			await account.create(ID.unique(), email, password);
			await signIn(email, password);
			return null;
		} catch (error) {
			if (error instanceof Error) {
				return error.message;
			}
			return "An unknown error occurred.";
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			await account.createEmailPasswordSession(email, password);
			return null;
		} catch (error) {
			if (error instanceof Error) {
				return error.message;
			}
			return "An unknown error occurred.";
		}
	};

	return (
		<AuthContext.Provider value={{ user, isLoadingUser, signUp, signIn }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
