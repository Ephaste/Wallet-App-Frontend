import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../expenses/LoansPage.css";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

export const SeeAccounts = () => {
  const componentPDF = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsData, setAccountsData] = useState([]);
  const recordsPerPage = 7;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:150/api/accounts/getallaccounts", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAccountsData(response.data);
      } catch (error) {
        console.error("Error fetching accounts data:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleRowClick = (account) => {
    navigate('/updateuser', { state: { account } });
  };

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = accountsData.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(accountsData.length / recordsPerPage);
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
  
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Accounts Table",
    onAfterPrint: () => alert("Table saved in PDF")
  });

  return (
    <>
      <div className="transactions-container">
        <section className="table__body">
          <div ref={componentPDF}>
            <h2>LIST OF ALL ACCOUNTS</h2>
            <table className="center">
              <thead>
                <tr>
                  <th style={{ color: "#000" }}>Number</th>
                  <th style={{ color: "#000" }}>Name</th>
                  <th style={{ color: "#000" }}>Email</th>
                  <th style={{ color: "#000" }}>Account Type</th>
                  <th style={{ color: "#000" }}>Account Number</th>
                  <th style={{ color: "#000" }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((item, indexNo) => (
                  <tr key={item._id} onClick={() => handleRowClick(item)}>
                    <td>{firstIndex + indexNo + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.account}</td>
                    <td>{item.accountno}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
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
              <li className="page-item">
                <button type="submit" className="--btn --btn-primary --btn-block" onClick={generatePDF}>
                  PDF
                </button>
              </li>
            </ul>
          </nav>
        </section>
      </div>
    </>
  );
};

export default SeeAccounts;
