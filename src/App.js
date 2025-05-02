import React, { useState } from "react";
import Layout from "./components/Layout";
import PriceList from "./components/PriceList";
import Cart from "./components/Cart";
import GlobalStyles from "./styles/GlobalStyles";

function App() {
  const [currentPage, setCurrentPage] = useState("priceList");

  const handleCartClick = () => {
    setCurrentPage("cart");
  };

  const handleBackToPriceList = () => {
    setCurrentPage("priceList");
  };

  return (
    <>
      <GlobalStyles />
      <Layout onCartClick={handleCartClick}>
        {currentPage === "priceList" && <PriceList />}
        {currentPage === "cart" && <Cart onBack={handleBackToPriceList} />}
      </Layout>
    </>
  );
}

export default App;
