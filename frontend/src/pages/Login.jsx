import React, { useContext, useRef, useState } from "react";
import { Redirect } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

import Input from "../components/Input";
import Button from "../components/Button";

import Toast from "../helpers/Toast";

import Logo from "../assets/meetme.svg";

import styles from "../styles/pages/Login.module.css";
import stylesButton from "../styles/components/Button.module.css";

const Login = () => {
  const [data, setData] = useState({ username: "", password: "" });

  const refs = {
    username: useRef(),
    password: useRef(),
  };

  const { isLogged, login } = useContext(UserContext);

  const handleChange = (event) => {
    if (!/^\S*$/.test(event.target.value)) {
      Toast.fire({
        icon: "error",
        title: "Não são permitidos espaços em nomes de usuários e senhas.",
      });

      return false;
    }

    const newValue = event.target.value.replaceAll(/\s/g, "");

    setData((data) => ({ ...data, [event.target.name]: newValue }));

    refs[event.target.name].current.classList.remove("error");
  };

  const validateField = (
    field,
    errorMessage = "Este campo deve conter no mínimo 3 caracteres.",
  ) => {
    if (data[field].length >= 3) return true;

    refs[field].current.classList.add("error");

    Toast.fire({
      icon: "error",
      title: errorMessage,
    });

    return false;
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !validateField(
        "username",
        "O nome de usuário deve conter no mínimo 3 caracteres.",
      )
    )
      return false;

    if (
      !validateField(
        "password",
        "Sua senha deve conter no mínimo 3 caracteres.",
      )
    )
      return false;

    try {
      await login(data.username, data.password);
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.message,
      });
    }
  }

  if (isLogged === true) return <Redirect to="/schedule" />;
  else
    return (
      <div className={styles.container}>
        <div className={styles.brand}>
          <img src={Logo} alt="MeetMe" title="MeetMe" aria-label="MeetMe" />
          <h6 className={styles.slogan}>Together. Forever.</h6>
        </div>

        <form
          action="POST"
          className={styles.form}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <Input
            label="Nome de usuário"
            id="username"
            name="username"
            type="text"
            value={data.username}
            onChange={handleChange}
            onBlur={() =>
              validateField(
                "username",
                "O nome de usuário deve conter no mínimo 3 caracteres.",
              )
            }
            ref={refs.username}
          />

          <Input
            label="Senha"
            id="password"
            name="password"
            type="password"
            value={data.password}
            onChange={handleChange}
            onBlur={() =>
              validateField(
                "password",
                "Sua senha deve conter no mínimo 3 caracteres.",
              )
            }
            ref={refs.password}
          />

          <Button className={stylesButton.specialButton}>Entrar</Button>
        </form>
      </div>
    );
};

export default Login;
