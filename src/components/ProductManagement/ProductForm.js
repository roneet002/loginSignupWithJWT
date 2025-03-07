import React, { useState } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import axios from "axios"; // ✅ Import Axios

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    category: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Handle form input change
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const token = localStorage.getItem("token");
  
  
    const productData = {
      ...product
    };
  
    try {
      await axios.post("http://localhost:5000/product/products", productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while adding the product.");
    }
  };
  
  return (
    <>

      <Container>
        <h1>Add Product</h1>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter product name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              placeholder="Enter product description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="text"
              name="price"
              placeholder="Enter product price"
              value={product.price}
              onChange={(e) => {
                if (/^\d*\.?\d*$/.test(e.target.value)) {
                  handleChange(e);
                }
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              name="brand"
              placeholder="Enter product brand"
              value={product.brand}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Technology & Gadgets">Technology & Gadgets</option>
              <option value="Home Essentials">Home Essentials</option>
              <option value="Work & Productivity">Work & Productivity</option>
              <option value="Lifestyle & Leisure">Lifestyle & Leisure</option>
              <option value="Food & Groceries">Food & Groceries</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Entertainment">Entertainment</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Product
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default ProductForm;
