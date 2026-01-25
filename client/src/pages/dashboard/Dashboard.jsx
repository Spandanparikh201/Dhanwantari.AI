import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import PatientDashboard from '../../components/dashboard/PatientDashboard';
import DoctorDashboard from '../../components/dashboard/DoctorDashboard';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <div className="text-phosphor text-center mt-20">Please log in to view dashboard.</div>;
    }

    // Role-based rendering
    if (user.role === 'admin') {
        // Redirect admin to admin dashboard
        navigate('/admin');
        return null;
    }

    if (user.role === 'doctor') {
        return <DoctorDashboard user={user} />;
    }

    return <PatientDashboard user={user} />;
};

export default Dashboard;
