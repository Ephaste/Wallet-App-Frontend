import React, { useState, useEffect } from 'react';
import styles from "../auth/auth.module.scss";
import Card from '../../components/card/Card';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Spend = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    description: '',
  });
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const response = await axios.get(`https://wallet-app-backend-8.onrender.com/api/accounts/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFormData((prevData) => ({
        ...prevData,
        name: response.data.name,
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchFinancialData = async () => {
    const token = localStorage.getItem('token');

    try {
      const incomeResponse = await axios.get("https://wallet-app-backend-8.onrender.com/api/income/gettotalincome", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const expenseResponse = await axios.get("https://wallet-app-backend-8.onrender.com/api/expenses/gettotalexpenses", {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setTotalIncome(incomeResponse.data.totalIncome || 0);
      setTotalExpenses(expenseResponse.data.totalExpenses || 0);
    } catch (error) {
      console.error("Error fetching financial data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchFinancialData();
  }, []);

  const submitExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const newExpenseAmount = parseFloat(formData.amount);
    const maxAllowedExpense = totalIncome * 0.8;

    if (totalExpenses + newExpenseAmount > maxAllowedExpense) {
      setError(`Expense exceeds the 80% limit of your total income (${maxAllowedExpense.toFixed(2)}).`);
      setSuccess('');
      return;
    }

    const expenseData = {
      name: formData.name,
      amount: newExpenseAmount.toFixed(2),
      description: formData.description,
    };

    try {
      const response = await axios.post(
        "https://wallet-app-backend-8.onrender.com/api/expenses/spend",
        expenseData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSuccess("Expense recorded successfully!");
      setError('');
      setFormData({ name: formData.name, amount: '', description: '' });
      fetchFinancialData();
    } catch (error) {
      setError("Error recording expense.");
      setSuccess('');
      console.error("Error recording expense:", error);
    }
  };

  return (
    <section className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <h2>Record Expense</h2>
          {error && <div className="alert alert-danger" style={{ color: 'red' }}>{error}</div>}
          {success && <div className="alert alert-success" style={{ color: 'green' }}>{success}</div>}
          <form onSubmit={submitExpense}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="number"
              name="amount"
              placeholder="Expense Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Expense Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <p>Total Income: {totalIncome.toFixed(2)}</p>
            <p>Total Expenses: {totalExpenses.toFixed(2)}</p>
            <p>Remaining Allowed Expense: {(totalIncome * 0.8 - totalExpenses).toFixed(2)}</p>
            <button type="submit" className="--btn --btn-primary --btn-block">
              Record Expense
            </button>
          </form>
        </div>
      </Card>
    </section>
  );
};

export default Spend;
