import React from 'react';
import logo from '../images/header-logo.svg'
import { NavLink, useLocation } from 'react-router-dom';

function Header(props) {

    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    function handleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    function handleSingOut() {
        setIsMenuOpen(false);
        props.onSignOut();
    }

    const headerClassName = (`header ${props.loggedIn ? 'header__row-revers' : ''}`);
    const menuClassName = (`header__container ${isMenuOpen ? 'header__container_opened' : ''}`);
    const buttonMenuClassName = (`header__button-menu ${isMenuOpen ? 'header__button-menu_opened' : ''}`)

    return (
        <header className={headerClassName}>
            {props.loggedIn &&
                (
                    <div className={menuClassName}>
                        <p className="header__email">{props.userEmail}</p>
                        <button className="header__button" type="button" onClick={handleSingOut}>Выйти</button>
                    </div>
                )
            }
            <div className="header__container-main">
                <img src={logo} alt="Место" className="header__logo" />
                {props.loggedIn &&
                    (
                        <button className={buttonMenuClassName}
                            type="button"
                            aria-label="Меню"
                            onClick={handleMenu}
                        />
                    )
                }
                {!props.loggedIn &&
                    (
                        <nav>
                            {location.pathname === '/sign-in' &&
                                (
                                    <NavLink className="header__navLink" to="/sign-up">Регистрация</NavLink>
                                )
                            }
                            {location.pathname === '/sign-up' &&
                                (
                                    <NavLink className="header__navLink" to="/sign-in">Войти</NavLink>
                                )
                            }
                        </nav>
                    )
                }
            </div>
        </header>
    );
}

export default Header;