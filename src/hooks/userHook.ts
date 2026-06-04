import { useEffect, useState } from 'react';
import { get, post } from '../apiClient';

interface User {
  id: number;
  name: string;
  email: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await get('/users');
        setUsers(response || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const addUser = async (name: string, email: string) => {
    try {
      const newUser = await post('/users', { name, email });
      setUsers([...users, newUser]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
      console.error(err);
      throw err;
    }
  };

  return { users, loading, error, addUser };
}
