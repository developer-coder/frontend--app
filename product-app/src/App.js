import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Product from "./Product";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Product />} />
      </Routes>
    </Router>
  );
}

export default App;
