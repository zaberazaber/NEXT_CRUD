// components/UserForm.js
import { useForm } from 'react-hook-form';
import axios from 'axios';

const UserForm = ({ user, setUsers, users, resetSelectedUser }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: user || {
      first_name: '',
      last_name: '',
      email: '',
      alternate_email: '',
      password: '',
      age: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (user) {
        const response = await axios.put(`/api/users/${user.id}`, data);
        setUsers(users.map((u) => (u.id === user.id ? response.data : u)));
      } else {
        const response = await axios.post('/api/users', data);
        setUsers([...users, response.data]);
      }
      reset();
      resetSelectedUser();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name</label>
        <input {...register('first_name', { required: true })} />
        {errors.first_name && <span>This field is required</span>}
      </div>
      <div>
        <label>Last Name</label>
        <input {...register('last_name', { required: true })} />
        {errors.last_name && <span>This field is required</span>}
      </div>
      <div>
        <label>Email</label>
        <input {...register('email', { required: true })} />
        {errors.email && <span>This field is required</span>}
      </div>
      <div>
        <label>Alternate Email</label>
        <input {...register('alternate_email')} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register('password', { required: !user })} />
        {errors.password && <span>This field is required</span>}
      </div>
      <div>
        <label>Age</label>
        <input type="number" {...register('age', { required: true, min: 18 })} />
        {errors.age && <span>Age must be greater than 18</span>}
      </div>
      <button type="submit">Submit</button>
      {user && <button type="button" onClick={resetSelectedUser}>Cancel</button>}
    </form>
  );
};

export default UserForm;
