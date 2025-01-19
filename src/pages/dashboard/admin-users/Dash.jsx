import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { MdSavings } from "react-icons/md";
import { FcDebt } from "react-icons/fc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Dash() {
  const [accountsCount, setAccountsCount] = useState(0);  
  const [expensesCount, setExpensesCount] = useState(0);  
  const [contactsCount, setContactsCount] = useState(0);
  const [incomeAmount, setIncomeAmount] = useState(0);  
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:150/api/accounts/getallaccounts", {  
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAccountsCount(response.data.length);
      } catch (error) {
        console.error("Error fetching accounts data:", error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:150/api/expenses/getallexpenses", {  // Changed to expenses API
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const totalExpenses= response.data.reduce((sum, record) => sum + record.amount, 0);
        setExpensesCount(response.data.length);
        setExpenseAmount(totalExpenses);
      } catch (error) {
        console.error("Error fetching expenses data:", error);
      }
    };

    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:2/api/contact/getall", {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setContactsCount(response.data.length);
      } catch (error) {
        console.error("Error fetching contacts data:", error);
      }
    };

    const fetchIncome = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:150/api/income/getallincome", {  // Changed to income API
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const incomeCount = (response.data.length);
        const totalIncome = response.data.reduce((sum, record) => sum + record.amount, 0);
        //setExpensesCount(response.data.length);
        setIncomeAmount(totalIncome);
       // setIncomeAmount(incomeCount);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchAccounts(), fetchExpenses(), fetchContacts(), fetchIncome()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>ACCOUNTS</h3>  {/* Changed from MEMBERS to ACCOUNTS */}
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>{accountsCount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>INCOME</h3>  {/* Changed from SAVINGS to INCOME */}
            <MdSavings className='card_icon' />
          </div>
          <h1>{incomeAmount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>EXPENSES</h3>  {/* Changed from LOANS to EXPENSES */}
            <FcDebt className='card_icon' />
          </div>
          <h1>{expenseAmount}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>INFO..</h3>
           <a href='/gettingcontacts'> <BsFillBellFill className='card_icon' /></a>
          </div>
          <h1>{contactsCount}</h1>
        </div>
      </div>

      <div className='charts'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Dash;
