import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./auth.module.scss";
import loginImg from "../../assets/login.png";
import Card from "../../components/card/Card";

const Login = () => {
  const [formData, setFormData] = useState({
    accountno: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
  
    try {
      const res = await axios.post("https://wallet-app-backend-8.onrender.com/api/accounts/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Server response:", res);
  
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log("Token stored in localStorage:", res.data.token);
        navigate("/dashboardadmin");
      } else {
        setErrorMessage("Login failed: No token received.");
      }
    } catch (error) {
      console.error("Error during login:", error);
  
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Login failed.");
      }
       else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  return (
    <section className={`container ${styles.auth}`}>
      <div className={styles.img}>
        <img src={loginImg} alt="Login" width="400" />
      </div>
      <Card>
        <div className={styles.form}>
          <h2>Login</h2>
          {errorMessage && <p className="error-message" style={{ color: "red" }}>{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="accountno"
              placeholder="Account Number"
              value={formData.accountno}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Login
            </button>
            <div className={styles.links}>
              <Link to="/reset">Reset password</Link>
            </div>
            <p>-- or --</p>
          </form>
          <button className="--btn --btn-danger --btn-block">
            Login with Google
          </button>
          <span className={styles.register}>
            <p>Don't have an account?</p> <Link to="/register">Register</Link>
          </span>
        </div>
      </Card>
    </section>
  );
};

export default Login;
