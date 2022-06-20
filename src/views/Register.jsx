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
  .error {
    color: red;
    font-size: small;
  }
`;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const reset = {
    email: null,
    password: null,
    username: null,
    name: null,
    all: null,
  };
  const [errors, setErrors] = useState(reset);

  const validate = (email, password, username, name) => {
    if (!email.trim() || !password.trim() || !username.trim() || !name.trim()) {
      setErrors({ ...reset, all: "All fields are required" });
      return false;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) == false) {
      setErrors({ ...reset, email: "Invalid Email" });
      return false;
    }
    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate(email, password, username, name)) {
      api
        .post("user/register", { name, username, email, password })
        .then(() => {
          login(email, password).then(() => {
            setErrors(reset);
            router.push("/");
          });
        })
        .catch((err) => console.error(err));
    }
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
          {errors.name && <p className="error">{errors.name}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p className="error">{errors.username}</p>}
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
          {errors.all && <p className="error">{errors.all}</p>}
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
