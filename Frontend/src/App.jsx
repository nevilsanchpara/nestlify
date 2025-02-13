import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import ListingExplore from "./Components/ListingExplore";
import ContactUs from "./Components/ContactUs";
import LoginRegister from "./Components/LoginRegister";
import Search from "./Components/Search";
import "./index.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<ListingExplore />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
