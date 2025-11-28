import React, { useEffect, useMemo, useState } from "react";
import "./Users.css";

const Users = () => {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch users from your .NET API (MongoDB backend)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://localhost:7099/api/Users"); // change to your actual API URL
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();

        // Map MongoDB/Backend user model fields to front-end fields
        const mappedUsers = data.map((u) => ({
          id: u.id ?? u._id ?? "",
          name: u.name ?? "",
          email: u.email ?? "",
          role: u.role ?? "User",
          status: u.status ?? "Active",
          joined: u.joined ? u.joined.split("T")[0] : "",
        }));

        setUsers(mappedUsers);
      } catch (err) {
        setError("Could not load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Filtering logic (search, role, status)
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesQ = `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase());
      const matchesRole = role === "All" || u.role === role;
      const matchesStatus = status === "All" || u.status === status;
      return matchesQ && matchesRole && matchesStatus;
    });
  }, [users, q, role, status]);

  // 🔹 UI Rendering
  return (
    <section className="card users-card">
      <div className="users-toolbar">
        <input
          className="users-search"
          type="text"
          placeholder="Search by name or email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="users-filters">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>All</option>
            <option>User</option>
            <option>Vendor</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
        </div>
      </div>

      {error && <div className="empty" style={{ marginTop: 8, color: "#991b1b" }}>{error}</div>}

      <div className="table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="empty">Loading users...</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="empty">No users found</td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id}>
                {/* <td>{u.id}</td> */}
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="pill pill-muted">{u.role}</span>
                </td>
                <td>
                  <span
                    className={`pill ${
                      u.status === "Active"
                        ? "pill-green"
                        : u.status === "Pending"
                        ? "pill-amber"
                        : "pill-red"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td>{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Users;
