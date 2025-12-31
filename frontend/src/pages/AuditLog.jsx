import React, { useState, useEffect, useMemo } from "react";
import "../assets/styles/AuditLog.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "/src/config/env.js";
import { TokenManager } from "../services/authService";

import nextPage from "../assets/icons/nextPage.svg";
import backButton from "../assets/icons/back.svg";

import adminIcon from "../assets/icons/fullname.svg";
import dateIcon from "../assets/icons/Calender.svg";
import timeIcon from "../assets/icons/time.svg";
import actionIcon from "../assets/icons/AuditAction.svg";

import Section from "../components/common/Section.jsx";

const USE_MOCK_AUDIT = false;

function AuditLog() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  /* ---------------- AUTH GUARD (ADMIN ONLY) ---------------- */
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (!user || user.role !== "ADMIN") {
      navigate("/not-authorized", { replace: true });
    }
  }, [loading, isAuthenticated, user, navigate]);

  /* ---------------- STATE ---------------- */
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [loadingData, setLoadingData] = useState(!USE_MOCK_AUDIT);

  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));

  /* ---------------- FETCH AUDIT LOGS ---------------- */
  useEffect(() => {
    if (USE_MOCK_AUDIT || loading || !isAuthenticated || user?.role !== "ADMIN")
      return;

    const fetchAuditLogs = async () => {
      try {
        const token = TokenManager.get();

        const res = await fetch(
          `${API_BASE_URL}/api/admin/audit-logs/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch audit logs");
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];

        const mapped = list.map((e) => {
          const created = e.created_at ? new Date(e.created_at) : null;
          const date =
            created && !Number.isNaN(created.getTime())
              ? created.toISOString().slice(0, 10)
              : "";
          const time =
            created && !Number.isNaN(created.getTime())
              ? created.toISOString().slice(11, 19)
              : "";

          return {
            id: e.id,
            adminName: e.admin_name || "Admin",
            date,
            time,
            action: `${e.action_type} – ${e.description}`,
          };
        });

        setEntries(mapped);
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAuditLogs();
  }, [USE_MOCK_AUDIT, loading, isAuthenticated, user]);

  /* ---------------- PAGINATION ---------------- */
  const currentPageItems = useMemo(() => {
    const sorted = [...entries].sort((a, b) => {
      const aTs = new Date(`${a.date} ${a.time}`).getTime();
      const bTs = new Date(`${b.date} ${b.time}`).getTime();
      return bTs - aTs;
    });

    const start = (currentPage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [entries, currentPage]);

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

    if (currentPage > 3) pages.push("left");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("right");

    pages.push(totalPages);
    return pages;
  };

  const pageItems = getPageNumbers();

  /* ---------------- RENDER ---------------- */
  if (loading) return null;

  return (
    <div className="audit-page-wrapper">
      <div className="audit-container">
        <div className="audit-header">
          <h1 className="page-title">Audit Log</h1>
        </div>

        <Section>
          <div className="audit-table-wrapper">
            {loadingData ? (
              <p className="empty-row">Loading audit events...</p>
            ) : (
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>
                      <span className="th-with-icon">
                        <img src={adminIcon} alt="" className="th-icon" />
                        Admin Name
                      </span>
                    </th>
                    <th>
                      <span className="th-with-icon">
                        <img src={dateIcon} alt="" className="th-icon" />
                        Date
                      </span>
                    </th>
                    <th>
                      <span className="th-with-icon">
                        <img src={timeIcon} alt="" className="th-icon" />
                        Time
                      </span>
                    </th>
                    <th>
                      <span className="th-with-icon">
                        <img src={actionIcon} alt="" className="th-icon" />
                        Action
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentPageItems.length > 0 ? (
                    currentPageItems.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.adminName}</td>
                        <td>{entry.date}</td>
                        <td>{entry.time}</td>
                        <td>{entry.action}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="empty-row">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Section>
      </div>

      <div className="audit-pagination">
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

export default AuditLog;
