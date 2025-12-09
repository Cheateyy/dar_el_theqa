// src/pages/UserAccounts.jsx
import React, { useState, useMemo, useEffect } from "react";
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

const USE_MOCK_USERS = true;

function UserAccounts() {
  const PAGE_SIZE = 10;

  // ------------------------------------------------------------
  // LOAD USERS (Mock or Backend)
  // ------------------------------------------------------------
  const [users, setUsers] = useState(() => {
    if (!USE_MOCK_USERS) return [];

    try {
      const stored = JSON.parse(localStorage.getItem("users") || "[]");
      return stored.map((u) => ({
        id: u.id,
        full_name: u.full_name,
        phone_number: u.phone_number,
        email: u.email,
        status: u.status || "active",
      }));
    } catch {
      return [];
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(!USE_MOCK_USERS);

  // ------------------------------------------------------------
  // SAVE MOCK USERS
  // ------------------------------------------------------------
  useEffect(() => {
    if (!USE_MOCK_USERS) return;

    const normalized = users.map((u) => ({
      id: u.id,
      full_name: u.full_name,
      phone_number: u.phone_number,
      email: u.email,
      status: u.status,
    }));

    localStorage.setItem("users", JSON.stringify(normalized));
  }, [users]);

  // ------------------------------------------------------------
  // FETCH USERS FROM BACKEND
  // ------------------------------------------------------------
  useEffect(() => {
    if (USE_MOCK_USERS) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users/", {
          credentials: "include",
        });

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];

        setUsers(
          list.map((u) => ({
            id: u.id,
            full_name: u.full_name,
            phone_number: u.phone_number,
            email: u.email,
            status: u.is_active ? "active" : "suspended",
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

  // ------------------------------------------------------------
  // PAGINATION + SORTING (Suspended on top)
  // ------------------------------------------------------------
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aSusp = a.status === "suspended" ? 1 : 0;
      const bSusp = b.status === "suspended" ? 1 : 0;
      return bSusp - aSusp;
    });
  }, [users]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedUsers.length / PAGE_SIZE || 1)
  );

  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedUsers.slice(start, start + PAGE_SIZE);
  }, [sortedUsers, currentPage]);

  // ------------------------------------------------------------
  // ACTION: Toggle Active/Suspended
  // ------------------------------------------------------------
  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "active" ? "suspended" : "active",
            }
          : u
      )
    );
  };

  // ------------------------------------------------------------
  // ACTION: DELETE USER
  // ------------------------------------------------------------
  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );
    if (!ok) return;

    setUsers((prev) => prev.filter((u) => u.id !== id));

    if (!USE_MOCK_USERS) {
      try {
        await fetch(`/api/admin/users/${id}/`, {
          method: "DELETE",
          credentials: "include",
        });
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  // ------------------------------------------------------------
  // Pagination buttons
  // ------------------------------------------------------------
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
      end = start + 2;
    }
    if (end > last - 1) {
      end = last - 1;
      start = end - 2;
      if (start < 2) start = 2;
    }

    pages.push(first);
    if (start > 2) pages.push("left");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < last - 1) pages.push("right");
    pages.push(last);

    return pages;
  };

  const pageItems = getPageNumbers();

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
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
                        <img src={fullnameIcon} className="th-icon" alt="" />
                        Full Name
                      </span>
                    </th>
                    <th>
                      <span className="th-with-icon">
                        <img src={phoneIcon} className="th-icon" alt="" />
                        Phone Number
                      </span>
                    </th>
                    <th>
                      <span className="th-with-icon">
                        <img src={emailIcon} className="th-icon" alt="" />
                        Email
                      </span>
                    </th>
                    <th className="actions-col-header">
                      <span className="th-with-icon">
                        <img src={actionsIcon} className="th-icon" alt="" />
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentPageItems.length > 0 ? (
                    currentPageItems.map((user) => (
                      <tr key={user.id}>
                        <td>{user.full_name}</td>
                        <td>{user.phone_number}</td>
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
                                  ? "Activate"
                                  : "Suspend"
                              }
                            />
                          </button>

                          <button
                            type="button"
                            className="row-action-btn row-action-delete"
                            onClick={() => handleDelete(user.id)}
                          >
                            <img src={deleteIcon} alt="Delete" />
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

export default UserAccounts;
