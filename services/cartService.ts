import {
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebase";
import { useCartStore } from "../src/store/cartStore";

export function listenCart(uid: string) {
  const ref = doc(db, "users", uid);

  return onSnapshot(ref, (snapshot) => {
    if (!snapshot.exists()) {
      useCartStore
        .getState()
        .setRemoteItems([]);

      return;
    }

    const data = snapshot.data();

    useCartStore
      .getState()
      .setRemoteItems(data.cart ?? []);
  });
}

export async function saveCart(
  uid: string
) {
  const items =
    useCartStore.getState().items;

  await setDoc(
    doc(db, "users", uid),
    {
      cart: items,
    },
    {
      merge: true,
    }
  );
}