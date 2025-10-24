import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';
import { apiService } from './services/apiService';
import { User } from './types/User';
import './App.css';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios. Verifica que la API esté corriendo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (user: User) => {
    try {
      await apiService.createUser(user);
      fetchUsers();
    } catch (err) {
      alert('Error al crear usuario');
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await apiService.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert('Error al eliminar usuario');
        console.error(err);
      }
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="container">
        {error && <div className="error-message">{error}</div>}
        
        <div className="content-grid">
          <UserForm onSubmit={handleCreateUser} />
          
          {loading ? (
            <div className="loading">Cargando usuarios...</div>
          ) : (
            <UserList users={users} onDelete={handleDeleteUser} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;