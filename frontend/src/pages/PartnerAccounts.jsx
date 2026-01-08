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

  const PAGE_SIZE = 1;

  const [partners, setPartners] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  /* ===================== AUTH GUARD ===================== */
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

  /* ===================== FETCH PARTNERS ===================== */
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "ADMIN") return;

    const token = localStorage.getItem("auth_token");

    fetch(`${API_BASE_URL}/api/admin/partners/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPartners(Array.isArray(data) ? data : []);
      })
      .catch(() => setPartners([]));
  }, [isAuthenticated, user]);

  /* ===================== FETCH USERS ===================== */
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "ADMIN") return;

    const token = localStorage.getItem("auth_token");

    fetch(`${API_BASE_URL}/api/admin/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setUsers(list);
      })
      .catch(() => setUsers([]));
  }, [isAuthenticated, user]);

  /* ===================== HELPERS ===================== */
  const getPartnerUser = (partner) =>
    users.find((u) => u.email === partner.email);

  const totalPages = Math.max(1, Math.ceil(partners.length / PAGE_SIZE));

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return partners.slice(start, start + PAGE_SIZE);
  }, [partners, currentPage]);

  /* ===================== ACTIONS ===================== */
  const handleAddPartner = () => {
    navigate("/forms-tables/add-partner");
  };

  const handleAddProperty = (partnerId) => {
    navigate(`/forms-tables/add-listing?partner_id=${partnerId}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this partner permanently?")) return;

    const token = localStorage.getItem("auth_token");

    await fetch(`${API_BASE_URL}/api/admin/partners/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPartners((prev) => prev.filter((p) => p.id !== id));
  };

  /* ===================== STATUS TOGGLE (REAL FIX) ===================== */
  const toggleStatus = async (partner) => {
    const partnerUser = getPartnerUser(partner);

    if (!partnerUser) {
      alert("No user account linked to this partner.");
      return;
    }

    const token = localStorage.getItem("auth_token");
    const newIsActive = !partnerUser.is_active;

    const res = await fetch(
      `${API_BASE_URL}/api/admin/users/${partnerUser.id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: newIsActive }),
      }
    );

    if (!res.ok) {
      console.error("Failed to update partner user status");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === partnerUser.id
          ? { ...u, is_active: newIsActive }
          : u
      )
    );
  };

  /* ===================== PAGINATION ===================== */
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

    pages.push(1);
    if (currentPage > 3) pages.push("...");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const pageItems = getPageNumbers();

  if (loading) return null;

  /* ===================== RENDER ===================== */
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
                  <th><img src={companyIcon} alt="" /> Company</th>
                  <th><img src={addressIcon} alt="" /> Address</th>
                  <th><img src={phoneIcon} alt="" /> Phone</th>
                  <th><img src={emailIcon} alt="" /> Email</th>
                  <th><img src={actionsIcon} alt="" /> Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentPageItems.map((partner) => {
                  const partnerUser = getPartnerUser(partner);

                  return (
                    <tr key={partner.id}>
                      <td>{partner.name}</td>
                      <td>{partner.address || "-"}</td>
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
                          disabled={!partnerUser}
                          title={!partnerUser ? "No linked user" : ""}
                        >
                          <img
                            src={
                              partnerUser?.is_active
                                ? activateIcon
                                : suspendIcon
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
                  );
                })}

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

        {pageItems.map((p, i) =>
          p === "..." ? (
            <button key={i} className="page-dot" disabled>…</button>
          ) : (
            <button
              key={p}
              className={`page-dot ${p === currentPage ? "active" : ""}`}
              onClick={() => goToPage(p)}
            >
              {p}
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
