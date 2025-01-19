import React, { useState, useEffect } from 'react';
import styles from "../auth/auth.module.scss";
import Card from '../../components/card/Card';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct default import

const MakeIncome = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    description: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      try {
        const decodedToken = jwtDecode(token); // Decode the token
        const userId = decodedToken.id;

        const response = await axios.get(`https://wallet-app-backend-8.onrender.com/api/accounts/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUser(response.data);
      } catch (error) {
       
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      setError("User not authenticated.");
      return;
    }

    try {
      const response = await axios.post(
        "https://wallet-app-backend-8.onrender.com/api/income/makeincome",
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setSuccessMessage("Income recorded successfully!");
      setFormData({ name: '', amount: '', description: '' });
    } catch (error) {
      console.error("Error recording income:", error);
      setError("An error occurred while recording income. Please try again later.");
    }
  };

  return (
    <section className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2>Record Your Income</h2>
          {error && <div className="alert alert-danger" style={{ color: 'red' }}>{error}</div>}
          {successMessage && <div className="alert alert-success" style={{ color: 'green' }}>{successMessage}</div>}
          <form method="POST" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Income Name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="number"
              name="amount"
              placeholder="Income Amount (e.g., 1200)"
              required
              value={formData.amount}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Income Description"
              required
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
            <button className="--btn --btn-primary --btn-block" type="submit">
              Record Income
            </button>
          </form>
        </div>
      </Card>
    </section>
  );
};

export default MakeIncome;
