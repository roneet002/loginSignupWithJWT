import React, { Children, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SignIn from "./components/Authorisation/SignIn";
import Signup from "./components/Authorisation/Signup";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header"
import ProductList from "./components/ProductManagement/ProductList";
import ProductForm from "./components/ProductManagement/ProductForm";
import ProductDetails from "./components/ProductManagement/ProductDetails";
import { jwtDecode } from "jwt-decode";

// Utility function to validate JWT token expiration(needs implementation)
// const isTokenValid = (token) =>{
//   try{

// //1. check if token exists, if not return false
// //2. Decode the JWT and check its expiration time
// //3. compare expiration time with the current time to determine if the token is expired ...............
// //4. return true if token is valid, false if expired or invalid
//   }
//   catch(error){
//     console.error("Error decding token:", error); //log error in case........
// return false; // return false if there's and error decoding the token
//   }

// }
const isTokenValid = (token) => {
  try {
    if (!token) return false; // No token? Not valid
    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000 > Date.now();   ///return true

    // Check if token is expired
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return false;
  }
};
// ProtectedRoute component to protect certain routes (needs implementation)

// const ProtectedRoute = ({Children}) =>{
//1. check if the user is authenticated using the token
//2. if the token is invalid or expired, redirect to signin page.
//3. if valid, render the child component

// }
const ProtectedRoute = ({ children }) => {

  const token = localStorage.getItem("token");
  if (isTokenValid(token)) {
    return children;
  }else{
    return <Navigate to="/signin" replace />;
  }
};



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [isToken, setIsToken] = useState("");
  
useEffect(() => {
  setLoading(true);
 if(isTokenValid(localStorage.token)){
  setIsAuthenticated(true);
  setLoading(false);
 }else{
  setIsAuthenticated(false);
  setLoading(false);
 }
  window.addEventListener("storage", (e) => {
    setLoading(true);
    const token = e.target.localStorage.token;
    setIsToken(token);
    if (isTokenValid(token)) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  });

  return () => {
    window.removeEventListener("storage", ()=>{});
  };

}, [isToken])


if(Loading){
  return <div>Loading</div>
}

  return (
    <>
      <div className="App">
        {Loading && <div>Loading</div>}
        <Router>
          {isAuthenticated && <Header />}
          {/* Display the header only if authenticated */}

          <Routes>
            {/* Route for Sign In page */}
            {/* If user is authenticated, redirect to dashboard otherwise, ...............*/}
            <Route path="/signin" element={<SignIn />} />

            {/* Route for Sign Up page */}
            {/* If user is authenticated, redirect to dashboard otherwise, ...............*/}
            <Route exact path="/Signup" element={<Signup />} />

            {/* Protected Route for Dashboard */}
            {/* If user is authenticated, show Dashboard component */}
            {/* If not, redirect to sign In page */}
            <Route exact path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Default route redirects to dashboard*/}
            <Route
              exact
              path="/dashboard"
              element={<Navigate to="/dashboard" />}
            />

            {/* Protected Route for Product List} */}

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  {" "}
                  <ProductList /> {/* Show Product List only if authenticated....... */}
                </ProtectedRoute>
              }
            ></Route> 


            {/* Protected Route for adding a product} */}

            <Route
              path="/add-product"
              element={
                <ProtectedRoute>
                  {" "}
                  <ProductForm /> {/* Show Product form for adding a product...... */}
                </ProtectedRoute>
              }
            ></Route> 



            {/* Protected Route for  viewing product details} */}

            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  {" "}
                  <ProductDetails /> {/* Show Product detail...... */}
                </ProtectedRoute>
              }
            ></Route> 



            <Route path="/edit-product/:id" element={<ProductForm />} />
            
            {/* <Route exact path="/" element={<Home />} /> */}
            {/* <Route exact path="/contact" element={<ContactUs />} />
            <Route path="*" element={<NoPageFound />} /> */}
          </Routes>
        </Router>
      </div>
    </>
  );
};

export default App;
