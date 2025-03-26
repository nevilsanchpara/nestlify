import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import ListingExplore from "./Components/ListingExplore";
import ContactUs from "./Components/ContactUs";
import LoginRegister from "./Components/LoginRegister";
import ForgotPassword from "./Components/ForgotPassword"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "./Components/Search";
import Verification from "./Components/Verification";
import AdminPortal from "./Components/AdminPortal";
import PropertyDetailsPage from "./Components/PropertyDetailsPage";
import "./index.css";
import ResetPasswordPage from './Components/ResetPasswordPage';
const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  return (
    <div className="min-h-lvh flex flex-col ">
    <Router>
      <Navbar />
      <div className="pt-16">
     
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<ListingExplore />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/property/:id" element={<PropertyDetailsPage/>} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage/>} />
          <Route path="/verify/:token" element={<Verification/>} />
          
        </Routes>
        </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
  
    </Router>
    </div>
  );
}

export default App;