// src/pages/UserAccounts.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/UserAccounts.css";

import nextPage from "../assets/icons/nextPage.svg";
import backButton from "../assets/icons/back.svg";
import activateIcon from "../assets/icons/active.svg";
import suspendIcon from "../assets/icons/suspended.svg";
import deleteIcon from "../assets/icons/Delete.svg";

import fullnameIcon from "../assets/icons/fullname.svg";
import phoneIcon from "../assets/icons/Call.svg";
import emailIcon from "../assets/icons/email.svg";
import actionsIcon from "../assets/icons/Actions.svg";

import Section from "../components/common/Section.jsx";

// 🔧 SWITCH: true = localStorage mock; false = real /api/admin/users/ backend
const USE_MOCK_USERS = true;

function UserAccounts() {
  const navigate = useNavigate();

  // -------- STATE --------
  const [users, setUsers] = useState(() => {
    if (USE_MOCK_USERS) {
      const stored = localStorage.getItem("users");
      try {
        const parsed = stored ? JSON.parse(stored) : [];
        return parsed.map((u) => ({
          status: u.status || "active",
          ...u,
        }));
      } catch {
        return [];
      }
    }
    // backend mode: start empty; will be filled by fetch
    return [];
  });

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE || 1));
  const [loading, setLoading] = useState(!USE_MOCK_USERS);

  // -------- MOCK MODE: persist to localStorage --------
  useEffect(() => {
    if (!USE_MOCK_USERS) return;
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // -------- BACKEND MODE: fetch /api/admin/users/ --------
  useEffect(() => {
    if (USE_MOCK_USERS) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users/", {
          credentials: "include",
        });
        const data = await res.json();
        // If backend returns {count, results}, handle it
        const list = Array.isArray(data) ? data : data.results || [];
        setUsers(
          list.map((u) => ({
            // map backend fields to UI shape
            id: u.id,
            fullName: u.full_name,
            phoneNumber: u.phone_number,
            email: u.email,
            status: u.status || (u.is_active ? "active" : "suspended"),
          }))
        );
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // -------- DERIVED: sort + paginate --------
  const currentPageItems = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      const aSusp = a.status === "suspended" ? 1 : 0;
      const bSusp = b.status === "suspended" ? 1 : 0;
      return bSusp - aSusp;
    });

    const start = (currentPage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [users, currentPage]);

  // -------- HANDLERS --------
  const toggleStatus = (id) => {
    // NOTE: backend has no status toggle endpoint in the doc yet,
    // so this is UI-only for now in both modes. [attached_file:1]
    setUsers((prev) => {
      const user = prev.find((u) => u.id === id);
      if (!user) return prev;

      const isSuspended = user.status === "suspended";
      const message = isSuspended
        ? "Activate this user account?"
        : "Suspend this user account? The user will not be able to log in.";

      const ok = window.confirm(message);
      if (!ok) return prev;

      return prev.map((u) =>
        u.id === id
          ? { ...u, status: isSuspended ? "active" : "suspended" }
          : u
      );
    });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to permanently delete this user account and all associated data?"
    );
    if (!ok) return;

    // optimistic UI
    setUsers((prev) => prev.filter((u) => u.id !== id));

    if (USE_MOCK_USERS) {
      // localStorage will be updated by the effect above
      return;
    }

    try {
      await fetch(`/api/admin/users/${id}/`, {
        method: "DELETE",
        credentials: "include",
      });
      // Contract says DELETE returns status + userid + message. [attached_file:1]
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
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
    <div className="user-page-wrapper">
      <div className="user-accounts-container">
        <div className="user-accounts-header">
          <h1 className="page-title">User Accounts</h1>
        </div>

        <Section>
          <div className="user-table-wrapper">
            {loading && !USE_MOCK_USERS ? (
              <p className="empty-row">Loading users...</p>
            ) : (
              <table className="user-table">
                <thead>
                  <tr>
                    <th>
                      <span className="th-with-icon">
                        <img src={fullnameIcon} alt="" className="th-icon" />
                        Full Name
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
                    currentPageItems.map((user) => (
                      <tr key={user.id}>
                        <td>{user.fullName || user.full_name}</td>
                        <td>{user.phoneNumber || user.phone_number}</td>
                        <td>{user.email}</td>
                        <td className="actions-col">
                          <button
                            type="button"
                            className="row-action-btn row-action-status"
                            onClick={() => toggleStatus(user.id)}
                          >
                            <img
                              src={
                                user.status === "suspended"
                                  ? suspendIcon
                                  : activateIcon
                              }
                              alt={
                                user.status === "suspended"
                                  ? "Activate account"
                                  : "Suspend account"
                              }
                            />
                          </button>

                          <button
                            type="button"
                            className="row-action-btn row-action-delete"
                            onClick={() => handleDelete(user.id)}
                          >
                            <img src={deleteIcon} alt="Delete account" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="empty-row">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Section>
      </div>

      <div className="user-pagination">
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

export default UserAccounts;
