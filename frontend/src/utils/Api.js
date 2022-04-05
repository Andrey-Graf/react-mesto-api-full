class Api {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }

    _handleResponse(res) {
        if (res.ok) {
            return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
    }

    getUserInfo(token) {
        return fetch(`${this._url}/users/me`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
            }
        }).then(this._handleResponse);
    }

    getCard(token) {
        return fetch(`${this._url}/cards`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
            }
        }).then(this._handleResponse);
    }

    postCard(data, token) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: data.name,
                link: data.link
            })
        }).then(this._handleResponse);
    }

    deleteCard(id, token) {
        return fetch(`${this._url}/cards/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
            }
        }).then(this._handleResponse);
    }

    changeLikeCardStatus(id, isLiked, token) {
        if (isLiked) {
            return this.deleteLike(id, token);
        } else {
            return this.setLike(id, token);
        }
    }

    setLike(id, token) {
        return fetch(`${this._url}/cards/${id}/likes`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
            }
        }).then(this._handleResponse);
    }

    deleteLike(id, token) {
        return fetch(`${this._url}/cards/${id}/likes`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
            }
        }).then(this._handleResponse);
    }

    setUserInfo(data, token) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        }).then(this._handleResponse);
    }

    setUserAvatar(data, token) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                ...this._headers,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                avatar: data.avatar
            })
        }).then(this._handleResponse);
    }

    getInitial(token) {
        return Promise.all([this.getUserInfo(token), this.getCard(token)]);
    }
}

const api = new Api({
    url: 'https://api.lebedev.students.nomoredomains.xyz',
    headers: {
        // authorization: `Bearer ${localStorage.getItem('jwt')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
});

export default api;