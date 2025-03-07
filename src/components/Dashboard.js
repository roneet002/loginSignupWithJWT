import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
// import ProductList from "./ProductManagement/ProductList";
import ProductList1 from "./ProductManagement/ProductList1";


const Dashboard = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // ✅ Get user details from local storage (or fetch from API)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUsername(JSON.parse(storedUser).username);
      }
    }
  }, [localStorage.token]);

  

  return (
    <>

      <Container>
        <h1>Welcome, {username || "User"}!</h1>
        <ProductList1 />
      </Container>
    </>
  );
};

export default Dashboard;
