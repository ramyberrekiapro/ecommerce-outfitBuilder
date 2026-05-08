import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQty: (productId: string, size: string, color: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const matches = (i: CartItem, productId: string, size: string, color: string) =>
  i.productId === productId && i.size === size && i.color === color;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) =>
            matches(i, item.productId, item.size, item.color),
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                matches(i, item.productId, item.size, item.color)
                  ? { ...i, qty: i.qty + item.qty }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          items: state.items.filter((i) => !matches(i, productId, size, color)),
        })),
      updateQty: (productId, size, color, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              matches(i, productId, size, color) ? { ...i, qty } : i,
            )
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "213-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((acc, i) => acc + i.qty, 0);

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((acc, i) => acc + i.qty * i.price, 0);
