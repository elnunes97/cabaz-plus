import { create } from 'zustand';

type Product = {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
};

type CartItem = Product & {
  qty: number;
};

type CartStore = {
  items: CartItem[];

  addToCart: (
    product: Product,
    qty?: number
  ) => void;

  removeFromCart: (
    id: string
  ) => void;

  decreaseQty: (
    id: string
  ) => void;

  clearCart: () => void;

  getTotal: () => number;

  getTotalItems: () => number;
};

export const useCartStore =
  create<CartStore>((set, get) => ({
    items: [],

    addToCart: (
      product,
      qty = 1
    ) => {
      set((state) => {
        const existing =
          state.items.find(
            (i) =>
              i.id === product.id
          );

        if (existing) {
          return {
            items: state.items.map(
              (i) =>
                i.id === product.id
                  ? {
                      ...i,
                      qty:
                        i.qty + qty,
                    }
                  : i
            ),
          };
        }

        return {
          items: [
            ...state.items,
            {
              ...product,
              qty,
            },
          ],
        };
      });
    },

    removeFromCart: (id) =>
      set((state) => ({
        items:
          state.items.filter(
            (i) => i.id !== id
          ),
      })),

    decreaseQty: (id) =>
      set((state) => ({
        items: state.items
          .map((item) =>
            item.id === id
              ? {
                  ...item,
                  qty:
                    item.qty - 1,
                }
              : item
          )
          .filter(
            (item) =>
              item.qty > 0
          ),
      })),

    clearCart: () =>
      set({
        items: [],
      }),

    getTotal: () =>
      get().items.reduce(
        (sum, item) =>
          sum +
          item.preco *
            item.qty,
        0
      ),

    getTotalItems: () =>
      get().items.reduce(
        (sum, item) =>
          sum + item.qty,
        0
      ),
  }));