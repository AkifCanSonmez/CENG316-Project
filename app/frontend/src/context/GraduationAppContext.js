// src/context/GraduationAppContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/client';

const GraduationAppContext = createContext();
export const useGradApps = () => useContext(GraduationAppContext);

export function GraduationAppProvider({ children }) {
  const [apps, setApps] = useState([]);
  const [list, setList] = useState([]);
  const [top3, setTop3] = useState([]);

  const fetchApps = async () => {
    const res = await axios.get('/applications/');
    setApps(res.data);
  };

  const createApp = async (studentId, initiatedBy) => {
    const id = await axios.post('/applications/', { student_id: studentId, initiated_by: initiatedBy });
    await fetchApps();
    return id.data;
  };

  const decideApp = async (appId, decision) => {
    await axios.post(`/applications/${appId}/decision`, { decision });
    await fetchApps();
  };

  const genList = async () => {
    const res = await axios.post('/applications/generate-list');
    setList(res.data);
  };

  const fetchTop3 = async () => {
    try {
      const res = await axios.get('/applications/list/top3');
      setTop3(res.data);
    } catch {
      setTop3(null);
    }
  };

  return (
    <GraduationAppContext.Provider value={{
      apps, fetchApps, createApp, decideApp,
      list, genList, top3, fetchTop3
    }}>
      {children}
    </GraduationAppContext.Provider>
  );
}
