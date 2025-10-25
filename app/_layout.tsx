import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function RouteGuard({ children }: { children: React.ReactNode }) {
	// const session = false;
	// const [loading, setLoading] = useState(true);
	// useEffect(() => {
	//   setTimeout(() => {
	//     setLoading(false);
	//   }, 1000);
	// });
	// if (loading) {
	//   return (
	//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
	//       <ActivityIndicator size="large" color="#0000ff" />
	//     </View>
	//   );
	// } else {
	//   return (
	//     <>
	//       {session ? (
	//         {children}
	//       ) : (
	//         <Redirect href="/auth" />
	//       )}
	//     </>
	//   );
	// }
	// return <>{children}</>;

	const router = useRouter();
	const { user, isLoadingUser } = useAuth();
	const segments = useSegments();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const isAuthGroup = segments[0] === "auth";
		if (!user && !isAuthGroup && !isLoadingUser) {
			router.replace("/auth");
		} else if (user && isAuthGroup && !isLoadingUser) {
			router.replace("/");
		}
	}, [user, segments]);

	return <>{children}</>;
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<RouteGuard>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				</Stack>
			</RouteGuard>
		</AuthProvider>
	);
}
