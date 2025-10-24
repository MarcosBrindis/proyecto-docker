import React, { useState } from 'react';
import { apiService } from '../services/apiService';

export const Header: React.FC = () => {
  const [brindisInfo, setBrindisInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchBrindis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getBrindisInfo(); // o getBrindisInfo('brindis') si usas ruta con parámetro
      setBrindisInfo(data);
    } catch (err) {
      console.error('Error al obtener información:', err);
      setError('No se pudo obtener la información. Verifica la API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="app-header">
      <h1>🚀 Microservicios - {brindisInfo?.nombreCompleto || 'Marcos Brindis'}</h1>
      <p className="subtitle">Arquitectura Hexagonal + Docker Compose</p>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleFetchBrindis}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            background: '#667eea',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Cargando…' : 'Mostrar Brindis (Brindis)'}
        </button>
      </div>

      {error && <div style={{ color: '#ff6b6b', marginTop: 12 }}>{error}</div>}

      {brindisInfo && (
        <div className="brindis-info" style={{ marginTop: 12 }}>
          <p>✨ {brindisInfo.mensaje}</p>
          <p>👤 {brindisInfo.nombreCompleto}</p>
        </div>
      )}
    </header>
  );
};