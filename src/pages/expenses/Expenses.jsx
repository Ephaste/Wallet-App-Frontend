import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useReactToPrint } from "react-to-print";
import styles from "./LoansPage.css"; // Ensure you have the correct path to your CSS file

export const Expenses = () => {
  const [expensesData, setExpensesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const navigate = useNavigate();
  const componentPDF = useRef();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("https://wallet-app-backend-8.onrender.com/api/expenses/getallexpenses", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setExpensesData(response.data);
      } catch (error) {
        console.error("Error fetching expenses data:", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleRowClick = (expense) => {
    if (expense) {
      navigate("/expensesupdate", { state: { expense } });
    } else {
      console.error("Expense data is missing");
    }
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Expenses Table",
    onAfterPrint: () => alert("Table saved in PDF")
  });

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = expensesData.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(expensesData.length / recordsPerPage);
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

  return (
    <div className="transactions-container">
      <section className="table__body" ref={componentPDF}>
        <h2>EXPENSES RECORDS</h2>
        <table className="center">
          <thead>
            <tr>
              <th style={{ color: "#000" }}>Number</th>
              <th style={{ color: "#000" }}>Name</th>
              <th style={{ color: "#000" }}>Description</th>
              <th style={{ color: "#000" }}>Amount</th>
              <th style={{ color: "#000" }}>Account ID</th>
              <th style={{ color: "#000" }}>Created Date</th> {/* New Column */}
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((item, indexNo) => (
              <tr key={item._id} onClick={() => handleRowClick(item)}>
                <td>{firstIndex + indexNo + 1}</td>
                <td>
                  <Link 
                    to={{
                      pathname: "/expensesupdate",
                      state: { expense: item }
                    }} 
                    style={{ textDecoration: 'none', color: 'inherit' }} 
                  >
                    {item.name}
                  </Link>
                </td>
                <td>{item.description || "No description"}</td>
                <td>{item.amount} Frw</td>
                <td>{item.byAccount ? item.byAccount : "No account linked"}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      </section>
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
    </div>
  );
}

export default Expenses;
