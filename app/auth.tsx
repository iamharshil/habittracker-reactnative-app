import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
	const theme = useTheme();
	const router = useRouter();
	const [isSignUp, setIsSignUp] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>("");

	const { signUp, signIn } = useAuth();

	const handleAuth = async () => {
		if (!email || !password) {
			setError("Please fill in all fields.");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long.");
			return;
		}

		setError(null);

		if (isSignUp) {
			const error = await signUp(email, password);
			if (error) {
				setError(error);
				return;
			}
		} else {
			const error = await signIn(email, password);
			if (error) {
				setError(error);
				return;
			}

			router.replace("/");
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<View style={styles.content}>
				<Text style={styles.title} variant="headlineMedium">
					{isSignUp ? "Create an Account" : "Welcome Back"}
				</Text>

				<TextInput
					label="Email"
					placeholder="example@mail.com"
					autoCapitalize="none"
					keyboardType="email-address"
					mode="outlined"
					style={styles.input}
					onChangeText={setEmail}
				/>
				<TextInput
					label="Password"
					placeholder="Enter your password"
					autoCapitalize="none"
					mode="outlined"
					style={styles.input}
					onChangeText={setPassword}
				/>

				{error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

				<Button mode="contained" style={styles.button} onPress={handleAuth}>
					{isSignUp ? "Sign Up" : "Sign In"}
				</Button>
				<Button
					mode="text"
					onPress={() => setIsSignUp(!isSignUp)}
					style={styles.switchModeButton}
				>
					{isSignUp
						? "Already have an account? Sign In"
						: "Don't have an account? Sign Up"}
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
	},
	content: {
		flex: 1,
		padding: 16,
		justifyContent: "center",
	},
	title: {
		textAlign: "center",
		marginBottom: 24,
	},
	input: {
		marginBottom: 16,
	},
	button: {
		marginTop: 8,
	},
	switchModeButton: {
		marginTop: 16,
	},
});
