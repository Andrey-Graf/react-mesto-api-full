import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer'
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import api from '../utils/Api';
import auth from '../utils/Auth';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopupOpen from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import { Route, Redirect, Switch, useHistory } from 'react-router-dom';
import Register from './Register';
import InfoTooltip from './InfoTooltip';


function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
    const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);

    const [currentUser, setCurrentUser] = React.useState({});

    const [selectedCard, setSelectedCard] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [cardDelet, setCardDelet] = React.useState({});

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isSignUp, setIsSignUp] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState(null);

    const history = useHistory();

    // Общая функция закрытия попап.
    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsConfirmPopupOpen(false);
        setIsImagePopupOpen(false);
        setIsInfoTooltipPopupOpen(false);
        setSelectedCard({});
    }

    //Закрыть попап нажатием на клавишу "Escape".
    React.useEffect(() => {
        function handleEscClose(evt) {
            if (evt.key === "Escape") {
                closeAllPopups();
            }
        }
        document.addEventListener("keydown", handleEscClose);

        return () => {
            document.removeEventListener("keydown", handleEscClose);
        };
    }, []);

    //Закрытие попап кликом по "Overlay".
    React.useEffect(() => {
        function handleOverlayClose(evt) {
            if (evt.target.classList.contains("popup_opened")) {
                closeAllPopups();
            }
        }
        document.addEventListener("click", handleOverlayClose);

        return () => {
            document.removeEventListener("click", handleOverlayClose);
        };
    }, []);

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
    }

    function handleConfirmClick(card) {
        setCardDelet(card);
        setIsConfirmPopupOpen(!isConfirmPopupOpen);
    }

    function handleInfoTooltipPopupOpen() {
        setIsInfoTooltipPopupOpen(!isInfoTooltipPopupOpen);
    }

    React.useEffect(() => {
        api.getInitial().then((data) => {
            const [userData, cardData] = data;
            setCurrentUser(userData);
            setCards(cardData);
        }).catch((err) => {
            console.log(err);
        })
    }, [])

    // Функци обновления данных пользователя.
    function handleUpdateUser(data) {
        api.setUserInfo(data).then((data) => {
            setCurrentUser(data);
            closeAllPopups();
        }).catch((err) => {
            console.log(err);
        })
    }
    // Функция обновить аватар.
    function handleUpdateAvatar(data) {
        api.setUserAvatar(data).then((data) => {
            setCurrentUser(data);
            closeAllPopups();
        }).catch((err) => {
            console.log(err);
        })
    }

    // Функция открытия попап с фотографией.
    function handleCardClick(card) {
        setSelectedCard(card);
        setIsImagePopupOpen(!isImagePopupOpen)
    }

    // Функция like/disLike.
    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        }).catch((err) => {
            console.log(err);
        })
    }

    //Функция удаления карточки.
    function handleCardDelete(evt) {
        evt.preventDefault();
        api.deleteCard(cardDelet).then(() => {
            const newCard = cards.filter((elem) => elem !== cardDelet);
            setCards(newCard);
            closeAllPopups();
        }).catch((err) => {
            console.log(err);
        })
    }

    function handleAddPlaceSubmit(data) {
        api.postCard(data).then((newCard) => {
            setCards([newCard, ...cards]);
            closeAllPopups();
        })
            .catch((err) => {
                console.log(err);
            })
    }

    function handleRegister(data) {
        auth.register(data)
            .then(() => {
                setIsSignUp(true);
                handleInfoTooltipPopupOpen();
                history.push('/sign-in')
            }).catch((err) => {
                if (err.status === 400) {
                    console.log("400 - некорректно заполнено одно из полей");
                }
                setIsSignUp(false);
                handleInfoTooltipPopupOpen();
            })
    }

    function handleAuthorize(data) {
        auth.authorize(data)
            .then((res) => {
                setIsLoggedIn(true);
                localStorage.setItem('jwt', res.token);
                setUserEmail(data.email);
                history.push('/');
            }).catch((err) => {
                if (err.status === 400) {
                    console.log("400 — не передано одно из полей");
                } else if (err.status === 401) {
                    console.log("401 — пользователь с email не найден");
                }
            })
    }

    React.useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            auth.checkToken(jwt)
                .then((res) => {
                    setIsLoggedIn(true);
                    setUserEmail(res.data.email);
                    history.push('/');
                })
                .catch((err) => {
                    if (err.status === 400) {
                        console.log("400 — Токен не передан или передан не в том формате");
                    } else if (err.status === 401) {
                        console.log("401 — Переданный токен некорректен");
                    }
                });
        }
    }, [history]);

    function handleSignOut() {
        setIsLoggedIn(false);
        localStorage.removeItem('jwt');
        history.push('/sign-in');
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Header
                loggedIn={isLoggedIn}
                onSignOut={handleSignOut}
                userEmail={userEmail}
            />
            <Switch>
                <ProtectedRoute
                    exact path="/"
                    component={Main}
                    loggedIn={isLoggedIn}
                    cards={cards}
                    onEditAvatar={handleEditAvatarClick}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    onCardDelete={handleConfirmClick}
                    onCardLike={handleCardLike}
                />
                <Route path="/sign-up">
                    <Register
                        onRegister={handleRegister}
                    />
                </Route>
                <Route path="/sign-in">
                    <Login
                        onLogin={handleAuthorize}
                    />
                </Route>
                <Route>
                    {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
                </Route>
            </Switch>
            <Footer />
            <EditProfilePopupOpen
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser} />
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit} />
            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar} />
            <PopupWithForm
                onSubmit={handleCardDelete}
                title="Вы уверены ?"
                name="confirm"
                isOpen={isConfirmPopupOpen}
                onClose={closeAllPopups}
                ariaLabel="Да"
                buttonText="Да" />
            <ImagePopup
                isOpen={isImagePopupOpen}
                onClose={closeAllPopups}
                card={selectedCard} />
            <InfoTooltip
                isOpen={isInfoTooltipPopupOpen}
                onClose={closeAllPopups}
                isSign={isSignUp}
            />
        </CurrentUserContext.Provider>
    );
}


export default App;