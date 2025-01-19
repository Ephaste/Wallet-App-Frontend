import styles from "./auth.module.scss";
import registerImg from "../../assets/sign-up.jpeg";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    account: '',
    accountno: ''
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (/^\d+$/.test(formData.name)) {
      setErrorMessage("Name must not be numbers only");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    try {
      await axios.post("http://localhost:150/api/accounts/register", formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert("Account created successfully");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.error || "Registration failed. Please try again.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <section className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2>Register The account</h2>
          {errorMessage && <p className="error-message" style={{color: "red"}}>{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              required
            />
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={handleChange}
              placeholder="Enter Your Account Name"
              required
            />
            <input
              type="text"
              name="accountno"
              value={formData.accountno}
              onChange={handleChange}
              placeholder="Enter The account number"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Register
            </button>
          </form>
          <span className={styles.register}>
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </span>
        </div>
      </Card>
      <div className={styles.img}>
        <img src={registerImg} alt="Register" width="400" />
      </div>
    </section>
  );
};

export default Register;
