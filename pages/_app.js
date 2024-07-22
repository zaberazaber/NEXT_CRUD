import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import Layout from "../components/Layout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
      <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

export default MyApp;