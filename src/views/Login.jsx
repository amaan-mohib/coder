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

  .error {
    color: red;
    font-size: small;
  }
`;
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const reset = {
    email: null,
    password: null,
    all: null,
  };
  const [errors, setErrors] = useState(reset);
  const { login } = useAuth();
  const router = useRouter();
  const { from } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (from && user) {
      setErrors(reset);
      router.push(decodeURIComponent(from));
    }
  }, [user]);

  const validate = (email, password) => {
    if (!email.trim() || !password.trim()) {
      setErrors({ ...reset, all: "All fields are required" });
      return false;
    }
    // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) == false) {
    //   setErrors({ ...reset, email: "Invalid Email" });
    //   return false;
    // }
    return true;
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (validate(email, password)) {
      login(email, password).then((val) => {
        if (!from && val) {
          setErrors(reset);
          router.push("/");
        }
      });
    }
  };

  return (
    <main>
      <StyledDiv>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Username or Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
          {errors.all && <p className="error">{errors.all}</p>}
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
