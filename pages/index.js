// pages/index.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  const resetSelectedUser = () => {
    setSelectedUser(null);
    setShowForm(false)
  }

  return (
    <div>
      <h1>User Management</h1>
      {showForm && (
        <UserForm
          user={selectedUser}
          setUsers={setUsers}
          users={users}
          resetSelectedUser={resetSelectedUser}
        />
      )}
      {!showForm && (
        <UserTable
          users={users}
          setUsers={setUsers}
          setSelectedUser={(user) => {
            setSelectedUser(user);
            setShowForm(true);
          }}
          setShowForm={setShowForm}
        />
      )}
    </div>
  );
}