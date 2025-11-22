import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";

type AuthResponse = {
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

export default function PhoneLoginScreen() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  const requestOtp = async () => {
    try {
      setStatus("loading");
      await api.post("/api/auth/phone/request-otp", { phone });
      setStep("verify");
      Alert.alert("تم", "تم إرسال رمز التحقق إلى جوالك");
    } catch (error) {
      Alert.alert("خطأ", "تعذر إرسال الرمز");
    } finally {
      setStatus("idle");
    }
  };

  const verifyOtp = async () => {
    try {
      setStatus("loading");
      const response = await api.post<AuthResponse>("/api/auth/phone/verify", { phone, code });
      await setAuth(response.data.user, response.data.tokens);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("خطأ", "رمز غير صحيح");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>دخول برقم الجوال</Text>
        <Text style={styles.subtitle}>سنرسل لك رمز تحقق مكون من 6 أرقام.</Text>
        {step === "request" ? (
          <View style={styles.form}>
            <Input label="رقم الجوال" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TouchableOpacity style={styles.primaryButton} onPress={requestOtp} disabled={status === "loading"}>
              <Text style={styles.primaryButtonText}>{status === "loading" ? "جاري الإرسال..." : "إرسال الرمز"}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.info}>أدخل الرمز المرسل إلى {phone}</Text>
            <Input
              label="رمز التحقق"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity style={styles.primaryButton} onPress={verifyOtp} disabled={status === "loading"}>
              <Text style={styles.primaryButtonText}>{status === "loading" ? "جاري التحقق..." : "تأكيد الرمز"}</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.linkText}>العودة إلى تسجيل الدخول بالبريد الإلكتروني</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Input({ label, ...props }: TextInput["props"] & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput {...props} style={styles.input} placeholderTextColor="#9a9590" />
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
    gap: 24,
  },
  title: {
    fontSize: 26,
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
  info: {
    fontSize: 13,
    color: "#5f5a55",
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
    fontSize: 16,
    letterSpacing: 4,
    textAlign: "center",
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
    marginTop: 12,
    textAlign: "center",
    color: "#ef7c0a",
  },
});