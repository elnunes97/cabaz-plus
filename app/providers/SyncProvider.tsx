import {
    ReactNode,
    useEffect,
    useRef,
} from "react";

import { useUser } from "./UserProvider";

import {
    listenCart,
    saveCart,
} from "../../services/cartService";

import { useCartStore } from "../../src/store/cartStore";

export function SyncProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();

  const items = useCartStore(
    (state) => state.items
  );

  const lastUpdate =
    useCartStore(
      (state) => state.lastUpdate
    );

  const unsubscribe =
    useRef<(() => void) | null>(
      null
    );

  useEffect(() => {
    if (!user) {
      unsubscribe.current?.();
      unsubscribe.current = null;
      return;
    }

    unsubscribe.current?.();

    unsubscribe.current =
      listenCart(user.uid);

    return () => {
      unsubscribe.current?.();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (lastUpdate !== "local")
      return;

    saveCart(user.uid);
  }, [
    items,
    lastUpdate,
    user,
  ]);

  return <>{children}</>;
}