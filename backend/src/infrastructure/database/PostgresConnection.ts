import { Pool } from 'pg';

export class PostgresConnection {
  private static instance: Pool;

  private constructor() {}

  static getInstance(): Pool {
    if (!PostgresConnection.instance) {
      PostgresConnection.instance = new Pool({
        host: process.env.DB_HOST || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'marcos_brindis_db',
        user: process.env.DB_USER || 'marcos',
        password: process.env.DB_PASSWORD || 'brindis2025',
      });

      PostgresConnection.instance.on('connect', () => {
        console.log('Conectado a PostgreSQL');
      });

      PostgresConnection.instance.on('error', (err) => {
        console.error('Error en la conexión a PostgreSQL:', err);
      });
    }

    return PostgresConnection.instance;
  }

  static async initializeDatabase(): Promise<void> {
    const pool = this.getInstance();
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await pool.query(createTableQuery);
      console.log('Tabla "users" creada o ya existe');
      
      // Insertar datos de ejemplo
      const checkData = await pool.query('SELECT COUNT(*) FROM users');
      if (parseInt(checkData.rows[0].count) === 0) {
        await pool.query(
          `INSERT INTO users (nombre, apellido, email) VALUES 
           ('Marcos', 'Brindis', 'marcos.brindis@example.com'),
           ('Juan', 'Pérez', 'juan.perez@example.com')`
        );
        console.log('Datos de ejemplo insertados');
      }
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      throw error;
    }
  }
}