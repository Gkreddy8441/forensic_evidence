import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import SignUp from './SignUp';
import FetchEvidence from './FetchEvidence';
import RecordEvidence from './RecordEvidence';
import NavAdmin from './NavAdmin';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/fetch-evidence" element={<FetchEvidence />} />
        <Route path="/record-evidence" element={<RecordEvidence />} />
        <Route path="/nav-admin" element={<NavAdmin />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;