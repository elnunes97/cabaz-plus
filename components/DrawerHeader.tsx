import {
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useUser } from "../app/providers/UserProvider";

export default function DrawerHeader() {
  const { profile } = useUser();

  return (
    <View style={styles.container}>
      <Image
        source={
          profile?.photoURL
            ? {
                uri: profile.photoURL,
              }
            : require("../app/img/cabaz.png")
        }
        style={styles.avatar}
      />

      <Text style={styles.name}>
        {profile?.fullName ??
          "Utilizador"}
      </Text>

      <Text style={styles.email}>
        {profile?.email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 25,
    alignItems: "center",
    backgroundColor: "#F0C838",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eee",
  },

  name: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },

  email: {
    marginTop: 3,
    color: "#555",
    fontSize: 13,
  },
});