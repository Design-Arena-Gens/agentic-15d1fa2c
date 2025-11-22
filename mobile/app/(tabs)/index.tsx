import { useMemo } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useHomeData } from "@/hooks/useHome";
import { useCartStore } from "@/store/cart-store";
import { HomePayload } from "@/types/api";

const fallbackImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800";

function SectionHeader({ title, cta }: { title: string; cta?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {cta ? <Text style={styles.sectionCta}>{cta}</Text> : null}
    </View>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(value);
}

export default function HomeScreen() {
  const { data, isLoading } = useHomeData();
  const addItem = useCartStore((state) => state.addItem);

  const categories = useMemo(() => data?.menu ?? [], [data]);

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#ef7c0a" />
      </SafeAreaView>
    );
  }

  const handleAdd = (item: HomePayload["menu"][number]["items"][number]) => {
    addItem({ id: item.id, name: item.name, price: item.price, quantity: 1, imageUrl: item.imageUrl ?? undefined });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={{ flex: 1, gap: 12 }}>
            <Text style={styles.heroBadge}>عروض مميزة</Text>
            <Text style={styles.heroTitle}>حلو ومالح يقدم لك نكهات سعودية بلمسة عالمية</Text>
            <Text style={styles.heroSubtitle}>خصم 25% على أول طلب لك مع التوصيل خلال 30 دقيقة فقط.</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatBox}>
                <Text style={styles.heroStatNumber}>+120</Text>
                <Text style={styles.heroStatLabel}>طبق يومي</Text>
              </View>
              <View style={styles.heroStatBox}>
                <Text style={styles.heroStatNumber}>4.9</Text>
                <Text style={styles.heroStatLabel}>تقييم العملاء</Text>
              </View>
              <View style={styles.heroStatBox}>
                <Text style={styles.heroStatNumber}>24/7</Text>
                <Text style={styles.heroStatLabel}>دعم مباشر</Text>
              </View>
            </View>
          </View>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800" }}
            style={styles.heroImage}
          />
        </View>

        <SectionHeader title="التصنيفات" cta="عرض الكل" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <Image source={{ uri: category.heroImage ?? fallbackImage }} style={styles.categoryImage} />
              <Text style={styles.categoryTitle}>{category.name}</Text>
              <Text style={styles.categorySubtitle}>{category.description}</Text>
            </View>
          ))}
        </ScrollView>

        <SectionHeader title="الأكثر طلباً" />
        <FlatList
          data={data.mostOrdered}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => (
            <View style={styles.dishCard}>
              <Image source={{ uri: item.imageUrl ?? fallbackImage }} style={styles.dishImage} />
              <Text style={styles.dishTitle}>{item.name}</Text>
              <Text numberOfLines={2} style={styles.dishDesc}>
                {item.description}
              </Text>
              <View style={styles.dishFooter}>
                <Text style={styles.dishPrice}>{formatCurrency(item.price)}</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => handleAdd(item as any)}>
                  <Feather name="plus" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <SectionHeader title="العروض" />
        {data.offers.map((offer) => (
          <View key={offer.id} style={styles.offerCard}>
            <View style={{ gap: 6 }}>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDesc}>{offer.description}</Text>
              <Text style={styles.offerDate}>حتى {new Date(offer.endsAt).toLocaleDateString("ar-SA")}</Text>
            </View>
            <Image source={{ uri: offer.imageUrl ?? fallbackImage }} style={styles.offerImage} />
          </View>
        ))}

        <SectionHeader title="توصيات الذكاء الاصطناعي" />
        <View style={styles.recommendationsGrid}>
          {data.recommended.map((item) => (
            <View key={item.id} style={styles.recommendationCard}>
              <Image source={{ uri: item.imageUrl ?? fallbackImage }} style={styles.recommendationImage} />
              <Text style={styles.recommendationTitle}>{item.name}</Text>
              <Text style={styles.recommendationContext}>{item.context}</Text>
              <View style={styles.dishFooter}>
                <Text style={styles.dishPrice}>{formatCurrency(item.price)}</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => handleAdd(item as any)}>
                  <Feather name="heart" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: 16,
    gap: 24,
  },
  heroCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 28,
    padding: 20,
    gap: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#fde8d1",
    color: "#ef7c0a",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  heroSubtitle: {
    color: "#6b6b6b",
    fontSize: 14,
    lineHeight: 20,
  },
  heroStats: {
    flexDirection: "row",
    gap: 12,
  },
  heroStatBox: {
    backgroundColor: "#fff7ef",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 70,
  },
  heroStatNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ef7c0a",
  },
  heroStatLabel: {
    fontSize: 10,
    color: "#6b6b6b",
  },
  heroImage: {
    width: 140,
    height: 160,
    borderRadius: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  sectionCta: {
    fontSize: 13,
    color: "#ef7c0a",
  },
  categoryRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: 140,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  categoryImage: {
    width: "100%",
    height: 90,
    borderRadius: 18,
  },
  categoryTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#1f1f1f",
  },
  categorySubtitle: {
    fontSize: 11,
    color: "#6b6b6b",
  },
  dishCard: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 14,
    marginHorizontal: 8,
    gap: 10,
  },
  dishImage: {
    width: "100%",
    height: 120,
    borderRadius: 20,
  },
  dishTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f1f1f",
  },
  dishDesc: {
    fontSize: 12,
    color: "#6b6b6b",
  },
  dishFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ef7c0a",
  },
  addButton: {
    backgroundColor: "#ef7c0a",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  offerCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ef7c0a",
  },
  offerDesc: {
    fontSize: 13,
    color: "#555",
  },
  offerDate: {
    fontSize: 11,
    color: "#888",
  },
  offerImage: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },
  recommendationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 12,
  },
  recommendationCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    gap: 8,
  },
  recommendationImage: {
    width: "100%",
    height: 110,
    borderRadius: 18,
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f1f1f",
  },
  recommendationContext: {
    fontSize: 12,
    color: "#6b6b6b",
  },
});
