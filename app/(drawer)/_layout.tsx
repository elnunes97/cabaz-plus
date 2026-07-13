import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: '#F0C838',
        },

        headerTintColor: '#000',

        drawerActiveTintColor: '#c78200',

        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
        },
      }}
    >
      <Drawer.Screen
  name="home"
  options={{
    title: 'Início',
    headerShown: false,
  }}
/>
    </Drawer>
  );
}