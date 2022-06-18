import styled from "styled-components";

const StyledNavbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: var(--nav-height);
  background-color: var(--nav);
  box-shadow: 0 2px 8px var(--shadow);
  & * {
    display: flex;
    align-items: center;
  }
  ul {
    display: flex;
    align-items: center;
    list-style: none;

    li {
      display: flex;
      align-items: center;
      margin: 0 10px;
    }
  }
`;

export default StyledNavbar;
