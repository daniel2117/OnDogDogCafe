const AUTH_KEY = 'reservation_auth';

export const authService = {
    saveReservationAuth: (data) => {
        localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    },

    getReservationAuth: () => {
        const auth = localStorage.getItem(AUTH_KEY);
        return auth ? JSON.parse(auth) : null;
    },

    clearReservationAuth: () => {
        localStorage.removeItem(AUTH_KEY);
    }
};