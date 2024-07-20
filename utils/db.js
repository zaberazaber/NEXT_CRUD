import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data', 'users.json');

export const readUsers = () => {
  try {
    const users = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(users);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

export const writeUsers = (users) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};
