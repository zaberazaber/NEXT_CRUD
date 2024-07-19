import Styles from '../../styles/User.module.css'
import Link from 'next/link';
export const getStaticProps = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await res.json();
  return {
    props: { users: data },
  };
};
const users = ({ users }) => {
  return (
    <div>
      <h1>All Users</h1>
      {users.map((user) => (
        <div key={user.id}>
          <Link href={`/users/${user.id}`} className={Styles.single}>
            <h3>{user.name}</h3>
            </Link>
        </div>
      ))}
    </div>
  );
};

export default users;
