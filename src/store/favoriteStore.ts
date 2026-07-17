import { create } from "zustand";

export type FavoriteProduct = {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
};

type FavoriteStore = {
  items: FavoriteProduct[];

  lastUpdate: "local" | "remote";

  setItems: (items: FavoriteProduct[]) => void;

  setRemoteItems: (
    items: FavoriteProduct[]
  ) => void;

  addFavorite: (
    product: FavoriteProduct
  ) => void;

  removeFavorite: (
    id: string
  ) => void;

  toggleFavorite: (
    product: FavoriteProduct
  ) => void;

  isFavorite: (
    id: string
  ) => boolean;

  clearFavorites: () => void;
};

export const useFavoriteStore =
  create<FavoriteStore>((set, get) => ({
    items: [],

    lastUpdate: "remote",

    setItems: (items) =>
      set({
        items,
        lastUpdate: "local",
      }),

    setRemoteItems: (items) =>
      set({
        items,
        lastUpdate: "remote",
      }),

    addFavorite: (product) =>
      set((state) => {
        if (
          state.items.some(
            (i) => i.id === product.id
          )
        ) {
          return state;
        }

        return {
          items: [...state.items, product],
          lastUpdate: "local",
        };
      }),

    removeFavorite: (id) =>
      set((state) => ({
        items: state.items.filter(
          (i) => i.id !== id
        ),
        lastUpdate: "local",
      })),

    toggleFavorite: (product) => {
      const exists = get().items.some(
        (i) => i.id === product.id
      );

      if (exists) {
        get().removeFavorite(product.id);
      } else {
        get().addFavorite(product);
      }
    },

    isFavorite: (id) =>
      get().items.some(
        (i) => i.id === id
      ),

    clearFavorites: () =>
      set({
        items: [],
        lastUpdate: "local",
      }),
  }));