import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const updateBackendStock = async (productId, diff) => {
    try {

   const response = await fetch(
   `/api/products/update-stock-using-productId?productId=${productId}&quantity=${diff}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    productId,
    quantity: diff,
  }),
});
	  

      if (!response.ok) {
        throw new Error("Stock update failed");
      }
    } catch (error) {
      alert(`❌ Failed to update stock: ${error.message}`);
    }
  };

  const updateQuantity = async (index, qty) => {
    const quantity = parseInt(qty);
    const product = cartItems[index];

    if (!isNaN(quantity) && quantity > 0) {
      const stockAvailable = product.stock + product.quantity; // Add back old qty
      if (quantity > stockAvailable) {
        alert(`You cannot add more than ${stockAvailable} items of ${product.name}`);
        return;
      }

      const quantityDiff = quantity - product.quantity; // e.g., +2 or -1
      const updatedCart = [...cartItems];
      updatedCart[index].quantity = quantity;

      setCartItems(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      if (quantityDiff !== 0) {
        await updateBackendStock(product.id, quantityDiff); // positive means reduce
        updatedCart[index].stock = stockAvailable - quantity;
      }
    } else {
      alert("Invalid quantity");
    }
  };

  const removeItem = async (index) => {
    const updatedCart = [...cartItems];
    const removed = updatedCart.splice(index, 1)[0];

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Restore stock in DB
    await updateBackendStock(removed.id, -removed.quantity); // negative value to restore
    alert(`${removed.name} removed from cart ❌`);
  };

  const getTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ margin: "50px" }}>
      <h2>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              marginBottom: "10px",
            }}
          >
            <h4>{item.name}</h4>
            <p>Price: ₹{item.price}</p>
            <label>
              Quantity:
              <input
                type="number"
                min="1"
                max={item.stock + item.quantity}
                value={item.quantity}
                onChange={(e) => updateQuantity(index, e.target.value)}
                style={{ width: "60px", marginLeft: "5px" }}
              />
            </label>
            <br />
            <button
              onClick={() => removeItem(index)}
              style={{
                marginTop: "5px",
                color: "white",
                backgroundColor: "red",
                border: "none",
                padding: "5px 10px",
              }}
            >
              Remove ❌
            </button>
          </div>
        ))
      )}

      <h3>Total: ₹{getTotal()}</h3>

      {cartItems.length > 0 && (
        <button onClick={() => navigate("/checkout")}>
          Proceed to Payment 💳
        </button>
      )}
    </div>
  );
}

export default CartPage;
