import React, { useState } from "react";
import Login from "./components/Login";
import StudentTable from "./components/StudentTable";

function App() {
  const [jwt, setJwt] = useState(null);
  const [username, setUsername] = useState("");

  const handleLoginSuccess = (tokenFromServer, usernameFromForm) => {
    setJwt(tokenFromServer);
    setUsername(usernameFromForm);
  };

  const handleSignOut = () => {
    setJwt(null);
    setUsername("");
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      {jwt ? (
        <StudentTable
          jwt={jwt}
          username={username}
          onSignOut={handleSignOut}
        />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;

