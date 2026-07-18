import React from "react";
import { Image, StyleSheet } from "react-native";

export default function HomeBanner() {
  return (
    <Image
      source={require("../../../app/img/BANNER.png")}
      style={styles.banner}
    />
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 15,
  },
});