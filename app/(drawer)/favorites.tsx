import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCartStore } from "../../src/store/cartStore";
import { useFavoriteStore } from "../../src/store/favoriteStore";

export default function FavoritesScreen() {
  const favorites = useFavoriteStore((state) => state.items);

  const removeFavorite = useFavoriteStore(
    (state) => state.removeFavorite
  );

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111"
          />
        </TouchableOpacity>

        <View style={styles.empty}>
          <Ionicons
            name="heart-outline"
            size={70}
            color="#999"
          />

          <Text style={styles.emptyTitle}>
            Nenhum favorito
          </Text>

          <Text style={styles.emptySub}>
            Adicione produtos aos favoritos.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.back}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#111"
        />
      </TouchableOpacity>

      <Text style={styles.title}>
        Favoritos
      </Text>

      {favorites.map((item) => (
        <View
          key={item.id}
          style={styles.card}
        >
          <TouchableOpacity
            onPress={() =>
              router.push(`/product/${item.id}`)
            }
            style={styles.info}
          >
            <Image
              source={{ uri: item.imagem }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {item.nome}
              </Text>

              <Text style={styles.price}>
                {item.preco.toLocaleString()} FCFA
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() =>
                addToCart(item, 1)
              }
            >
              <Ionicons
                name="cart"
                size={24}
                color="#F0C838"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                removeFavorite(item.id)
              }
            >
              <Ionicons
                name="heart"
                size={24}
                color="#ff3b30"
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    padding: 15,
  },

  back: {
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },

  emptySub: {
    color: "#777",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  info: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
  },

  price: {
    marginTop: 5,
    color: "#c78200",
    fontWeight: "bold",
  },

  buttons: {
    gap: 15,
    alignItems: "center",
  },
});