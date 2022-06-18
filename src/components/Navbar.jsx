import Link from "./Link";
import { useAuth } from "../contexts/AuthContext";
import StyledNavbar from "./Navbar.styles";
import { Code, UserCircle } from "tabler-icons-react";
import ClickAwayListener from "react-click-away-listener";
import FlyoutMenu from "./FlyoutMenu";
import { useState } from "react";

const Navbar = () => {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  return (
    <StyledNavbar>
      <div>
        <Link href="/">
          <Code />
        </Link>
      </div>
      <ul>
        <li>
          <Link href="/discuss">Discuss</Link>
        </li>
        <li>
          {user ? (
            <ClickAwayListener onClickAway={() => setShow(false)}>
              <div style={{ position: "relative" }}>
                <UserCircle
                  onClick={() => setShow(!show)}
                  style={{ cursor: "pointer" }}
                />
                {show && <FlyoutMenu setShow={setShow} />}
              </div>
            </ClickAwayListener>
          ) : (
            <Link href="/login">Log in</Link>
          )}
        </li>
      </ul>
    </StyledNavbar>
  );
};

export default Navbar;
