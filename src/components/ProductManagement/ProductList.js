import React from "react";
import { Button, Container, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductList = (props) => {
    const navigate = useNavigate();
  
  return (
    <Container className="mb-4">
      <h2>Existing Products</h2>

      {/* ✅ Show delete success message */}
      {props.message && (
        <Alert variant={props.message.includes("✅") ? "success" : "danger"}>
          {props.message}
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
          {props.products.length > 0 ? (
           props.products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => navigate(`/product-details/${product._id}`)}
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
                    onClick={() => props.handleDelete(product._id)}
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

export default ProductList;
