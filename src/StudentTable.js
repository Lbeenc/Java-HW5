import React, { useEffect, useMemo, useState } from "react";
import SearchBox from "./SearchBox";

export default function StudentTable({ jwt, username, onSignOut }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:8080/students", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          setError("Session expired. Please log in again.");
          onSignOut();
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setStudents(data);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load students");
      } finally {
        setLoading(false);
      }
    }

    if (jwt) {
      fetchStudents();
    }
  }, [jwt, onSignOut]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;

    return students.filter((s) => {
      const id = String(s.studentId ?? s.id ?? "").toLowerCase();
      const name = String(s.name ?? "").toLowerCase();
      const major = String(s.major ?? "").toLowerCase();
      // Intentionally ignore Year (same as HW4)
      return id.includes(q) || name.includes(q) || major.includes(q);
    });
  }, [students, searchTerm]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h1>Students</h1>
        <div>
          {username && (
            <span style={{ marginRight: 12 }}>Hello, {username}</span>
          )}
          <button onClick={onSignOut}>Sign Out</button>
        </div>
      </div>

      <SearchBox value={searchTerm} onChange={setSearchTerm} />

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "crimson" }}>Error: {error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <p>No students found.</p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th>StudentId</th>
              <th>Name</th>
              <th>Major</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.studentId ?? s.id}>
                <td>{s.studentId ?? s.id}</td>
                <td>{s.name}</td>
                <td>{s.major}</td>
                <td>{s.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
