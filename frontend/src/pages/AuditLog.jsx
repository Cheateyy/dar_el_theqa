// src/pages/AuditLog.jsx
import React, { useState, useEffect, useMemo } from "react";
import "../assets/styles/AuditLog.css";

import nextPage from "../assets/icons/nextPage.svg";
import backButton from "../assets/icons/back.svg";

import adminIcon from "../assets/icons/fullname.svg";
import dateIcon from "../assets/icons/Calender.svg";
import timeIcon from "../assets/icons/time.svg";
import actionIcon from "../assets/icons/AuditAction.svg";

import Section from "../components/common/Section.jsx";

// 🔧 SWITCH: true = localStorage mock; false = real /admin/audit-logs/ backend
const USE_MOCK_AUDIT = true;

function AuditLog() {
  const [entries, setEntries] = useState(() => {
    if (USE_MOCK_AUDIT) {
      const stored = localStorage.getItem("auditLog");
      try {
        const parsed = stored ? JSON.parse(stored) : [];
        return parsed;
      } catch {
        return [];
      }
    }
    // backend mode: start empty, will be filled by fetch
    return [];
  });

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE || 1));
  const [loading, setLoading] = useState(!USE_MOCK_AUDIT);

  // -------- MOCK MODE: persist to localStorage --------
  useEffect(() => {
    if (!USE_MOCK_AUDIT) return;
    localStorage.setItem("auditLog", JSON.stringify(entries));
  }, [entries]);

  // -------- BACKEND MODE: fetch /admin/audit-logs/ --------
  useEffect(() => {
    if (USE_MOCK_AUDIT) return;

    const fetchAuditLogs = async () => {
      try {
        const res = await fetch("/admin/audit-logs/", {
          credentials: "include",
        });
        const data = await res.json();
        // Spec shows array; but if it's paginated {count, results}, handle both. [attached_file:1]
        const list = Array.isArray(data) ? data : data.results || [];

        // Map backend fields to the shape used in the table
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
            adminName: e.admin_name,
            date,
            time,
            action: `${e.action_type} – ${e.description}`,
          };
        });

        setEntries(mapped);
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  // -------- DERIVED: sort + paginate --------
  const currentPageItems = useMemo(() => {
    const sorted = [...entries].sort((a, b) => {
      const aTs = new Date(`${a.date} ${a.time}`).getTime();
      const bTs = new Date(`${b.date} ${b.time}`).getTime();
      return bTs - aTs; // newest first
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
    <div className="audit-page-wrapper">
      <div className="audit-container">
        <div className="audit-header">
          <h1 className="page-title">Audit Log</h1>
        </div>

        <Section>
          <div className="audit-table-wrapper">
            {loading && !USE_MOCK_AUDIT ? (
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

export default AuditLog;
