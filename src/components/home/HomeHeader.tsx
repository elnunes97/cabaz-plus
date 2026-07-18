import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

import { useCartStore } from "../../store/cartStore";
import { useFavoriteStore } from "../../store/favoriteStore";

type Props = {
  search: string;
  setSearch: (text: string) => void;
};

export default function HomeHeader({
  search,
  setSearch,
}: Props) {
  const navigation = useNavigation();

  const totalItems = useCartStore((state) =>
    state.getTotalItems()
  );
  const totalFavorites = useFavoriteStore(
  (state) => state.items.length
);

  return (
    <View style={styles.header}>
      {/* Menu */}
      <TouchableOpacity
        onPress={() =>
          navigation.dispatch(
            DrawerActions.openDrawer()
          )
        }
      >
        <Ionicons
          name="menu"
          size={28}
          color="#111"
        />
      </TouchableOpacity>

      {/* Logo */}
      <TouchableOpacity
        onPress={() => router.push("/home")}
      >
        <Image
          source={require("../../../app/img/cabaz.png")}
          style={styles.logo}
        />
      </TouchableOpacity>

      {/* Pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#999"
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Favoritos */}
      <TouchableOpacity
  style={styles.iconButton}
  onPress={() =>
    router.push("/favorites")
  }
>
  <Ionicons
    name="heart-outline"
    size={24}
    color="#111"
  />

  {totalFavorites > 0 && (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {totalFavorites}
      </Text>
    </View>
  )}
</TouchableOpacity>

      {/* Carrinho */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/cart")}
      >
        <Ionicons
          name="cart-outline"
          size={24}
          color="#111"
        />

        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {totalItems}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F0C838",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  logo: {
    width: 50,
    height: 45,
    marginHorizontal: 8,
  },

  searchContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 40,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },

  iconButton: {
    marginLeft: 10,
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});