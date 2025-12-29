// src/pages/PartnerAccounts.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
import { API_BASE_URL } from "/src/config/env.js";

function PartnerAccounts() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  const [partners, setPartners] = useState([]);
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!user || user.role !== "ADMIN") {
      navigate("/not-authorized");
    }
  }, [loading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "ADMIN") return;

    const token = localStorage.getItem("auth_token");

    fetch(`${API_BASE_URL}/api/admin/partners/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setPartners(Array.isArray(data) ? data : []);
      })
      .catch(() => setPartners([]));
  }, [isAuthenticated, user]);

  const totalPages = Math.max(1, Math.ceil(partners.length / PAGE_SIZE));

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return partners.slice(start, start + PAGE_SIZE);
  }, [partners, currentPage]);

  const handleAddPartner = () => {
    navigate("/forms-tables/add-partner");
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("auth_token");

    await fetch(`${API_BASE_URL}/api/admin/partners/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPartners((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleStatus = async (partner) => {
    const token = localStorage.getItem("auth_token");
    const newStatus = partner.status === "active" ? "suspended" : "active";

    const res = await fetch(`${API_BASE_URL}/api/admin/partners/${partner.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) return;

    setPartners((prev) =>
      prev.map((p) =>
        p.id === partner.id ? { ...p, status: newStatus } : p
      )
    );
  };

  const handleAddProperty = (id) => {
    navigate(`/forms-tables/add-listing?partnerId=${id}`);
  };

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
    if (start > 2) pages.push("left");

    for (let i = start; i <= end && i < last; i++) pages.push(i);

    if (end < last - 1) pages.push("right");
    pages.push(last);

    return pages;
  };

  const pageItems = getPageNumbers();

  if (loading) return null;

  return (
    <div className="partner-page-wrapper">
      <div className="add-partner-container">
        <div className="partners-header">
          <h1 className="page-title">Partners</h1>
          <button className="add-partner-main-btn" onClick={handleAddPartner}>
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
                        className="row-action-btn row-action-add"
                        onClick={() => handleAddProperty(partner.id)}
                      >
                        +
                      </button>

                      <button
                        className="row-action-btn row-action-status"
                        onClick={() => toggleStatus(partner)}
                      >
                        <img
                          src={
                            partner.status === "suspended"
                              ? suspendIcon
                              : activateIcon
                          }
                          alt=""
                        />
                      </button>

                      <button
                        className="row-action-btn row-action-delete"
                        onClick={() => handleDelete(partner.id)}
                      >
                        <img src={deleteIcon} alt="" />
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

      <div className="partners-pagination">
        <button
          className="paging-button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <img src={backButton} alt="" />
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
          <img src={nextPage} alt="" />
        </button>
      </div>
    </div>
  );
}

export default PartnerAccounts;
