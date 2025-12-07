// src/App.js
import React, { useState } from "react";
import Login from "./Login";
import StudentTable from "./StudentTable";

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
    <div className="App">
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
