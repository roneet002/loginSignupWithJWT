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
  const [errorsSuccess, setErrorsSuccess] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


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
      setErrorsSuccess(response?.data?.message); ///////need to console.log(message);
      navigate("/signin")
    } catch (error) {
      if (error) {
        setErrorsSuccess(error.response.data.message); /// need to print error message from server 
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

                {/* Alert Message */}
                {/* Display success or error message after API response */}
                {errorsSuccess && <Alert variant="danger">{errorsSuccess}</Alert>}

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
