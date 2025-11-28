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

// 🔧 SWITCH: true = localStorage mock (no backend yet)
//            false = real backend /api/admin/partners/ (when ready)
const USE_MOCK_PARTNERS = true;

function PartnerAccounts() {
  const navigate = useNavigate();

  // -------- STATE --------
  const [partners, setPartners] = useState(() => {
    if (USE_MOCK_PARTNERS) {
      const stored = localStorage.getItem("partners");
      try {
        const parsed = stored ? JSON.parse(stored) : [];
        return parsed.map((p) => ({
          status: p.status || "active",
          ...p,
        }));
      } catch {
        return [];
      }
    }
    // backend mode: start empty, will be filled by fetch
    return [];
  });

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(partners.length / PAGE_SIZE || 1));

  const [loading, setLoading] = useState(!USE_MOCK_PARTNERS);

  // -------- MOCK MODE: keep partners in localStorage & sync tabs --------
  useEffect(() => {
    if (!USE_MOCK_PARTNERS) return;
    localStorage.setItem("partners", JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    if (!USE_MOCK_PARTNERS) return;

    const reload = () => {
      try {
        const stored = localStorage.getItem("partners");
        const parsed = stored ? JSON.parse(stored) : [];
        setPartners(parsed.map((p) => ({ status: p.status || "active", ...p })));
      } catch {
        // ignore
      }
    };

    reload();

    const onStorage = (e) => {
      if (e.key === "partners") reload();
    };
    const onVisibility = () => {
      if (!document.hidden) reload();
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // -------- BACKEND MODE: fetch partners from /api/admin/partners/ --------
  useEffect(() => {
    if (USE_MOCK_PARTNERS) return;

    const fetchPartners = async () => {
      try {
        const res = await fetch("/api/admin/partners/", {
          credentials: "include",
        });
        const data = await res.json();
        // If backend uses pagination {count, results}, handle it
        const list = Array.isArray(data) ? data : data.results || [];
        setPartners(
          list.map((p) => ({
            status: p.status || "active",
            ...p,
          }))
        );
      } catch (err) {
        console.error("Failed to load partners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // -------- DERIVED: current page items --------
  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return partners.slice(start, start + PAGE_SIZE);
  }, [partners, currentPage]);

  // -------- HANDLERS --------
  const handleAddPartner = () => {
    navigate("/add-partner");
  };

  const toggleStatus = (id) => {
    // purely UI state; backend has no status endpoint defined yet
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "suspended" ? "active" : "suspended" }
          : p
      )
    );
  };

  const handleDelete = async (id) => {
    // optimistic UI in both modes
    setPartners((prev) => prev.filter((p) => p.id !== id));

    if (USE_MOCK_PARTNERS) {
      // localStorage will be updated by the effect above
      return;
    }

    try {
      await fetch(`/api/admin/partners/${id}/`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to delete partner:", err);
    }
  };

  const handleAddProperty = (id) => {
    navigate(`/add-listing?partnerId=${id}`);
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

  // -------- RENDER --------
  return (
    <div className="partner-page-wrapper">
      <div className="add-partner-container">
        <div className="partners-header">
          <h1 className="page-title">Partners</h1>

          <button
            type="button"
            className="add-partner-main-btn"
            onClick={handleAddPartner}
          >
            +
          </button>
        </div>

        <Section>
          <div className="partners-table-wrapper">
            {loading && !USE_MOCK_PARTNERS ? (
              <p className="empty-row">Loading partners...</p>
            ) : (
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
                        Phone Number
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
                  {currentPageItems.length > 0 ? (
                    currentPageItems.map((partner) => (
                      <tr key={partner.id}>
                        <td>{partner.companyName || partner.name}</td>
                        <td>{partner.address}</td>
                        <td>{partner.phoneNumber || partner.phone_number}</td>
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
                              src={
                                partner.status === "suspended"
                                  ? suspendIcon
                                  : activateIcon
                              }
                              alt={
                                partner.status === "suspended"
                                  ? "Activate account"
                                  : "Suspend account"
                              }
                            />
                          </button>

                          <button
                            type="button"
                            className="row-action-btn row-action-delete"
                            onClick={() => handleDelete(partner.id)}
                          >
                            <img src={deleteIcon} alt="Delete account" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="empty-row">
                        No partners found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Section>
      </div>

      <div className="partners-pagination">
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
              className={`page-dot ${
                page === currentPage ? "active" : ""
              }`}
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
    </div>
  );
}

export default PartnerAccounts;
