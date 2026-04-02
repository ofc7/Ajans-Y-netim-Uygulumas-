import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import ClientsPage from './pages/ClientsPage';
import TasksPage from './pages/TasksPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="tasks" element={<TasksPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
