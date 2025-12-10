// src/pages/PartnerAccounts.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/PartnerAccounts.css";

import nextPage from "../assets/icons/nextPage.svg";
import backButton from "../assets/icons/back.svg";
import activateIcon from "../assets/icons/active.svg";
import suspendIcon from "../assets/icons/suspended.svg";
import deleteIcon from "../assets/icons/Delete.svg";
import Section from "../components/common/Section.jsx";
import companyIcon from "../assets/icons/companyIcon.svg";
import addressIcon from "../assets/icons/AddressIcon.svg";
import phoneIcon from "../assets/icons/Call.svg";
import emailIcon from "../assets/icons/email.svg";
import actionsIcon from "../assets/icons/Actions.svg";

const USE_MOCK_PARTNERS = true;

function PartnerAccounts() {
  const navigate = useNavigate();

  // ---------------------------
  // LOAD PARTNERS
  // ---------------------------
  const [partners, setPartners] = useState(() => {
    if (!USE_MOCK_PARTNERS) return [];

    try {
      const stored = JSON.parse(localStorage.getItem("partners") || "[]");

      return stored.map((p) => ({
        id: p.id,
        name: p.companyName,
        email: p.email,
        phone_number: p.phoneNumber,
        address: p.address,
        logo: null,
        status: p.status || "active",
      }));
    } catch {
      return [];
    }
  });

  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(partners.length / PAGE_SIZE));

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return partners.slice(start, start + PAGE_SIZE);
  }, [partners, currentPage]);

  // Sync storage in mock mode
  useEffect(() => {
    if (!USE_MOCK_PARTNERS) return;

    const normalized = partners.map((p) => ({
      id: p.id,
      companyName: p.name,
      email: p.email,
      phoneNumber: p.phone_number,
      address: p.address,
      status: p.status,
    }));

    localStorage.setItem("partners", JSON.stringify(normalized));
  }, [partners]);

  // ---------------------------
  // ACTIONS
  // ---------------------------
  const handleAddPartner = () => {
    navigate("/forms-tables/add-partner");
  };

  const toggleStatus = (id) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "suspended" : "active" } : p
      )
    );
  };

  const handleDelete = async (id) => {
    setPartners((prev) => prev.filter((p) => p.id !== id));

    if (!USE_MOCK_PARTNERS) {
      await fetch(`/api/admin/partners/${id}/`, {
        method: "DELETE",
        credentials: "include",
      });
    }
  };

  const handleAddProperty = (id) => {
    navigate(`/forms-tables/add-listing?partnerId=${id}`);
  };

  // Pagination
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 4;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const first = 1;
    const last = totalPages;
    let start = currentPage - 1;
    let end = currentPage + 1;

    if (start < 2) {
      start = 2;
      end = start + (maxVisible - 2);
    }
    if (end > last - 1) {
      end = last - 1;
      start = end - (maxVisible - 2);
    }

    pages.push(first);
    if (start > 2) pages.push("left-ellipsis");

    for (let i = start; i <= end && i < last; i++) {
      pages.push(i);
    }

    if (end < last - 1) pages.push("right-ellipsis");
    pages.push(last);

    return pages;
  };

  const pageItems = getPageNumbers();

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div className="partner-page-wrapper">
      <div className="add-partner-container">
        <div className="partners-header">
          <h1 className="page-title">Partners</h1>
          <button type="button" className="add-partner-main-btn" onClick={handleAddPartner}>
            +
          </button>
        </div>

        <Section>
          <div className="partners-table-wrapper">
            <table className="partners-table">
              <thead>
                <tr>
                  <th>
                    <span className="th-with-icon">
                      <img src={companyIcon} alt="" className="th-icon" />
                      Company Name
                    </span>
                  </th>
                  <th>
                    <span className="th-with-icon">
                      <img src={addressIcon} alt="" className="th-icon" />
                      Address
                    </span>
                  </th>
                  <th>
                    <span className="th-with-icon">
                      <img src={phoneIcon} alt="" className="th-icon" />
                      Phone
                    </span>
                  </th>
                  <th>
                    <span className="th-with-icon">
                      <img src={emailIcon} alt="" className="th-icon" />
                      Email
                    </span>
                  </th>
                  <th className="actions-col-header">
                    <span className="th-with-icon">
                      <img src={actionsIcon} alt="" className="th-icon" />
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentPageItems.map((partner) => (
                  <tr key={partner.id}>
                    <td>{partner.name}</td>
                    <td>{partner.address}</td>
                    <td>{partner.phone_number}</td>
                    <td>{partner.email}</td>

                    <td className="actions-col">
                      <button
                        type="button"
                        className="row-action-btn row-action-add"
                        onClick={() => handleAddProperty(partner.id)}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="row-action-btn row-action-status"
                        onClick={() => toggleStatus(partner.id)}
                      >
                        <img
                          src={partner.status === "suspended" ? suspendIcon : activateIcon}
                          alt={partner.status === "suspended" ? "Activate" : "Suspend"}
                        />
                      </button>

                      <button
                        type="button"
                        className="row-action-btn row-action-delete"
                        onClick={() => handleDelete(partner.id)}
                      >
                        <img src={deleteIcon} alt="Delete" />
                      </button>
                    </td>
                  </tr>
                ))}

                {currentPageItems.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-row">
                      No partners found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>
      </div>

      {/* Pagination */}
      <div className="partners-pagination">
        <button
          className="paging-button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <img src={backButton} alt="back" />
        </button>

        {pageItems.map((item, idx) =>
          typeof item === "string" ? (
            <button key={idx} className="page-dot" disabled>
              ...
            </button>
          ) : (
            <button
              key={item}
              className={`page-dot ${item === currentPage ? "active" : ""}`}
              onClick={() => goToPage(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          className="paging-button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <img src={nextPage} alt="next" />
        </button>
      </div>
    </div>
  );
}

export default PartnerAccounts;
