/* Browser-local ranking identity: no account information is needed. */
(function () {
    const ID_COOKIE = 'wb_player_id';
    const NAME_COOKIE = 'wb_player_name';
    const ID_STORAGE = 'wb_player_id';
    const NAME_STORAGE = 'wb_nickname';
    const COOKIE_AGE = 60 * 60 * 24 * 365 * 10;

    function readCookie(name) {
        const prefix = `${name}=`;
        const cookie = document.cookie.split('; ').find(item => item.startsWith(prefix));
        return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
    }

    function writeCookie(name, value) {
        const secure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${COOKIE_AGE}; Path=/; SameSite=Lax${secure}`;
    }

    function randomId() {
        if (window.crypto?.randomUUID) return `guest_${window.crypto.randomUUID()}`;
        const values = new Uint32Array(4);
        if (window.crypto?.getRandomValues) window.crypto.getRandomValues(values);
        else for (let i = 0; i < values.length; i++) values[i] = Math.floor(Math.random() * 0xffffffff);
        return `guest_${Array.from(values, value => value.toString(36)).join('')}`;
    }

    function generatedNickname() {
        return `PLAYER-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    }

    function ensure() {
        let id = readCookie(ID_COOKIE) || localStorage.getItem(ID_STORAGE);
        let nickname = readCookie(NAME_COOKIE) || localStorage.getItem(NAME_STORAGE);
        if (!id) id = randomId();
        if (!nickname) nickname = generatedNickname();
        writeCookie(ID_COOKIE, id);
        writeCookie(NAME_COOKIE, nickname);
        localStorage.setItem(ID_STORAGE, id);
        localStorage.setItem(NAME_STORAGE, nickname);
        return { id, nickname };
    }

    function setNickname(value) {
        const nickname = String(value || '').trim();
        if (!nickname) throw new Error('Nickname is required');
        ensure();
        writeCookie(NAME_COOKIE, nickname);
        localStorage.setItem(NAME_STORAGE, nickname);
        return nickname;
    }

    window.WebBeatIdentity = {
        ensure,
        getId: () => ensure().id,
        getNickname: () => ensure().nickname,
        setNickname
    };
    ensure();
})();
