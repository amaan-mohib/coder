import styled from "styled-components";

const StyledButton = styled.button`
  padding: 8.85px 13px;
  cursor: pointer;
  border: 0;
  background-color: var(--primary);
  border-radius: 3px;
  color: white;

  &:hover {
    filter: brightness(90%) saturate(120%);
  }
  &:active {
    filter: brightness(80%) saturate(120%);
  }
`;

const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
