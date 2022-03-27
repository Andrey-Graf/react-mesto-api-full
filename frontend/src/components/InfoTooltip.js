import React from "react";
import signUpImg from '../images/sign-up.svg';
import failSignUpImg from '../images/fail-sign-up.svg';


function InfoTooltip(props) {
    return (
        <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__container">
                <img className="popup__img" src={props.isSign ? signUpImg : failSignUpImg} alt={props.isSign ? 'успешная регистрация' : 'не удолось зарегистрировать'} />
                <h3 className="popup__title">
                    {props.isSign ? 'Вы успешно зарегистрировались' : 'Что-то пошло не так! Попробуйте ещё раз.'}
                </h3>
                <button className="popup__button-close" aria-label="закрыть" onClick={props.onClose}></button>
            </div>
        </div>
    )
}

export default InfoTooltip;