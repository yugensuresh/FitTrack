import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import SessionList from './pages/SessionList';
import SessionCreate from './pages/SessionCreate';
import SessionDetails from './pages/SessionDetails';
import SessionEdit from './pages/SessionEdit';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container py-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sessions" element={<SessionList />} />
            <Route path="/sessions/create" element={<SessionCreate />} />
            <Route path="/sessions/:id" element={<SessionDetails />} />
            <Route path="/sessions/:id/edit" element={<SessionEdit />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;