import React, { useEffect, useState } from 'react';
import { BsCart3 , BsPeopleFill, BsFillGrid3X3GapFill } from 'react-icons/bs';
import { IoLogOutOutline } from "react-icons/io5";
import { MdSavings } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { FcDebt, FcPaid } from "react-icons/fc";
import { NavLink, useNavigate } from 'react-router-dom';
import { SlWallet } from "react-icons/sl";
import axios from 'axios';

const SidebarAdmin = ({OpenSidebarToggle, OpenSidebar}) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    axios.get("https://wallet-app-backend-8.onrender.com/api/accounts/logout")
      .then(res => {
        if (res.status === 200) {
          localStorage.removeItem('token');
          navigate("/");
        } else {
          alert("Error logging out");
        }
      }).catch(err => {
        console.log(err);
        alert("Error logging out");
      });
  };

  return (
    <aside id='sidebar' className={OpenSidebarToggle ? "sidebar-responsive": ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <SlWallet  size={60} />
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>
      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <NavLink to="/dashboardadmin">
            <BsFillGrid3X3GapFill className='icon' />Dashboard
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="/accounts"> 
            <BsPeopleFill className='icon' />My accounts
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
                  <NavLink to=  "/spend" > 
                   <FcDebt className='icon'/>Spend
                   </NavLink>
                </li>
                <li className='sidebar-list-item'>
                  <NavLink to=  "/makeincome" > 
                   <FcDebt className='icon'/>Make Income
                   </NavLink>
                </li>
        <li className='sidebar-list-item'>
          <NavLink to="/myincome">
            <MdSavings className='icon' />My income
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="/expenses"> 
            <FcDebt className='icon' />Expenses
          </NavLink>
        </li>
        <li className='sidebar-list-item'>
          <NavLink to="" onClick={handleLogout}>
            <IoLogOutOutline className='icon' />Logout
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarAdmin;
