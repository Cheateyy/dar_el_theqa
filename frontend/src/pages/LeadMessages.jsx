import { API_BASE_URL } from "/src/config/env.js";
import React, { useState, useEffect } from "react";
import "../assets/styles/LeadMessages.css";

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import nextPage from "../assets/icons/nextPage.svg";
import backButton from "../assets/icons/back.svg";

import dateIcon from "../assets/icons/Calender.svg";
import listingIcon from "../assets/icons/Listing.svg";
import clientIcon from "../assets/icons/fullname.svg";
import phoneIcon from "../assets/icons/Call.svg";
import closeIcon from "../assets/icons/removeimage.png";

import PanelcallIcon from "../assets/icons/PanelCall.svg";
import PanelMessagesIcon from "../assets/icons/PanelMessages.svg";

/* ---------------- UTIL ---------------- */
function formatRentUnit(unit) {
  if (!unit) return null;
  const map = {
    MONTH: "per month",
    YEAR: "per year",
    SIX_MONTHS: "per 6 months",
    WEEK: "per week",
    DAY: "per day",
  };
  return map[unit] || `per ${unit.toLowerCase().replace("_", " ")}`;
}

function LeadsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!["USER", "PARTNER", "ADMIN"].includes(user?.role)) {
      navigate("/not-authorized");
    }
  }, [loading, isAuthenticated, user, navigate]);

  /* ---------------- STATE ---------------- */
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- LOAD LEADS (OWNER BASED) ---------------- */
  const fetchLeads = async (page = 1) => {
    try {
      setLoadingList(true);
      setError(null);

      const token = localStorage.getItem("auth_token");

      const res = await fetch(
        `${API_BASE_URL}/api/vendor/leads/${user.id}/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed request");

      const data = await res.json();

      setLeads(data.results || []);
      setTotalPages(Math.ceil((data.count || 1) / 10));
    } catch {
      setError("Could not load leads.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchLeads(currentPage);
    }
  }, [user, currentPage]);

  /* ---------------- LOAD SINGLE LEAD ---------------- */
  const fetchLeadDetails = async (leadId) => {
    try {
      setLoadingDetails(true);
      setError(null);

      const token = localStorage.getItem("auth_token");

      const res = await fetch(
        `${API_BASE_URL}/api/leads/${leadId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed request");

      const data = await res.json();

      setSelectedLead({
        id: data.id,
        date: data.date,
        clientFullName: data.client.full_name,
        phoneNumber: data.client.phone,
        email: data.client.email,
        message: data.client.message,
        property: {
          title: data.property.title,
          address: `${data.property.region}, ${data.property.wilaya}`,
          price: data.property.price,
          priceUnit: formatRentUnit(data.property.rent_unit),
          type: data.property.property_type,
          bedrooms: data.property.bedrooms,
          bathrooms: data.property.bathrooms,
          area: data.property.area,
          imageUrl: data.property.cover_image,
        },
      });
    } catch {
      setError("Could not load lead details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleRowClick = (lead) => fetchLeadDetails(lead.id);
  const handleClosePanel = () => setSelectedLead(null);

  /* ---------------- PAGINATION ---------------- */
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  };

  const pageItems = getPageNumbers();

  if (loading) return null;

  /* ---------------- RENDER ---------------- */
  return (
    <div className="leads-page-wrapper">
      <div className="leads-container">
        <div className={`leads-main-layout ${selectedLead ? "has-details" : ""}`}>
          
          {/* TABLE */}
          <div className="leads-table-column">
            <div className="leads-table-section">
              <h1 className="page-title">Lead Messages</h1>

              {loadingList && <p>Loading leads...</p>}
              {error && <p className="error">{error}</p>}

              <div className="leads-table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th><img src={dateIcon} className="th-icon" /> Date</th>
                      <th><img src={listingIcon} className="th-icon" /> Listing</th>
                      <th><img src={clientIcon} className="th-icon" /> Client</th>
                      <th><img src={phoneIcon} className="th-icon" /> Phone</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leads.length > 0 ? (
                      leads.map((lead) => (
                        <tr key={lead.id} onClick={() => handleRowClick(lead)}>
                          <td>{lead.date}</td>
                          <td>{lead.listing_title}</td>
                          <td>{lead.client_name}</td>
                          <td>{lead.client_phone}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="empty-row">
                          No leads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              
            </div>
            {/* PAGINATION */}
              <div className="leads-pagination">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <img src={backButton} alt="back" />
                </button>

                {pageItems.map((p) => (
                  <button
                    key={p}
                    className={`page-dot ${p === currentPage ? "active" : ""}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <img src={nextPage} alt="next" />
                </button>
              </div>
          </div>

          {/* DETAILS PANEL */}
          {selectedLead && (
            <div className="lead-details-card">
              <button className="close-panel-btn" onClick={handleClosePanel}>
                <img src={closeIcon} alt="Close" />
              </button>

              {loadingDetails ? (
                <p>Loading details...</p>
              ) : (
                <>
                  <div className="lead-client-info">
                    <h2 className="lead-client-name">
                      {selectedLead.clientFullName}
                    </h2>

                    <p className="lead-client-phone">
                      <img src={PanelcallIcon} />
                      {selectedLead.phoneNumber}
                    </p>

                    <p className="lead-client-email">
                      <img src={PanelMessagesIcon} />
                      {selectedLead.email}
                    </p>
                  </div>

                  <div className="lead-message-box">
                    <h3>Customer Message</h3>
                    <p>{selectedLead.message}</p>
                  </div>

                  {selectedLead.property && (
                    <div className="lead-property-summary">
                      <img
                        src={selectedLead.property.imageUrl}
                        className="lead-property-image"
                        alt=""
                      />

                      <h3 className="lead-property-title">
                        {selectedLead.property.title}
                      </h3>

                      <p className="lead-property-price">
                        {selectedLead.property.price} DZD
                        {selectedLead.property.priceUnit && (
                          <span className="lead-property-price-unit">
                            {" "}
                            {selectedLead.property.priceUnit}
                          </span>
                        )}
                      </p>

                      <div className="lead-property-meta">
                        <div className="meta-card">
                          <span className="meta-label">Type</span>
                          <span className="meta-value">
                            {selectedLead.property.type}
                          </span>
                        </div>

                        <div className="meta-card">
                          <span className="meta-label">Area</span>
                          <span className="meta-value">
                            {selectedLead.property.area} m²
                          </span>
                        </div>

                        <div className="meta-card">
                          <span className="meta-label">Bedrooms</span>
                          <span className="meta-value">
                            {selectedLead.property.bedrooms}
                          </span>
                        </div>

                        <div className="meta-card">
                          <span className="meta-label">Bathrooms</span>
                          <span className="meta-value">
                            {selectedLead.property.bathrooms}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeadsPage;
