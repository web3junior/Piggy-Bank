import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Admin from "./pages/Admin";
import NoPage from "./pages/NoPage";
import UserContext from './UserContext';

const App = () => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{
      user,
      setUser
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
