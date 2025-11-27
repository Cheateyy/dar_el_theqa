// src/pages/LeadsPage.jsx
import React, { useState, useMemo } from "react";
import "../assets/styles/LeadMessages.css";
import nextPage from "../assets/icons/nextPage.svg";
import backButton from "../assets/icons/back.svg";

import dateIcon from "../assets/icons/Calender.svg";
import listingIcon from "../assets/icons/listing.svg";
import clientIcon from "../assets/icons/fullname.svg";
import phoneIcon from "../assets/icons/Call.svg";
import closeIcon from "../assets/icons/removeimage.png";
import propertyImage from "../assets/images/propertyimage.jpg";

const MOCK_LEADS = [
  {
    id: 1,
    date: "2025-11-22",
    listingTitle: "FreeBlood",
    clientFullName: "George R R Martin",
    phoneNumber: "+213 560 30 47 77",
    email: "client@mail.com",
    message:
      "message from client lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    property: {
      title: "Property title",
      address: "Address Lorem ipsum, Region, Wilaya",
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

function LeadsPage() {
  const [leads] = useState(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const sortedLeads = useMemo(
    () =>
      [...leads].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [leads]
  );

  const totalPages = Math.max(1, Math.ceil(sortedLeads.length / PAGE_SIZE));

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedLeads.slice(start, start + PAGE_SIZE);
  }, [sortedLeads, currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRowClick = (lead) => setSelectedLead(lead);
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

    if (start > 2) {
      pages.push("left-ellipsis");
    }

    for (let i = start; i <= end && i < lastPage; i++) {
      pages.push(i);
    }

    if (end < lastPage - 1) {
      pages.push("right-ellipsis");
    }

    pages.push(lastPage);

    return pages;
  };

  const pageItems = getPageNumbers();

  return (
    <div className="leads-page-wrapper">
      <div className="leads-container">
        <div className={`leads-main-layout ${selectedLead ? 'has-details' : ''}`}>
          <div className="leads-table-column">
            <div className="leads-table-section">
              <h1 className="page-title">Lead Messages</h1>

              <div className="leads-table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>
                        <span className="th-with-icon">
                          <img src={dateIcon} alt="" className="th-icon" />
                          Date
                        </span>
                      </th>
                      <th>
                        <span className="th-with-icon">
                          <img src={listingIcon} alt="" className="th-icon" />
                          Listing Title
                        </span>
                      </th>
                      <th>
                        <span className="th-with-icon">
                          <img src={clientIcon} alt="" className="th-icon" />
                          Client
                        </span>
                      </th>
                      <th>
                        <span className="th-with-icon">
                          <img src={phoneIcon} alt="" className="th-icon" />
                          Phone Number
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageItems.length > 0 ? (
                      currentPageItems.map((lead) => (
                        <tr
                          key={lead.id}
                          className={selectedLead && selectedLead.id === lead.id ? "selected" : ""}
                          onClick={() => handleRowClick(lead)}
                        >
                          <td>{lead.date}</td>
                          <td>{lead.listingTitle}</td>
                          <td>{lead.clientFullName}</td>
                          <td>{lead.phoneNumber}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="empty-row">
                          No lead messages found.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
              </div>
            </div>

            <div className="leads-pagination">
              <button
                className="paging-button"
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <img src={backButton} alt="back" />
              </button>

              {pageItems.map((item, idx) => {
                if (typeof item === "string") {
                  return (
                    <button
                      key={item + idx}
                      type="button"
                      className="page-dot"
                      disabled
                    >
                      ...
                    </button>
                  );
                }
                const page = item;
                return (
                  <button
                    key={page}
                    type="button"
                    className={`page-dot ${page === currentPage ? "active" : ""}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                className="paging-button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <img src={nextPage} alt="next" />
              </button>
            </div>
          </div>          {selectedLead && (
            <div className="lead-details-card">
              <div className="lead-details-panel">
                <button
                  type="button"
                  className="close-panel-btn"
                  onClick={handleClosePanel}
                  aria-label="Close details"
                >
                  <img src={closeIcon} alt="Close" />
                </button>

                <div className="lead-client-info">
                  <h2 className="lead-client-name">{selectedLead.clientFullName}</h2>
                  <p className="lead-client-phone">{selectedLead.phoneNumber}</p>
                  <p className="lead-client-email">{selectedLead.email}</p>
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
                      <span className="lead-property-price-unit"> {selectedLead.property.priceUnit}</span>
                    </p>

                    <div className="lead-property-meta">
                      <div className="meta-card">
                        <div>
                          <div className="meta-label">Type</div>
                          <div className="meta-value">{selectedLead.property.type}</div>
                        </div>
                      </div>

                      <div className="meta-card">
                        <div>
                          <div className="meta-label">Area</div>
                          <div className="meta-value">{selectedLead.property.area} m²</div>
                        </div>
                      </div>

                      <div className="meta-card">
                        <div>
                          <div className="meta-label">Bedrooms</div>
                          <div className="meta-value">{selectedLead.property.bedrooms}</div>
                        </div>
                      </div>

                      <div className="meta-card">
                        <div>
                          <div className="meta-label">Bathrooms</div>
                          <div className="meta-value">{selectedLead.property.bathrooms}</div>
                        </div>
                      </div>
                    </div>
                  </div>
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
