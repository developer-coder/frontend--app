import React, { useState, useEffect } from "react";

function Product() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [id, setid] = useState(null);

  // ✅ Fetch product list
  const fetchProducts = async () => {
    console.log("📡 Calling fetchProducts...");
    try {
      const res = await fetch("/api/products/list", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Products fetched:", data);
      setProducts(data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert("Could not load products. See console for details.");
    }
  };

  // ✅ Fetch products on mount
  useEffect(() => {
    console.log("🧩 Product component mounted");
    fetchProducts();
  }, []);

  // ✅ Add or update
  const handleAddOrUpdate = async () => {
    if (!name || !description || !price) {
      alert("Please fill all fields.");
      return;
    }

    const productData = { name, description, price,stock };

    try {
      const url = id
        ? `/api/products/updateProduct/${id}`
        : "/api/products/add";

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
        credentials: "include",
      });

      if (!res.ok) throw new Error(`${method} request failed`);
alert(id ? "✅ Product updated successfully!" : "✅ Product added successfully!");

      setName("");
      setDescription("");
      setPrice("");
	   setStock("");
      setid(null);
      fetchProducts();
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("Error saving product.");
    }
  };

  const handleEdit = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setid(product.id);
	setStock(product.stock)
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products/deleteProduct/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      fetchProducts();
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div style={{ margin: "50px auto", maxWidth: "600px", textAlign: "center" }}>
      <h2>Product Management</h2>

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
	  
	  <input
        type="number"
        placeholder="Quantity"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={handleAddOrUpdate}
        style={{
          padding: "10px 20px",
          backgroundColor: id ? "orange" : "#4CAF50",
          color: "white",
          border: "none",
          marginBottom: "20px",
        }}
      >
        {id ? "Update Product" : "Add Product"}
      </button>

      <div>
        {products.length === 0 ? (
          <p>🔍 No products found.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <h3>{product.name}</h3>
              <p>{product.description}</p>
			  <p>{product.stock}</p>
              <strong>₹{product.price}</strong>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleEdit(product)}
                  style={{
                    marginRight: "10px",
                    backgroundColor: "dodgerblue",
                    color: "white",
                    padding: "5px 10px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  style={{
                    backgroundColor: "crimson",
                    color: "white",
                    padding: "5px 10px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Product;
