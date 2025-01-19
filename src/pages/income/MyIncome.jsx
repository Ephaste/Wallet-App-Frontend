import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "../expenses/LoansPage.css";
import { useReactToPrint } from "react-to-print";

const MyIncome = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const navigate = useNavigate();
  const componentPDF = useRef();

  useEffect(() => {
    const fetchIncomeData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get("https://wallet-app-backend-8.onrender.com/api/income/getallincome", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIncomeData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching income data');
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, []);

  const handleRowClick = (income) => {
    navigate('/updateincome', { state: { income } });
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Income Table",
    onAfterPrint: () => alert("Table saved in PDF")
  });

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = incomeData.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(incomeData.length / recordsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCPage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage !== nPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="transactions-container">
      <section className="table__body">
        <div ref={componentPDF}>
          <h2>MY INCOME</h2>
          <table className="center">
            <thead>
              <tr>
                <th style={{ color: "#000" }}>Number</th>
                <th style={{ color: "#000" }}>Name</th>
                <th style={{ color: "#000" }}>Amount</th>
                <th style={{ color: "#000" }}>Description</th>
                <th style={{ color: "#000" }}>Account</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((item, index) => (
                <tr key={item._id} onClick={() => handleRowClick(item)}>
                  <td>{firstIndex + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.amount}</td>
                  <td>{item.description}</td>
                  <td>{item.byAccount ? item.byAccount : "No Account"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <a href="#" className="page-link" onClick={prePage}>Prev</a>
            </li>
            {numbers.map((n) => (
              <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={n}>
                <a href="#" className="page-link" onClick={() => changeCPage(n)}>{n}</a>
              </li>
            ))}
            <li className="page-item">
              <a href="#" className="page-link" onClick={nextPage}>Next</a>
            </li>
            <li>
              <button type="submit" className="--btn --btn-primary --btn-block" onClick={generatePDF}>
                PDF
              </button>
            </li>
          </ul>
        </nav>
      </section>
    </div>
  );
};

export default MyIncome;
