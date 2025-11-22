import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";

type RegisterResponse = {
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

export default function RegisterScreen() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("خطأ", "كلمتا المرور غير متطابقتين");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post<RegisterResponse>("/api/auth/register", {
        name,
        email,
        phone,
        password,
        confirmPassword,
      });
      await setAuth(response.data.user, response.data.tokens);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("خطأ", "تعذر إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ gap: 12 }}>
          <Text style={styles.title}>أنشئ حسابك</Text>
          <Text style={styles.subtitle}>تمتع بعروض الولاء والتوصيل السريع والمفضلات الشخصية.</Text>
        </View>
        <View style={styles.form}>
          <Input label="الاسم الكامل" value={name} onChangeText={setName} />
          <Input label="البريد الإلكتروني" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Input label="رقم الجوال" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label="كلمة المرور" value={password} onChangeText={setPassword} secureTextEntry />
          <Input label="تأكيد كلمة المرور" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister} disabled={loading}>
            <Text style={styles.primaryButtonText}>{loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.linkText}>لديك حساب بالفعل؟ تسجيل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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