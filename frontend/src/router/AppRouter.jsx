// src/router/AppRouter.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import AddListingPage from "../pages/AddListingPage.jsx";
import AddListingPage2 from "../pages/AddListingPage2.jsx";
import AddListingPage3 from "../pages/AddListingPage3.jsx";
import Addpartner from "../pages/Addpartner.jsx";
import PartnerAccounts from "../pages/partnerAccounts.jsx";
import UserAccounts from "../pages/UserAccounts.jsx";
import AuditLog from "../pages/AuditLog.jsx";
import LeadMessages from "../pages/LeadMessages.jsx";
function AppRouter() {
  return (
    <Router>
      <Navbar />

      <Routes>
        
        <Route path="/" element={<AddListingPage />} />
        <Route path="/add-listing" element={<AddListingPage />} />
        <Route path="/add-listing/step-2" element={<AddListingPage2 />} />
        <Route path="/add-listing/step-2/step-3" element={<AddListingPage3 />} />
        <Route path="/add-partner" element={<Addpartner />} />
        <Route path="/partner-accounts" element={<PartnerAccounts />} />
        <Route path="/user-accounts" element={<UserAccounts />} />
        <Route path="/audit-log" element={<AuditLog />} />
        <Route path="/lead-messages" element={<LeadMessages />} />



      </Routes>
    </Router>
  );
}

export default AppRouter;
