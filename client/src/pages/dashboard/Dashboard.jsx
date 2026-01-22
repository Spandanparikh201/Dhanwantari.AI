import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import PatientDashboard from '../../components/dashboard/PatientDashboard';
import DoctorDashboard from '../../components/dashboard/DoctorDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="text-phosphor text-center mt-20">Please log in to view dashboard.</div>;
    }

    // Role-based rendering
    if (user.role === 'doctor') {
        return <DoctorDashboard user={user} />;
    }

    return <PatientDashboard user={user} />;
};

export default Dashboard;
