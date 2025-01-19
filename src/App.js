import { BrowserRouter, Route, Routes } from 'react-router-dom';
// Pages
import { Home, Contact, Login, Register, Reset, MakeIncome, Spend } from './pages';
import DashboardAdmin from './pages/dashboard/DashboardAdmin';
import DashboardMember from './pages/dashboard/DashboardMember';
import Expenses from './pages/expenses/Expenses.jsx';
import MyIncome from './pages/income/MyIncome';
import SeeAccounts from './pages/accounts/SeeAccounts.jsx';
import PrivateRoutes from './pages/utils/PrivateRoutes';
//import LoanPay from './pages/expenses/LoanPayingForm.js';
//import LoansUpdate from './pages/expenses/LoansUpdate.js';
//import SeeClientLoans from './pages/expenses/SeeClientLoans.js'
// Components
import PagesLayout from './components/shared/PagesLayout';
import AdminLayout from './components/shared/AdminLayout';
import MemberLayout from './components/shared/MemberLayout';
import GettingContacts from './pages/contact/GettingContacts.js';
import UserUpdate from './pages/accounts/SeeAccounts.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PagesLayout />}>
          <Route index element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
        </Route>

        <Route path="" element={<AdminLayout />}>
          <Route path="/dashboardadmin" element={<DashboardAdmin />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/myincome" element={<MyIncome />} />
          <Route path="/accounts" element={<SeeAccounts />} />
          <Route path="/updateuser" element={<UserUpdate />} />
        
          <Route path="/spend" element={<Spend />} />
          <Route path="/makeincome" element={<MakeIncome />} />
          <Route path='/gettingcontacts' element ={<GettingContacts/>}/>
        </Route>

        <Route path="" element={<MemberLayout />}>
          <Route path="/dashboardmember" element={<DashboardMember />} />
    
          <Route element={<PrivateRoutes />}>
            <Route path="/spend" element={<Spend />} />
            <Route path="/makeincome" element={<MakeIncome />} />
          </Route>
    
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
