import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Container } from "react-bootstrap";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchProductDetails = async () => {
     try {
        const token = localStorage.getItem("token"); // If authentication is required
        
        const response = await axios.get(`http://localhost:5000/product/products/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token if needed
          },
        });
        setLoading(false)

        setProduct(response.data);

      
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
        setLoading(false)
      }
    };

    fetchProductDetails();
  }, [id]);



  if (Loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Container>
      {" "}

      <Card style={{ width: "25rem", margin: "20px auto" }}>
        <Card.Body>
          <Card.Title>Product Name: {product?.name}</Card.Title>
          <Card.Text>Description: {product?.description}</Card.Text>
          <Card.Text>Price: ${product?.price}</Card.Text>
          <Card.Text>Brand: {product?.brand}</Card.Text>
          <Card.Text>Category: {product?.category}</Card.Text>

          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Back to Products
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductDetails;
