import styled from "styled-components";
import {
  Braces,
  ChartBar,
  FileUpload,
  LayoutDashboard,
  Logout,
  User,
} from "tabler-icons-react";
import { useAuth } from "../contexts/AuthContext";
import LinkComp from "./Link";

const StyledDiv = styled.div`
  z-index: 1000;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(var(--nav-height));
  width: 320px;
  right: 0;
  background-color: var(--nav);
  border-radius: 3px;
  padding: 5px;
  box-shadow: 0 0 5px 2px var(--shadow);
  font-size: 14px;
  & > * {
    text-align: left;
    width: 100%;
    padding: 5px 10px;
    border-radius: 3px;
    background-color: inherit;
    &:hover {
      filter: brightness(90%);
      cursor: pointer;
    }
  }
  .mr {
    margin-right: 10px;
  }
`;
const FlyoutMenu = ({ setShow }) => {
  const { user, logout } = useAuth();
  return (
    <StyledDiv
      onClick={() => {
        setShow(false);
      }}>
      <LinkComp href={`/${user.username}`}>
        <User className="mr" />
        <h2>{user.name}</h2>
      </LinkComp>
      <LinkComp href="/submissions">
        <FileUpload className="mr" /> Submissions
      </LinkComp>
      <LinkComp href="/progress">
        <ChartBar className="mr" /> Progress
      </LinkComp>
      <LinkComp href="/contribute">
        <Braces className="mr" />
        Contribute
      </LinkComp>
      {user.admin && (
        <LinkComp href="/dashboard">
          <LayoutDashboard className="mr" />
          Approve
        </LinkComp>
      )}
      <div
        onClick={() => {
          logout();
        }}>
        <Logout className="mr" /> Log Out
      </div>
    </StyledDiv>
  );
};

export default FlyoutMenu;
