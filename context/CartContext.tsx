"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CartContextType = {
  // TODO: define cart state (items, total, etc.)
  items: any[];
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<any[]>([]);

  return (
    <CartContext.Provider value={{ items }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
