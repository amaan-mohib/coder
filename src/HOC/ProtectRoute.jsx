// import { useRouter } from "next/router";
// import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Login from "../views/Login";

const privateRoute = (Component) => {
  const AutheticatedComp = () => {
    const { user } = useAuth();
    // const router = useRouter();
    // useEffect(() => {
    //   if (!user && router) {
    //     router.push(
    //       `/login?from=${encodeURIComponent(router.asPath)}`
    //       // "/login"
    //     );
    //   }
    // }, [router, user]);
    return user ? <Component /> : <Login />;
  };
  return AutheticatedComp;
};

export default privateRoute;
