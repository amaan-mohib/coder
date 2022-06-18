import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import LinkComp from "../components/Link";
import { useAuth } from "../contexts/AuthContext";

const StyledDiv = styled.div`
  margin: auto;
  display: flex;

  form {
    display: flex;
    flex-direction: column;
    & > * {
      margin: 8px 0;
    }
    input {
      min-width: 320px;
    }
    .signup {
      font-size: small;
      text-align: center;
      color: var(--secondary-text);
    }
  }
`;
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const { from } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (from && user) {
      router.push(decodeURIComponent(from));
    }
  }, [user]);

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password).then((val) => {
      if (!from && val) {
        router.push("/");
      }
    });
  };

  return (
    <main>
      <StyledDiv>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Log In</Button>
          <p className="signup">
            New user? <LinkComp href="/register">Sign Up</LinkComp>
          </p>
        </form>
      </StyledDiv>
    </main>
  );
};

export default Login;
