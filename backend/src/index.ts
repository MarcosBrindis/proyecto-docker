import dotenv from 'dotenv';
import { PostgresConnection } from './infrastructure/database/PostgresConnection';
import { UserRepositoryImpl } from './infrastructure/database/UserRepositoryImpl';
import { UserService } from './domain/services/UserService';
import { Server } from './infrastructure/http/server';

dotenv.config();

async function main() {
  try {
    console.log('Inicializando aplicación...');
    
    // Inicializar base de datos
    await PostgresConnection.initializeDatabase();
    
    // Configurar repositorio y servicio
    const pool = PostgresConnection.getInstance();
    const userRepository = new UserRepositoryImpl(pool);
    const userService = new UserService(userRepository);
    
    // Iniciar servidor
    const PORT = parseInt(process.env.PORT || '5000');
    const server = new Server(PORT, userService);
    server.start();
    
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

main();