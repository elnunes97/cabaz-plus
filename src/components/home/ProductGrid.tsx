import React from "react";
import { StyleSheet, View } from "react-native";

import ProductCard from "./ProductCard";

type Props = {
  products: any[];
  cardWidth: number;
};

export default function ProductGrid({
  products,
  cardWidth,
}: Props) {
  return (
    <View style={styles.container}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          width={cardWidth}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});