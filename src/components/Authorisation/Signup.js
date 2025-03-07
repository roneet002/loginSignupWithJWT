import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Col,
  Container,
  InputGroup,
  Row,
  Alert,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const Signup = () => {
  // State Management:
  // formData: Holds user input values for username, email, password...........
  // showPassword: Toggles the visiblity of the password field.
  // message: Stores the success message after a succesfull signup
  // error : stores error message if sign-up fails.

  // Event Handlers:
  // handleChange: Updates formData whenever and input field change
  // handleSubmit: submit the sign-up form, sends POST request to the................
  // togglePasswordVisibility: Toggle the state of showPassword to.....................

  // API Endpoint:
  // Post request to "http://localhost:5000/user/signup"
  // payload includes {username, email , password, role}

  //successful sign up:
  // Display the success message.
  // Redirects the user to the SignIn page.

  //on Sign-up Failure:
  // Display the error message recieved from the server

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    let validationErrors = {};
    setErrors({});
    if (!/^[a-z]+$/.test(formData.username)) {
      validationErrors.username =
        "Username must contain only lowercase letters.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(formData.password)) {
      validationErrors.password =
        "Password must contain at least one capital letter, one lowercase letter, one special Character, and a minimum of 8 characters";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      const { username, email, password } = formData;
      const response = await axios.post(
        "http://localhost:5000/user/signup",
        {
          username,
          email,
          password,
          role: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setMessage(response?.data?.message); ///////need to console.log(message);
      setTimeout(() => navigate("/SignIn"), 1500);
    } catch (error) {
      if (error) {
        setMessage(error.response.data.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container className="mt-5">
      <Row className="row justify-content-center">
        <Col md={6}>
          <div
            className="card"
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              boxShadow: "0 4px 0 rgba(0,0,0, 0.1)",
            }}
          >
            <div className="card-header text-center">
              <h2 className="text-center mb-4">Signup</h2>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formusername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter usrname"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <InputGroup.Text>
                      <Button variant="link" onClick={togglePasswordVisibility}>
                        {showPassword ? <Eye /> : <EyeSlash />}
                      </Button>
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                {errors.username && (
                  <Alert variant="danger">{errors.username}</Alert>
                )}
                {errors.email && <Alert variant="danger">{errors.email}</Alert>}
                {errors.password && (
                  <Alert variant="danger">{errors.password}</Alert>
                )}

                {/* Alert Message */}
                {/* Display success or error message after API response */}
                {message && <Alert variant="danger">{message}</Alert>}
                <div className="text-center">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 btn btn-primary"
                  >
                    Signup
                  </Button>
                </div>
              </Form>

              {/* Link to navigate to the SignIn Page */}
              <div className="text-center mt-3">
                <p>
                  Already have an account? <Link to="/signin">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
