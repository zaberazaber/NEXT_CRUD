import styles from "../styles/Home.module.css";
import Link from "next/link";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>User | Home</title>
        <meta name="keywords" content="users" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>NEXT JS APP</h1>
        <p className={styles.text}>
          
        </p>
        <p className={styles.text}>
          
        </p>
        <a href="/www.google.com">
          <p className={styles.btn}>Checkout Github</p>
        </a>
      </div>
    </>
  );
}
