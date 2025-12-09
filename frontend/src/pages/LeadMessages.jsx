import React, { useState, useEffect } from "react";
import "../assets/styles/LeadMessages.css";

import nextPage from "../assets/icons/nextPage.svg";
import backButton from "../assets/icons/back.svg";

import dateIcon from "../assets/icons/Calender.svg";
import listingIcon from "../assets/icons/Listing.svg";
import clientIcon from "../assets/icons/fullname.svg";
import phoneIcon from "../assets/icons/Call.svg";
import closeIcon from "../assets/icons/removeimage.png";
import propertyImage from "../assets/images/propertyimage.jpg";
import PanelcallIcon from "../assets/icons/PanelCall.svg";
import PanelMessagesIcon from "../assets/icons/PanelMessages.svg";

const USE_MOCK_DATA = true;

const MOCK_LEADS = [
  {
    id: 1,
    date: "2025-11-22",
    listingTitle: "FreeBlood",
    clientFullName: "George Martin",
    phoneNumber: "+213 560 30 47 77",
    email: "client@mail.com",
    message: "message from client lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    property: {
      title: "Property title",
      address: "Hydra, Alger",
      price: 40000,
      priceUnit: "per month",
      type: "Appartement",
      bedrooms: 4,
      bathrooms: 4,
      area: 300,
      imageUrl: propertyImage,
    },
  },
];

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
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeads = async (page = 1) => {
    if (USE_MOCK_DATA) {
      const PAGE_SIZE = 10;
      const start = (page - 1) * PAGE_SIZE;
      const mockPageItems = MOCK_LEADS.slice(start, start + PAGE_SIZE);

      setLeads(
        mockPageItems.map((m) => ({
          id: m.id,
          date: m.date,
          listing_title: m.listingTitle,
          client_name: m.clientFullName,
          client_phone: m.phoneNumber,
        }))
      );

      setTotalPages(Math.ceil(MOCK_LEADS.length / PAGE_SIZE) || 1);
      
      return;
    }

    try {
      setLoadingList(true);
      setError(null);

      const res = await fetch(`/api/vendor/leads/?page=${page}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setLeads(data.results || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(data.page || 1);
    } catch {
      setError("Could not load leads.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchLeads(currentPage);
  }, [currentPage]);

  const fetchLeadDetails = async (leadId) => {
    if (USE_MOCK_DATA) {
      const mockLead = MOCK_LEADS.find((l) => l.id === leadId);
      if (!mockLead) return;

      setSelectedLead({
        id: mockLead.id,
        date: mockLead.date,
        clientFullName: mockLead.clientFullName,
        phoneNumber: mockLead.phoneNumber,
        email: mockLead.email,
        message: mockLead.message,
        property: mockLead.property,
      });
      return;
    }

    try {
      setLoadingDetails(true);
      setError(null);

      const res = await fetch(`/api/vendor/leads/${leadId}/`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      const parsedLead = {
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
      };

      setSelectedLead(parsedLead);
    } catch {
      setError("Could not load lead details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleRowClick = (lead) => {
    fetchLeadDetails(lead.id);
  };

  const handleClosePanel = () => setSelectedLead(null);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 4;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const firstPage = 1;
    const lastPage = totalPages;

    let start = currentPage - 1;
    let end = currentPage + 1;

    if (start < 2) {
      start = 2;
      end = start + (maxVisible - 2);
    }

    if (end > lastPage - 1) {
      end = lastPage - 1;
      start = end - (maxVisible - 2);
      if (start < 2) start = 2;
    }

    pages.push(firstPage);
    if (start > 2) pages.push("left-ellipsis");

    for (let i = start; i <= end && i < lastPage; i++) pages.push(i);
    if (end < lastPage - 1) pages.push("right-ellipsis");

    pages.push(lastPage);
    return pages;
  };

  const pageItems = getPageNumbers();

  return (
    <div className="leads-page-wrapper">
      <div className="leads-container">
        <div className={`leads-main-layout ${selectedLead ? "has-details" : ""}`}>
          <div className="leads-table-column">
            <div className="leads-table-section">
              <h1 className="page-title">Lead Messages</h1>

              {loadingList && <p>Loading leads...</p>}
              {error && <p className="error">{error}</p>}

              <div className="leads-table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th><span className="th-with-icon"><img src={dateIcon} alt="" className="th-icon" /> Date</span></th>
                      <th><span className="th-with-icon"><img src={listingIcon} alt="" className="th-icon" /> Listing Title</span></th>
                      <th><span className="th-with-icon"><img src={clientIcon} alt="" className="th-icon" /> Client</span></th>
                      <th><span className="th-with-icon"><img src={phoneIcon} alt="" className="th-icon" /> Phone</span></th>
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
                        <td colSpan="4" className="empty-row">No leads found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="leads-pagination">
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                <img src={backButton} alt="back" />
              </button>

              {pageItems.map((item, idx) =>
                typeof item === "string" ? (
                  <button key={idx} disabled className="page-dot">...</button>
                ) : (
                  <button
                    key={item}
                    className={`page-dot ${item === currentPage ? "active" : ""}`}
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </button>
                )
              )}

              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                <img src={nextPage} alt="next" />
              </button>
            </div>
          </div>

          {selectedLead && (
            <div className="lead-details-card">
              <div className="lead-details-panel">
                <button className="close-panel-btn" onClick={handleClosePanel}>
                  <img src={closeIcon} alt="Close" />
                </button>

                {loadingDetails ? (
                  <p>Loading details...</p>
                ) : (
                  <>
                    <div className="lead-client-info">
                      <h2 className="lead-client-name">{selectedLead.clientFullName}</h2>

                      <p className="lead-client-phone">
                        <img src={PanelcallIcon} alt="" /> {selectedLead.phoneNumber}
                      </p>

                      <p className="lead-client-email">
                        <img src={PanelMessagesIcon} alt="" /> {selectedLead.email}
                      </p>
                    </div>

                    <div className="lead-message-box">
                      <h3>Customer Message</h3>
                      <p>{selectedLead.message}</p>
                    </div>

                    {selectedLead.property && (
                      <div className="lead-property-summary">
                        <div className="property-image-wrap">
                          <img
                            src={selectedLead.property.imageUrl}
                            alt={selectedLead.property.title}
                            className="lead-property-image"
                          />
                        </div>

                        <h3 className="lead-property-title">{selectedLead.property.title}</h3>
                        <p className="lead-property-address">{selectedLead.property.address}</p>

                        <p className="lead-property-price">
                          {selectedLead.property.price.toLocaleString()} DZD
                          {selectedLead.property.priceUnit && (
                            <span className="lead-property-price-unit"> {selectedLead.property.priceUnit}</span>
                          )}
                        </p>

                        <div className="lead-property-meta">
                          {selectedLead.property.type && (
                            <div className="meta-card">
                              <div className="meta-label">Type</div>
                              <div className="meta-value">{selectedLead.property.type}</div>
                            </div>
                          )}

                          {selectedLead.property.area && (
                            <div className="meta-card">
                              <div className="meta-label">Area</div>
                              <div className="meta-value">{selectedLead.property.area} m²</div>
                            </div>
                          )}

                          {selectedLead.property.bedrooms && (
                            <div className="meta-card">
                              <div className="meta-label">Bedrooms</div>
                              <div className="meta-value">{selectedLead.property.bedrooms}</div>
                            </div>
                          )}

                          {selectedLead.property.bathrooms && (
                            <div className="meta-card">
                              <div className="meta-label">Bathrooms</div>
                              <div className="meta-value">{selectedLead.property.bathrooms}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default LeadsPage;
