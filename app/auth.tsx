import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

export default function AuthScreen() {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <View>
                <Text>Create an Account</Text>
            </View>
        </KeyboardAvoidingView>
    )
}