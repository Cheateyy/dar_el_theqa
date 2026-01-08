import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
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
import { API_BASE_URL } from "../config/env";

function UserAccounts() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (!user || String(user.role).toUpperCase() !== "ADMIN") {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated, user, navigate]);

  const PAGE_SIZE = 10;
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    fetch(`${API_BASE_URL}/api/admin/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setUsers(
          list.map((u) => ({
            id: u.id,
            full_name: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
            phone_number: u.phone_number,
            email: u.email,
            status: u.is_active ? "active" : "suspended",
          }))
        );
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aSusp = a.status === "suspended" ? 1 : 0;
      const bSusp = b.status === "suspended" ? 1 : 0;
      return bSusp - aSusp;
    });
  }, [users]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
  const currentPageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedUsers.slice(start, start + PAGE_SIZE);
  }, [sortedUsers, currentPage]);

  const toggleStatus = async (user) => {
    const token = localStorage.getItem("auth_token");

    const newIsActive = user.status !== "active";

    const res = await fetch(`${API_BASE_URL}/api/admin/users/${user.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_active: newIsActive }),
    });

    if (!res.ok) {
      console.error("Failed to update user status");
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: newIsActive ? "active" : "suspended" }
          : u
      )
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    const token = localStorage.getItem("auth_token");

    await fetch(`${API_BASE_URL}/api/admin/users/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers((prev) => prev.filter((u) => u.id !== id));
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

  if (loading || loadingUsers) return null;

  return (
    <div className="user-page-wrapper">
      <div className="user-accounts-container">
        <h1 className="page-title">User Accounts</h1>

        <Section>
          <div className="user-table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>
                    <img src={fullnameIcon} alt="" /> Full Name
                  </th>
                  <th>
                    <img src={phoneIcon} alt="" /> Phone
                  </th>
                  <th>
                    <img src={emailIcon} alt="" /> Email
                  </th>
                  <th>
                    <img src={actionsIcon} alt="" /> Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentPageItems.length > 0 ? (
                  currentPageItems.map((u) => (
                    <tr key={u.id}>
                      <td>{u.full_name}</td>
                      <td>{u.phone_number}</td>
                      <td>{u.email}</td>
                      <td className="actions-col">
                        <button
                          onClick={() => toggleStatus(u)}
                          className="row-action-btn"
                        >
                          <img
                            src={
                              u.status === "suspended"
                                ? suspendIcon
                                : activateIcon
                            }
                            alt=""
                          />
                        </button>

                        <button
                          onClick={() => handleDelete(u.id)}
                          className="row-action-btn"
                        >
                          <img src={deleteIcon} alt="" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-row">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>
                </div>
        <div className="user-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="paging-button"
          >
            <img src={backButton} alt="" />
          </button>

          {pageItems.map((p) => (
                  <button
                    key={p}
                    className={`page-dot ${p === currentPage ? "active" : ""}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                ))}

          <button
            className="paging-button"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            <img src={nextPage} alt="" />
          </button>
        </div>
      
    </div>
  );
}

export default UserAccounts;
