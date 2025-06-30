// src/components/StreakPopup.js
import React from 'react';

const StreakPopup = ({ show, message, currentStreak, onClose }) => {
    if (!show) {
        return null;
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button onClick={onClose} style={styles.closeButton}>X</button>
                <h2 style={styles.title} >Daily Streak!</h2>
                <p style={styles.message}>{message}</p>
                <p style={styles.streakCount}>
                    Current Streak: <span style={styles.count}>{currentStreak}</span> days
                </p>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#2c2c2c',
        padding: '30px 20px',
        borderRadius: '10px',
        textAlign: 'center',
        color: '#eee',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        position: 'relative',
        border: '1px solid #444',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        color: '#ccc',
        fontSize: '1.2em',
        cursor: 'pointer',
        padding: '5px',
    },
    title: {
        color: '#ffc107',
        fontSize: '1.8em',
        marginBottom: '15px',
        
    },
    message: {
        fontSize: '1.1em',
        marginBottom: '20px',
        lineHeight: '1.4',
    },
    streakCount: {
        fontSize: '1.3em',
        fontWeight: 'bold',
        color: '#00e676',
    },
    count: {
        fontSize: '1.5em',
        fontWeight: 'bolder',
        marginLeft: '5px',
    }
};

export default StreakPopup;