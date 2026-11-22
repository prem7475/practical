import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(cart, action) {
  switch (action.type) {
    case "add": {
      const existingItem = cart.find((item) => item.id === action.product.id);
      if (existingItem) {
        return cart.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...cart, { ...action.product, quantity: 1 }];
    }
    case "remove":
      return cart.filter((item) => item.id !== action.productId);
    case "increase":
      return cart.map((item) =>
        item.id === action.productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    case "decrease":
      return cart
        .map((item) =>
          item.id === action.productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
    case "clear":
      return [];
    default:
      return cart;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider value={{ cart, dispatch, itemCount, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}
