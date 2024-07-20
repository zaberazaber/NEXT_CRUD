import { readUsers, writeUsers } from '../../../utils/db';
import bcrypt from 'bcryptjs';

export const getUsers = () => {
  return readUsers();
};

export const createUser = (user) => {
  const users = readUsers();
  console.log("userz",users)
  user.id = users.length + 1;
  user.password = bcrypt.hashSync(user.password, 10);
  users.push(user);
  writeUsers(users);
  return user;
};

export default function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const users = getUsers();
      res.status(200).json(users);
    } else if (req.method === 'POST') {
      const user = createUser(req.body);
      res.status(201).json(user);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
