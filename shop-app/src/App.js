import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserShopProduct from "./UserShopProduct";
import CartShop from "./CartShop";
import CheckoutPage from "./CheckoutPage"; // If exists

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserShopProduct />} />
        <Route path="/cart" element={<CartShop />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* Add other routes like login/register here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
