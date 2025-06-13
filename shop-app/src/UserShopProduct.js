import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("api/products/list")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);

        const defaultQuantities = {};
        data.forEach((product) => {
          defaultQuantities[product.id] = 1;
        });
        setQuantities(defaultQuantities);
      });

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, priceRange, products]);

  const applyFilters = () => {
    let result = [...products];

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    setFilteredProducts(result);
  };

  const handleQuantityChange = (productId, qty) => {
    const quantity = parseInt(qty);
    if (!isNaN(quantity) && quantity > 0) {
      setQuantities({ ...quantities, [productId]: quantity });
    } else {
      setQuantities({ ...quantities, [productId]: "" });
    }
  };

  const getCartQty = (productId) => {
    const item = cart.find((p) => p.id === productId);
    return item ? item.quantity : 0;
  };

  const isQuantityValid = (productId, availableStock) => {
    const qtyToAdd = parseInt(quantities[productId]);
    return !isNaN(qtyToAdd) && qtyToAdd >= 1 && qtyToAdd <= availableStock;
  };

  const addToCart = (product) => {
    const qty = parseInt(quantities[product.id]);

    if (qty > product.stock) {
      alert(`❌ Only ${product.stock} items left in stock for ${product.name}`);
      return;
    }

    // Call backend to reduce stock
    fetch("api/products/update-stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: qty,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Stock update failed");
        }
        return res.text();
      })
      .then(() => {
        // Update cart
        let updatedCart = [...cart];
        const index = updatedCart.findIndex((item) => item.id === product.id);

        if (index !== -1) {
          updatedCart[index].quantity += qty;
        } else {
          updatedCart.push({ ...product, quantity: qty });
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        alert(`${qty} x ${product.name} added to cart ✅`);

        // Refresh product list from backend
        return fetch("api/products/list");
      })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => {
        alert("❌ Failed to update stock: " + err.message);
      });
  };

  const uniqueCategories = [
    "All",
    ...new Set(products.map((p) => p.category || "Uncategorized")),
  ];

  return (
    <div style={{ margin: "50px" }}>
      <h2>🛒 All Products</h2>
      <button
        onClick={() => navigate("/cart")}
        style={{ float: "right", marginBottom: "10px" }}
      >
        Go to Cart 🧺
      </button>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />

        <label style={{ marginRight: "10px" }}>
          Price: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], parseInt(e.target.value)])
          }
        />
      </div>

      {filteredProducts.length === 0 && <p>No products found 🔍</p>}

      {filteredProducts.map((p) => {
        const cartQty = getCartQty(p.id);
        const remainingStock = p.stock;

        return (
          <div
            key={p.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <strong>₹{p.price}</strong>
            <br />
            <span style={{ color: p.stock <= 0 ? "red" : "green" }}>
              {p.stock <= 0 ? "Out of Stock" : `In stock: ${p.stock}`}
            </span>
            {cartQty > 0 && (
              <p style={{ fontSize: "12px", color: "#666" }}>
                In Cart: {cartQty}
              </p>
            )}
            <br />

            <label>
              Quantity:
              <input
                type="number"
                min="1"
                max={remainingStock}
                value={quantities[p.id] || ""}
                onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                disabled={remainingStock <= 0}
                style={{ width: "60px", marginLeft: "5px" }}
              />
            </label>
            <br />
            <br />

            <button
              onClick={() => addToCart(p)}
              disabled={!isQuantityValid(p.id, p.stock) || p.stock <= 0}
              style={{
                backgroundColor:
                  !isQuantityValid(p.id, p.stock) || p.stock <= 0
                    ? "#ccc"
                    : "#4CAF50",
                color: "white",
                cursor:
                  !isQuantityValid(p.id, p.stock) || p.stock <= 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {remainingStock <= 0
                ? "Stock Limit Reached"
                : "Add to Cart 🛒"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ProductList;
