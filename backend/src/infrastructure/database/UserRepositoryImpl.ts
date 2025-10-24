import { Pool } from 'pg';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class UserRepositoryImpl implements UserRepository {
  constructor(private pool: Pool) {}

  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (nombre, apellido, email)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [user.nombre, user.apellido, user.email];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}