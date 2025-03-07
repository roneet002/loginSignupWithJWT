import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      setIsLoggedIn(true);
      // ✅ Get user details from local storage (or fetch from API)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUsername(JSON.parse(storedUser).username);
      }
    }
  }, [localStorage.token]);

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("user"); // Remove user data
    window.dispatchEvent(new Event("storage"))
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
            <Nav.Link href="/dashboard">
              Dashboard
            </Nav.Link>
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
