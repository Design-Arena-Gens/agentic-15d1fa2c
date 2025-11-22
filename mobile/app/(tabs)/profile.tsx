import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/lib/auth";
import { api } from "@/lib/api";
import { formatCurrency, maskPhone } from "@/utils/format";

export default function ProfileScreen() {
  const { data, isLoading, refetch } = useProfile();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [deliveryInstructions, setDeliveryInstructions] = useState(data?.deliveryInstructions ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.patch("/api/profile", { name, email, deliveryInstructions });
      const tokens = useAuthStore.getState().tokens;
      if (tokens) {
        await useAuthStore
          .getState()
          .setAuth({ id: data.id, name, email, phone: data.phone, image: data.image ?? null }, tokens);
      }
      await refetch();
    } catch (error) {
      Alert.alert("خطأ", "تعذر تحديث الملف الشخصي");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("حذف الحساب", "هل أنت متأكد من حذف حسابك؟", [
      { text: "إلغاء" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          await api.delete("/api/profile");
          await logout();
        },
      },
    ]);
  };

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>جاري تحميل الملف الشخصي...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: data.image || "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=400" }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{data.name}</Text>
              <Text style={styles.profileEmail}>{data.email}</Text>
              <Text style={styles.profilePhone}>{maskPhone(data.phone)}</Text>
            </View>
          </View>
          <View style={{ gap: 12 }}>
            <Input label="الاسم الكامل" value={name} onChangeText={setName} />
            <Input label="البريد الإلكتروني" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <Input
              label="تعليمات التوصيل"
              value={deliveryInstructions}
              onChangeText={setDeliveryInstructions}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>عناوين التوصيل</Text>
          <View style={{ gap: 12 }}>
            {data.addresses.map((address) => (
              <View key={address.id} style={styles.addressCard}>
                <Text style={styles.addressLabel}>{address.label}</Text>
                <Text style={styles.addressLine}>{address.street}</Text>
                <Text style={styles.addressMuted}>
                  {address.city} - {address.region}
                </Text>
                {address.isDefault ? <Text style={styles.addressDefault}>العنوان الافتراضي</Text> : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>الولاء والرصيد</Text>
          <View style={styles.loyaltyRow}>
            <Text style={styles.loyaltyLabel}>رصيد النقاط</Text>
            <Text style={styles.loyaltyValue}>1,240 نقطة</Text>
          </View>
          <View style={styles.loyaltyRow}>
            <Text style={styles.loyaltyLabel}>رصيد المحفظة</Text>
            <Text style={styles.loyaltyValue}>{formatCurrency(85)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>حذف الحساب</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Input({ label, ...props }: TextInput['props'] & { label: string }) {
  return (
    <View style={{ gap: 6 }}> 
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        placeholderTextColor="#999"
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f0ea",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f0ea",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  profileEmail: {
    fontSize: 13,
    color: "#555",
  },
  profilePhone: {
    fontSize: 12,
    color: "#888",
  },
  inputLabel: {
    fontSize: 13,
    color: "#555",
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e2dd",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1f1f1f",
    backgroundColor: "#faf8f5",
  },
  saveButton: {
    backgroundColor: "#ef7c0a",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  addressCard: {
    backgroundColor: "#f8f5f0",
    borderRadius: 18,
    padding: 14,
    gap: 4,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f1f1f",
  },
  addressLine: {
    fontSize: 12,
    color: "#555",
  },
  addressMuted: {
    fontSize: 11,
    color: "#888",
  },
  addressDefault: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#fde8d1",
    color: "#ef7c0a",
    fontSize: 11,
  },
  loyaltyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  loyaltyLabel: {
    fontSize: 13,
    color: "#555",
  },
  loyaltyValue: {
    fontSize: 14,
    color: "#ef7c0a",
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#ef7c0a",
    fontWeight: "700",
  },
  deleteButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff8474",
  },
  deleteText: {
    color: "#d93d3d",
    fontWeight: "700",
  },
});