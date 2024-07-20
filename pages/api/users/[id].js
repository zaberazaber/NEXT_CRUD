import { readUsers, writeUsers } from '../../../utils/db';

export const updateUser = (id, data) => {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === parseInt(id, 10));
  if (index === -1) return null;

  users[index] = { ...users[index], ...data };
  writeUsers(users);
  return users[index];
};

export const deleteUser = (id) => {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === parseInt(id, 10));
  if (index === -1) return null;

  const deletedUser = users.splice(index, 1);
  writeUsers(users);
  return deletedUser[0];
};

export default function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'PUT') {
      const updatedUser = updateUser(id, req.body);
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json(updatedUser);
      }
    } else if (req.method === 'DELETE') {
      const deletedUser = deleteUser(id);
      if (!deletedUser) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json(deletedUser);
      }
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
