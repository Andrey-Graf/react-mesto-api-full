import React from "react";
import Logo from "./Logo";


function Login(props) {

    const [isLoginData, setIsLoginData] = React.useState({
        password: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIsLoginData({
            ...isLoginData,
            [name]: value,
        });
    };

    function handleSubmit(e) {
        e.preventDefault();
        
        props.onLogin(isLoginData)
    }

    return (
        <Logo
            title="Вход"
            buttonText="Войти"
            onSubmit={handleSubmit}
        >
            <input value={isLoginData.email || ''} onChange={handleChange} type="email" name="email" id="login-email" placeholder="email" className="form__text form__text_theme_dark" maxLength="40" required autoComplete="off" />
            <span className="form__input-error" id="login-email-error"></span>
            <input value={isLoginData.password || ''} onChange={handleChange} type="password" name="password" id="login-password" placeholder="Пароль" className="form__text form__text_theme_dark" minLength="8" maxLength="16" required autoComplete="off" />
            <span className="form__input-error" id="profile-job-error"></span>
        </Logo>
    )
}

export default Login;