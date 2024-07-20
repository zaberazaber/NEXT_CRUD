import Link from "next/link";
const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <h1>Dashboard</h1>
      </div>
      <Link href="/">Home</Link>
      <Link href="/user">Users</Link>
    </nav>  
  );
};

export default Navbar;
