import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";

type LoginResponse = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export default function LoginScreen() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await api.post<LoginResponse>("/api/auth/login", {
        email,
        password,
        twoFactorCode: twoFactorCode || undefined,
      });
      await setAuth(response.data.user, response.data.tokens);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("خطأ", "تعذر تسجيل الدخول. تحقق من البيانات المدخلة");
    } finally {
      setLoading(false);
    }
  };

  const gotoRegister = () => router.push("/(auth)/register");
  const gotoPhone = () => router.push("/(auth)/otp");
  const gotoForgot = () => router.push("/(auth)/forgot-password");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{ gap: 12 }}>
          <Text style={styles.title}>مرحباً بعودتك</Text>
          <Text style={styles.subtitle}>سجل دخولك لمتابعة الطلبات والاستمتاع بالعروض الحصرية.</Text>
        </View>
        <View style={styles.form}>
          <Input label="البريد الإلكتروني" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input label="كلمة المرور" value={password} onChangeText={setPassword} secureTextEntry />
          <Input label="رمز التحقق الثنائي (اختياري)" value={twoFactorCode} onChangeText={setTwoFactorCode} />
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={gotoPhone}>
            <Text style={styles.linkText}>تسجيل الدخول باستخدام رقم الجوال</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={gotoForgot}>
            <Text style={styles.linkText}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>ليس لديك حساب؟</Text>
          <TouchableOpacity onPress={gotoRegister}>
            <Text style={styles.footerLink}>إنشاء حساب جديد</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Input({ label, ...props }: TextInput["props"] & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor="#9a9590"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f0ea",
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  subtitle: {
    fontSize: 14,
    color: "#5f5a55",
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: "#5f5a55",
  },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#dfd9d2",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1f1f1f",
  },
  primaryButton: {
    backgroundColor: "#ef7c0a",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  linkText: {
    color: "#ef7c0a",
    textAlign: "center",
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    color: "#6b6660",
  },
  footerLink: {
    color: "#ef7c0a",
    fontWeight: "600",
  },
});