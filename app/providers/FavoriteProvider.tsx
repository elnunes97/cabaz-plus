import {
    ReactNode,
    useEffect,
    useRef,
} from "react";

import { useUser } from "./UserProvider";

import {
    listenFavorites,
    saveFavorites,
} from "../../services/favoriteService";

import { useFavoriteStore } from "../../src/store/favoriteStore";

export function FavoriteProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();

  const items = useFavoriteStore(
    (state) => state.items
  );

  const lastUpdate = useFavoriteStore(
    (state) => state.lastUpdate
  );

  const unsubscribe =
    useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!user) {
      unsubscribe.current?.();
      unsubscribe.current = null;
      return;
    }

    unsubscribe.current?.();

    unsubscribe.current =
      listenFavorites(user.uid);

    return () => {
      unsubscribe.current?.();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (lastUpdate !== "local")
      return;

    saveFavorites(user.uid);
  }, [
    items,
    lastUpdate,
    user,
  ]);

  return <>{children}</>;
}