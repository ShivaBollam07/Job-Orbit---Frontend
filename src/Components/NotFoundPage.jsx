import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.header}>404</h1>
        <p style={styles.message}>Page Not Found</p>
        <br />
        <Link to="/home" style={styles.link}>
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    textAlign: 'center',
  },
  header: {
    fontSize: '6em',
    margin: '0',
    color: '#333',
  },
  message: {
    fontSize: '1.5em',
    margin: '10px 0',
    color: '#666',
  },
  link: {
    fontSize: '1.2em',
    color: '#007bff',
    textDecoration: 'none',
    border: '1px solid #007bff',
    padding: '10px 20px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  linkHover: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
};

export default NotFoundPage;
