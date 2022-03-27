import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

function Register(props) {

    const [registerData, setRegisterData] = React.useState({
        password: '',
        email: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        props.onRegister({
            password: registerData.password,
            email: registerData.email,
        });
    }

    const link = (
        <p className="form__paragraph">
            Уже зарегистрированы? <Link className="form__link" to="/sign-in">Войти</Link>
        </p>
    )

    return (
        <Logo
            title="Регистрация"
            buttonText="Зарегистрироваться"
            onSubmit={handleSubmit}
            link={link}
        >
            <input value={registerData.email || ''} onChange={handleChange} type="email" name="email" id="login-email" placeholder="email" className="form__text form__text_theme_dark" maxLength="40" required />
            <span className="form__input-error" id="login-email-error"></span>
            <input value={registerData.password || ''} onChange={handleChange} type="password" name="password" id="login-password" placeholder="Пароль" className="form__text form__text_theme_dark" minLength="8" maxLength="16" required />
            <span className="form__input-error" id="profile-job-error"></span>
        </Logo>
    )
}

export default Register;