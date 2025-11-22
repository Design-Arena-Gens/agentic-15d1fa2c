import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { api } from "@/lib/api";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await api.post<{ message: string }>("/api/auth/forgot", { email });
      Alert.alert("تم", response.data.message || "تم إرسال رابط إعادة التعيين");
      router.back();
    } catch (error) {
      Alert.alert("خطأ", "تعذر إرسال رابط إعادة التعيين");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>إعادة تعيين كلمة المرور</Text>
        <Text style={styles.subtitle}>أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.</Text>
        <View style={styles.form}>
          <Input label="البريد الإلكتروني" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? "جاري الإرسال..." : "إرسال الرابط"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>العودة إلى تسجيل الدخول</Text>
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
    fontSize: 24,
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
    marginTop: 8,
    textAlign: "center",
    color: "#ef7c0a",
  },
});