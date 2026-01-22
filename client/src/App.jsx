import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';
import Landing from './pages/Landing';
import { ChatInterface } from './components/chat/ChatInterface';
import { HistoryView } from './components/chat/HistoryView';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientProfile from './components/profile/PatientProfile';
import Dashboard from './pages/dashboard/Dashboard';
import { Button } from './components/ui/Button';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[75vh]">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/consultation" element={
              <div className="w-full">
                <div className="flex items-center mb-8 gap-4 border-b border-phosphor/20 pb-4">
                  <Button variant="ghost" className="!px-4 text-phosphor/60 hover:text-phosphor" onClick={() => navigate('/dashboard')}>
                    ← TERMINATE_SESSION
                  </Button>
                  <h2 className="text-xl tracking-widest text-phosphor uppercase">Create_New_Consultation_Protocol</h2>
                </div>
                <ChatInterface />
              </div>
            } />

            <Route path="/history" element={
              <div className="w-full">
                <div className="flex items-center mb-8 gap-4">
                  {/* Back button logic can be added later */}
                </div>
                <HistoryView />
              </div>
            } />

            <Route path="/profile" element={<PatientProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}

export default App;
