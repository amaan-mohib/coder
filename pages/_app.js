import Layout from "../src/components/Layout";
import AuthProvider from "../src/contexts/AuthContext";
import Helmet from "../src/HOC/Helmet";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Helmet />
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  );
}

export default MyApp;
