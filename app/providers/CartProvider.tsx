import { useEffect } from "react";

import { saveCart } from "../../services/cartService";
import { useCartStore } from "../../src/store/cartStore";
import { useUser } from "./UserProvider";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  const items = useCartStore(
    (state) => state.items
  );

  useEffect(() => {
    if (!user) return;

    saveCart(user.uid);
  }, [items, user]);

  return <>{children}</>;
}