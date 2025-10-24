import React from 'react';
import { User } from '../types/User';

interface UserListProps {
  users: User[];
  onDelete: (id: number) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onDelete }) => {
  return (
    <div className="user-list">
      <h2>👥 Lista de Usuarios</h2>
      {users.length === 0 ? (
        <p className="no-users">No hay usuarios registrados</p>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h3>{user.nombre} {user.apellido}</h3>
                <p>📧 {user.email}</p>
                {user.created_at && (
                  <p className="user-date">
                    📅 {new Date(user.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                className="btn-delete"
                onClick={() => user.id && onDelete(user.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};