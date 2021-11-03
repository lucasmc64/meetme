import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

import { UserContext } from "../contexts/UserContext";

import Button from "../components/Button";

import logo from "../assets/logo.svg";

import styles from "../styles/components/Header.module.css";
import stylesButton from "../styles/components/Button.module.css";

const Header = () => {
  const { logout } = useContext(UserContext);

  const location = useLocation();

  if (location.pathname === "/login") return null;

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link to="/schedule" title="MeetMe" aria-label="MeetMe">
          <img src={logo} alt="MeetMe" />
        </Link>

        <h1 className={styles.slogan}>Together. Forever.</h1>
      </div>

      <nav>
        <ul className={styles.navList}>
          {location.pathname !== "/schedule" ? (
            <li>
              <Link to="/schedule" className={stylesButton.button}>
                Voltar
              </Link>
            </li>
          ) : null}

          {location.pathname !== "/schedule/event/create" ? (
            <li>
              <Link
                to="/schedule/event/create"
                className={`${stylesButton.button} ${stylesButton.primaryButton}`}
              >
                Criar evento
              </Link>
            </li>
          ) : null}

          <li>
            <Button
              onClick={logout}
              className={stylesButton.iconButton}
              aria-label="Sair"
              title="Sair"
            >
              <FiLogOut size="0.875rem" />
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
