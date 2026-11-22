import { useCart } from "./context/CartContext.jsx";

const products = [
  { id: 1, name: "Pen", price: 10 },
  { id: 2, name: "Book", price: 50 },
  { id: 3, name: "Bag", price: 300 }
];

export default function App() {
  const { cart, dispatch, itemCount, total } = useCart();

  return (
    <main className="shop">
      <nav className="navbar">
        <a className="brand" href="#home">Practical 3 - Context API</a>
        <span className="student-details"></span>
        <a href="#products">Products</a>
        <a href="#cart">Cart ({itemCount})</a>
      </nav>

      <header id="home" className="page-heading">
        <h1>Shopping Cart</h1>
        <p>Welcome, Student. A simple store example using Context API and useReducer.</p>
      </header>

      <section id="products">
        <h2>Product List</h2>
        <div className="product-list">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <h3>{product.name}</h3>
              <p>Price: Rs. {product.price}</p>
              <button onClick={() => dispatch({ type: "add", product })}>Add to Cart</button>
            </article>
          ))}
        </div>
      </section>

      <section id="cart" className="cart-section">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>Rs. {item.price} each</span>
                </div>
                <div className="cart-actions">
                  <button aria-label={`Decrease ${item.name}`} onClick={() => dispatch({ type: "decrease", productId: item.id })}>-</button>
                  <span>Quantity: {item.quantity}</span>
                  <button aria-label={`Increase ${item.name}`} onClick={() => dispatch({ type: "increase", productId: item.id })}>+</button>
                  <button className="remove-button" onClick={() => dispatch({ type: "remove", productId: item.id })}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="cart-total"><b>Total: Rs. {total}</b></p>
      </section>
    </main>
  );
}
