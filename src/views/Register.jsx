import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import LinkComp from "../components/Link";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

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

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    api
      .post("user/register", { name, username, email, password })
      .then(() => {
        login(email, password).then(() => {
          router.push("/");
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <main>
      <StyledDiv>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Register</Button>
          <p className="signup">
            Already have an account? <LinkComp href="/login">Sign In</LinkComp>
          </p>
        </form>
      </StyledDiv>
    </main>
  );
};

export default Register;
