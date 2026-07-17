import { create } from 'zustand';

export type Product = {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
};

export type CartItem = Product & {
  qty: number;
};

type CartStore = {
  items: CartItem[];

  lastUpdate: 'local' | 'remote';

  setItems: (items: CartItem[]) => void;

  setRemoteItems: (items: CartItem[]) => void;

  setItemQuantity: (
    id: string,
    qty: number
  ) => void;

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

    lastUpdate: 'remote',

    setItems: (items) =>
      set({
        items,
        lastUpdate: 'local',
      }),

    setRemoteItems: (items) =>
      set({
        items,
        lastUpdate: 'remote',
      }),

    setItemQuantity: (id, qty) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                qty,
              }
            : item
        ),
        lastUpdate: 'local',
      })),

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
            lastUpdate: 'local',
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
          lastUpdate: 'local',
        };
      });
    },

    removeFromCart: (id) =>
      set((state) => ({
        items:
          state.items.filter(
            (i) => i.id !== id
          ),
        lastUpdate: 'local',
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
        lastUpdate: 'local',
      })),

    clearCart: () =>
      set({
        items: [],
        lastUpdate: 'local',
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