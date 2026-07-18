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

import { useCartStore } from "../../store/cartStore";
import { useFavoriteStore } from "../../store/favoriteStore";

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

  const toggleFavorite = useFavoriteStore(
    (state) => state.toggleFavorite
  );

  const isFavorite = useFavoriteStore(
    (state) => state.isFavorite
  );

  return (
    <View
      style={[
        styles.card,
        {
          width,
        },
      ]}
    >
      {/* FAVORITO */}
      <TouchableOpacity
        style={styles.favorite}
        onPress={() =>
          toggleFavorite({
            id: product.id,
            nome: product.nome,
            preco: Number(product.preco),
            imagem: product.imagem,
          })
        }
      >
        <Ionicons
          name={
            isFavorite(product.id)
              ? "heart"
              : "heart-outline"
          }
          size={22}
          color={
            isFavorite(product.id)
              ? "#ff3b30"
              : "#555"
          }
        />
      </TouchableOpacity>

      {/* IMAGEM */}
      <TouchableOpacity
        onPress={() =>
          router.push(`/product/${product.id}`)
        }
      >
        <Image
          source={{
            uri:
              product.imagem ||
              "https://via.placeholder.com/300",
          }}
          style={styles.image}
        />

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
      </TouchableOpacity>

      {/* ADICIONAR */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          addToCart(
            {
              id: product.id,
              nome: product.nome,
              preco: Number(product.preco),
              imagem: product.imagem,
            },
            1
          )
        }
      >
        <Text style={styles.buttonText}>
          Adicionar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 10,
    marginBottom: 15,
  },

  favorite: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,.95)",
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
  },

  name: {
    fontWeight: "600",
    marginTop: 10,
  },

  category: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },

  price: {
    marginTop: 5,
    color: "#c78200",
    fontWeight: "bold",
    fontSize: 16,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#F0C838",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "bold",
    color: "#111",
  },
});