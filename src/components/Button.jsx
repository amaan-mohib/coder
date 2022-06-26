import styled, { css } from "styled-components";
import Loader from "./Loader";

const StyledButton = styled.button`
  padding:  6px 16px;
  cursor: pointer;
  border: none;
  background-color: var(--primary);
  border-radius: 3px;
  color: white;
  text-transform: capitalize;
  display: flex;

  &:hover {
    filter: brightness(90%) saturate(120%);
  }
  &:active {
    filter: brightness(80%) saturate(120%);
  }
  &:disabled{
     background-color: var(--secondary);
     cursor: not-allowed;
  }
  &:disabled:hover{
    filter:none;
  }
  ${(props) =>
    props.secondary &&
    css`
      background-color: transparent;
      border: none;
      box-shadow: none;
      padding: 7px 8px;
    `}
  ${(props) =>
    props.outlined &&
    css`
      border: 1px solid var(--secondary-text);
      background-color: transparent;
      padding: 5px 15px;
      color: black;
      &:disabled {
        background-color: transparent;
        color: var(--secondary-text);
      }
    `}
  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}


  svg {
    width: 20px;
    height: 20px;
  }
  .load {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .right-icon {
    margin-right: 12px;
  }
  .left-icon {
    margin-left: 12px;
  }
  .loading-icon {
    margin: 0 !important;
  }
`;

const Button = ({
  children,
  onClick = () => {},
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  ...props
}) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled || loading} {...props}>
      {((loading && !endIcon) || startIcon) && (
        <div className="load right-icon">
          {loading && !endIcon ? (
            <Loader className="loading-icon" />
          ) : (
            startIcon
          )}
        </div>
      )}
      {children}
      {((loading && !startIcon) || endIcon) && (
        <div className="load left-icon">
          {loading && endIcon ? <Loader className="loading-icon" /> : endIcon}
        </div>
      )}
    </StyledButton>
  );
};

export default Button;
