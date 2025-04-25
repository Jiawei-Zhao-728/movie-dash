import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to MovieDash</h1>
        <p>Please sign in to continue</p>
        <button className="google-btn" onClick={login}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google logo"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
