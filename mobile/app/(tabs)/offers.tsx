import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useOffers } from "@/hooks/useOffers";
import { formatCurrency } from "@/utils/format";

const fallbackImage = "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800";

export default function OffersScreen() {
  const { data, isLoading } = useOffers();

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#ef7c0a" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={data.offers}
        keyExtractor={(offer) => offer.id}
        renderItem={({ item }) => (
          <View style={styles.offerCard}>
            <Image source={{ uri: item.imageUrl ?? fallbackImage }} style={styles.offerImage} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.offerTitle}>{item.title}</Text>
              <Text style={styles.offerDesc}>{item.description}</Text>
              <Text style={styles.offerDate}>حتى {new Date(item.endsAt).toLocaleDateString("ar-SA")}</Text>
              {item.minimumSpend ? (
                <Text style={styles.offerSpend}>حد أدنى {formatCurrency(item.minimumSpend)}</Text>
              ) : null}
            </View>
          </View>
        )}
      />
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
  listContent: {
    padding: 16,
    gap: 16,
  },
  offerCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    gap: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  offerImage: {
    width: 90,
    height: 90,
    borderRadius: 20,
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
  offerSpend: {
    fontSize: 12,
    color: "#1f1f1f",
  },
});
