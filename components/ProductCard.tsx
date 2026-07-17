import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useCartStore } from "../src/store/cartStore";
import { useFavoriteStore } from "../src/store/favoriteStore";

type Product = {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  categoria?: string;
};

type Props = {
  product: Product;
  width: number;
};

export default function ProductCard({
  product,
  width,
}: Props) {
  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  const favorites = useFavoriteStore(
    (state) => state.favorites
  );

  const toggleFavorite =
    useFavoriteStore(
      (state) => state.toggleFavorite
    );

  const isFavorite = favorites.some(
    (item) => item.id === product.id
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          width,
        },
      ]}
      onPress={() =>
        router.push(`/product/${product.id}`)
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: product.imagem,
          }}
          style={styles.image}
        />

        <TouchableOpacity
          style={styles.favorite}
          onPress={() =>
            toggleFavorite(product)
          }
        >
          <Ionicons
            name={
              isFavorite
                ? "heart"
                : "heart-outline"
            }
            size={20}
            color={
              isFavorite
                ? "#ff3b30"
                : "#555"
            }
          />
        </TouchableOpacity>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            NOVO
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={1}
        style={styles.name}
      >
        {product.nome}
      </Text>

      <Text style={styles.category}>
        {product.categoria}
      </Text>

      <Text style={styles.price}>
        {Number(product.preco).toLocaleString()} FCFA
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          addToCart(
            {
              id: product.id,
              nome: product.nome,
              preco: product.preco,
              imagem: product.imagem,
            },
            1
          )
        }
      >
        <Ionicons
          name="cart"
          size={18}
          color="#111"
        />

        <Text style={styles.buttonText}>
          Adicionar
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 10,
    marginBottom: 15,
    elevation: 4,
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 150,
    borderRadius: 14,
  },

  favorite: {
    position: "absolute",
    right: 8,
    top: 8,
    backgroundColor: "#FFF",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    left: 8,
    top: 8,
    backgroundColor: "#F0C838",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  badgeText: {
    fontWeight: "bold",
    fontSize: 11,
  },

  name: {
    marginTop: 10,
    fontWeight: "700",
    fontSize: 15,
  },

  category: {
    color: "#777",
    fontSize: 12,
    marginTop: 3,
  },

  price: {
    color: "#c78200",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 8,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#F0C838",
    borderRadius: 12,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    marginLeft: 8,
    fontWeight: "700",
  },
});