import React from "react";

function Logo(props) {
    return (
        <form className="form form_theme_dark" onSubmit={props.onSubmit}>
            <h2 className="form__title">{props.title}</h2>
            {props.children}
            <button className="form__button-save">{props.buttonText}</button>
            {props.link}
        </form>
    )
}

export default Logo;