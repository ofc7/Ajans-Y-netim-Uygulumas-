import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Client, User, TaskStatus } from '../types';
import { MOCK_CLIENTS, MOCK_TASKS, MOCK_USERS } from '../constants';

interface AppContextType {
  tasks: Task[];
  clients: Client[];
  users: User[];
  agencyName: string;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  updateAgencyName: (name: string) => void;
  duplicateTask: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [users] = useState<User[]>(MOCK_USERS);
  const [agencyName, setAgencyName] = useState('Kıyı Medya');

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const duplicateTask = (id: string) => {
    const taskToDuplicate = tasks.find((t) => t.id === id);
    if (taskToDuplicate) {
      const duplicatedTask = {
        ...taskToDuplicate,
        id: Math.random().toString(36).substr(2, 9),
        title: `${taskToDuplicate.title} (Kopya)`,
        status: 'Planlandı' as TaskStatus,
      };
      setTasks([...tasks, duplicatedTask]);
    }
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: Math.random().toString(36).substr(2, 9) };
    setClients([...clients, newClient]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id));
    setTasks(tasks.filter((t) => t.clientId !== id));
  };

  const updateAgencyName = (name: string) => {
    setAgencyName(name);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        clients,
        users,
        agencyName,
        addTask,
        updateTask,
        deleteTask,
        addClient,
        updateClient,
        deleteClient,
        updateAgencyName,
        duplicateTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
