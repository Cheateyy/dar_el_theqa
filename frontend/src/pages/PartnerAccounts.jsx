// src/pages/PartnerAccounts.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/PartnerAccounts.css";
import nextPage from "../assets/icons/nextPage.svg";
import backButton from "../assets/icons/back.svg";
import activateIcon from "../assets/icons/active.svg"; 
import suspendIcon from "../assets/icons/suspended.svg"; 
import deleteIcon from "../assets/icons/delete.svg"; 
import Section from "../components/common/Section.jsx";
import companyIcon from "../assets/icons/companyIcon.svg";
import addressIcon from "../assets/icons/AddressIcon.svg";
import phoneIcon from "../assets/icons/Call.svg";
import emailIcon from "../assets/icons/email.svg";
import actionsIcon from "../assets/icons/actions.svg";

function PartnerAccounts() {
  const navigate = useNavigate();

  const [partners, setPartners] = useState(() => {
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
  });

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(partners.length / PAGE_SIZE));

  useEffect(() => {
    localStorage.setItem("partners", JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    const reload = () => {
      try {
        const stored = localStorage.getItem("partners");
        const parsed = stored ? JSON.parse(stored) : [];
        setPartners(parsed.map((p) => ({ status: p.status || "active", ...p })));
      } catch (err) {
        
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

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return partners.slice(start, start + PAGE_SIZE);
  }, [partners, currentPage]);

  const handleAddPartner = () => {
    navigate("/add-partner");
  };

  const toggleStatus = (id) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "suspended" ? "active" : "suspended" }
          : p
      )
    );
  };


  const handleDelete = (id) => {
    setPartners((prev) => prev.filter((p) => p.id !== id));
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
                      <td>{partner.companyName}</td>
                      <td>{partner.address}</td>
                      <td>{partner.phoneNumber}</td>
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
    </div>
  );
}

export default PartnerAccounts;
