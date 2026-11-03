import React from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const user = auth.currentUser;
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h3>Corporate Portal</h3>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </header>

            <main style={styles.content}>
                <div style={styles.profileCard}>
                    {user?.photoURL && <img src={user.photoURL} alt="Profile" style={styles.avatar} />}
                    <h2>Welcome, {user?.displayName || 'User'}!</h2>
                    <p style={styles.emailText}>Email: {user?.email}</p>
                    <span style={styles.badge}>Authorized Domain Verified</span>
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f9fafb' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' },
    logoutBtn: { padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', cursor: 'pointer', fontWeight: '500' },
    content: { padding: '40px 20px', display: 'flex', justifyContent: 'center' },
    profileCard: { backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center', maxWidth: '420px', width: '100%' },
    avatar: { width: '80px', height: '80px', borderRadius: '50%', marginBottom: '16px' },
    emailText: { color: '#6b7280', margin: '8px 0 16px 0' },
    badge: { display: 'inline-block', padding: '6px 12px', borderRadius: '20px', backgroundColor: '#ecfdf5', color: '#047857', fontSize: '12px', fontWeight: '600' }
};