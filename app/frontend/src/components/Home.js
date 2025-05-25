// src/components/Home.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <h2>Hoşgeldin, {user.name}!</h2>
    </div>
  );
}
