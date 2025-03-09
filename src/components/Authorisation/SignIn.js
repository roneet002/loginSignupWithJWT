import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + "user/signin",
        formData
      );
      const { token, user } = response.data;

      // ✅ Store authentication details
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"))


      setErrorMessage(response?.data?.message);
      // ✅ Redirect user based on role
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col md={12}>
          <div
            className="shadow-lg p-4 rounded bg-white"
            style={{ maxWidth: "400px" }}
          >
            <h3 className="text-center mb-4">Login</h3>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <Eye /> : <EyeSlash />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                variant="primary"
                className="w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Login"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
