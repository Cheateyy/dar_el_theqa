// src/router/AppRouter.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddListingPage from "../pages/AddListingPage.jsx";
import AddListingPage2 from "../pages/AddListingPage2.jsx";
import AddListingPage3 from "../pages/AddListingPage3.jsx";
import Addpartner from "../pages/Addpartner.jsx";
import PartnerAccounts from "../pages/partnerAccounts.jsx";
import UserAccounts from "../pages/UserAccounts.jsx";
import AuditLog from "../pages/AuditLog.jsx";
import LeadMessages from "../pages/LeadMessages.jsx";
import Navbar from "../components/Navbar.jsx";
function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Navbar /><AddListingPage /></>} />
        <Route path="/add-listing" element={<><Navbar /><AddListingPage /></>} />
        <Route path="/add-listing/step-2" element={<><Navbar /><AddListingPage2 /></>} />
        <Route path="/add-listing/step-2/step-3" element={<><Navbar /><AddListingPage3 /></>} />
        <Route path="/add-partner" element={<><Navbar /><Addpartner /></>} />
        <Route path="/partner-accounts" element={<><Navbar /><PartnerAccounts /></>} />
        <Route path="/user-accounts" element={<><Navbar /><UserAccounts /></>} />
        <Route path="/audit-log" element={<><Navbar /><AuditLog /></>} />
        <Route path="/lead-messages" element={<><Navbar /><LeadMessages /></>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
