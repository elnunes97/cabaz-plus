import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: "#F0C838",
        },

        headerTintColor: "#000",

        drawerActiveTintColor: "#c78200",

        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: "600",
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: "Início",
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="cart"
        options={{
          title: "Carrinho",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="cart-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="heart-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="orders"
        options={{
          title: "Meus Pedidos",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="receipt-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="addresses"
        options={{
          title: "Endereços",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="location-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: "Meu Perfil",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: "Configurações",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="sobrenos"
        options={{
          title: "Sobre nós",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="logout"
        options={{
          title: "sair",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="log-out-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer>
  );
}