import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const privateRoute = (Component) => {
  const AutheticatedComp = () => {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (!user) {
        router.push(
          `/login?from=${encodeURIComponent(router.asPath)}`,
          "/login"
        );
      }
    }, []);
    return user && <Component />;
  };
  return AutheticatedComp;
};

export default privateRoute;
