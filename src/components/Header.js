import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Import jwtDecode
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // ✅ Decode JWT token
        setIsLoggedIn(true);
        setUsername(decodedToken.username || "User"); // ✅ Extract username safely
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []); // ✅ No localStorage.token in dependency array

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove token
    window.dispatchEvent(new Event("storage")); // ✅ Trigger storage event for other tabs
    setIsLoggedIn(false);
    setUsername("");
    navigate("/signin"); // Redirect to Sign In page
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">Product Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Link to="/dashboard">Dashboard</Link>
          </Nav>

          {/* Show username and Sign Out button when logged in */}
          {isLoggedIn && (
            <>
              <Navbar.Text>Signed in as: {username}</Navbar.Text>&nbsp;&nbsp;
              <Button variant="outline-light" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
