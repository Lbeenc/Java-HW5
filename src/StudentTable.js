// src/StudentTable.js
import React, { useEffect, useState } from "react";

function StudentTable({ jwt, username, onSignOut }) {
  const [students, setStudents] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("http://localhost:8080/students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      });

      if (response.status === 401 || response.status === 403) {
        // Token invalid/expired – force logout
        setErrorMsg("Your session has expired. Please log in again.");
        onSignOut();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Error while loading students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jwt) {
      loadStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt]);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h2>Student Table</h2>
        <div>
          {username && <span style={{ marginRight: "1rem" }}>Hello, {username}</span>}
          <button onClick={onSignOut}>Sign Out</button>
        </div>
      </div>

      {loading && <p>Loading students...</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {!loading && students.length === 0 && !errorMsg && (
        <p>No students found.</p>
      )}

      {students.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Id</th>
              <th>Student Name</th>
              <th>GPA</th>
              {/* add other columns if your hw4 had more */}
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.gpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentTable;
