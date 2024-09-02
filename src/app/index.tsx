import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
}

const SignUpScreen: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});

    const handleInputChange = (name: keyof FormData, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let newErrors: Partial<FormData> = {};
        if (!formData.email)
            newErrors.email = "メールアドレスを入力してください";
        if (!formData.password)
            newErrors.password = "パスワードを入力してください";
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "パスワードが一致しません";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                console.log("フォームデータ:", formData);
                // IPアドレスはご自分のPCのものに置き換えてください
                const response = await fetch(
                    "http://192.168.68.107:3000/send-email",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: formData.email,
                            subject: "ユーザー登録完了のお知らせ",
                            message: "ご登録いただきありがとうございます！",
                        }),
                    }
                );

                if (response.ok) {
                    Alert.alert("成功", "確認メールが送信されました");
                    setFormData({
                        email: "",
                        password: "",
                        confirmPassword: "",
                    }); // フォームをリセット
                } else {
                    Alert.alert("エラー", "メール送信に失敗しました");
                    console.error("リクエスト失敗:", response.status);
                }
            } catch (error) {
                console.error("サーバーエラーが発生しました:", error);
                Alert.alert("エラー", "サーバーエラーが発生しました");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>アカウントを作成</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="メールアドレス"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                />
                {errors.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="パスワード"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(value) =>
                        handleInputChange("password", value)
                    }
                />
                {errors.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="パスワード（確認用）"
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(value) =>
                        handleInputChange("confirmPassword", value)
                    }
                />
                {errors.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>登録する</Text>
            </TouchableOpacity>
            <Text style={styles.loginLink}>
                既にアカウントをお持ちですか？{" "}
                <Text style={styles.loginLinkText}>ログイン</Text>
            </Text>
        </View>
    );
};

// スタイル設定
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 5,
    },
    error: {
        color: "red",
        marginTop: 4,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 16,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    loginLink: {
        textAlign: "center",
        marginTop: 20,
    },
    loginLinkText: {
        color: "#007bff",
        fontWeight: "bold",
    },
});

export default SignUpScreen;
