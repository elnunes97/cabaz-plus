import { Stack } from "expo-router";

import { FavoriteProvider } from "./providers/FavoriteProvider";
import { SyncProvider } from "./providers/SyncProvider";
import { UserProvider } from "./providers/UserProvider";

export default function RootLayout() {
  return (
    <UserProvider>
      <SyncProvider>
        <FavoriteProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </FavoriteProvider>
      </SyncProvider>
    </UserProvider>
  );
}