import {
    doc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";

import { useFavoriteStore } from "../src/store/favoriteStore";
import { db } from "./firebase";

export function listenFavorites(
  uid: string
) {
  const ref = doc(db, "users", uid);

  return onSnapshot(ref, (snapshot) => {
    if (!snapshot.exists()) {
      useFavoriteStore
        .getState()
        .setRemoteItems([]);

      return;
    }

    const data = snapshot.data();

    useFavoriteStore
      .getState()
      .setRemoteItems(
        data.favorites ?? []
      );
  });
}

export async function saveFavorites(
  uid: string
) {
  const items =
    useFavoriteStore.getState().items;

  await setDoc(
    doc(db, "users", uid),
    {
      favorites: items,
    },
    {
      merge: true,
    }
  );
}