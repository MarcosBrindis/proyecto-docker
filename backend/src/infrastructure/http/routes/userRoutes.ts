import { Router, Request, Response } from 'express';
import { UserService } from '../../../domain/services/UserService';
import { CreateUserUseCase } from '../../../application/usecases/CreateUser';
import { GetUsersUseCase } from '../../../application/usecases/GetUsers';
import { GetBrindisEndpointUseCase } from '../../../application/usecases/GetBrindisEndpoint';

export function createUserRoutes(userService: UserService): Router {
  const router = Router();

  // Endpoint personalizado 
  router.get('/brindis', (req: Request, res: Response) => {
    const useCase = new GetBrindisEndpointUseCase();
    const result = useCase.execute();
    res.json(result);
  });

  // Health check
  router.get('/health', (req: Request, res: Response) => {
    res.json({ 
      status: 'OK', 
      service: 'API Marcos Brindis',
      timestamp: new Date() 
    });
  });

  // Obtener todos los usuarios
  router.get('/users', async (req: Request, res: Response) => {
    try {
      const useCase = new GetUsersUseCase(userService);
      const users = await useCase.execute();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  });

  // Crear un usuario
  router.post('/users', async (req: Request, res: Response) => {
    try {
      const useCase = new CreateUserUseCase(userService);
      const newUser = await useCase.execute(req.body);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Obtener usuario por ID
  router.get('/users/:id', async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  });

  // Eliminar usuario
  router.delete('/users/:id', async (req: Request, res: Response) => {
    try {
      const deleted = await userService.deleteUser(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  });

  return router;
}