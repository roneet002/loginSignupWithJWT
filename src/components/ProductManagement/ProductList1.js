import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductList1 = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(""); // ✅ State for success message
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5000/product/products", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response)
        setProducts(response.data);
       
     
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Function to Delete Product
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this product?")){
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/product/products/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    ///=check if product deleted message is coming from response
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));
     
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Container className="mb-4">
      <h2>Existing Products</h2>

      {/* ✅ Show delete success message */}
      {message && (
        <Alert variant={message.includes("✅") ? "success" : "danger"}>
          {message}
        </Alert>
      )}

      <Button
        variant="primary"
        className="mb-2"
        onClick={() => navigate("/add-product")}
        style={{ float: "right" }}
      >
        Add Product
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    View
                  </Button>{" "}
                  <Button
                    variant="warning"
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProductList1;
