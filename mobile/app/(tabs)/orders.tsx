import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/utils/format";

function formatDate(value: string) {
  return new Date(value).toLocaleString("ar-SA");
}

function formatEta(eta?: number | null) {
  if (!eta) return "30 دقيقة";
  if (eta < 60) return `${eta} دقيقة`;
  const hours = Math.floor(eta / 60);
  const minutes = eta % 60;
  return minutes ? `${hours} ساعة ${minutes} دقيقة` : `${hours} ساعة`;
}

export default function OrdersScreen() {
  const { data, isLoading } = useOrders();

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
        data={data}
        keyExtractor={(order) => order.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>طلب {item.id.slice(-6)}</Text>
              <Text style={styles.orderStatus}>{item.status}</Text>
            </View>
            <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
            <View style={styles.itemsList}>
              {item.items.map((orderItem) => (
                <View key={orderItem.id} style={styles.orderItemRow}>
                  <Text style={styles.orderItemName}>
                    {orderItem.menuItem.name}
                    <Text style={styles.orderItemQty}> ×{orderItem.quantity}</Text>
                  </Text>
                  <Text style={styles.orderItemPrice}>
                    {formatCurrency(orderItem.unitPrice * orderItem.quantity)}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.orderEta}>التسليم: {formatEta(item.etaMinutes)}</Text>
              <Text style={styles.orderTotal}>{formatCurrency(item.total)}</Text>
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
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  orderStatus: {
    fontSize: 12,
    color: "#ef7c0a",
    backgroundColor: "#fde8d1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  orderDate: {
    fontSize: 12,
    color: "#777",
  },
  itemsList: {
    gap: 8,
  },
  orderItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderItemName: {
    fontSize: 14,
    color: "#333",
  },
  orderItemQty: {
    color: "#999",
    fontSize: 12,
  },
  orderItemPrice: {
    fontSize: 14,
    color: "#1f1f1f",
    fontWeight: "600",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  orderEta: {
    fontSize: 12,
    color: "#666",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ef7c0a",
  },
});