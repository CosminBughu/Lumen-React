export const setError = (payload = false) => {
    return {
        type: 'SET_ERROR',
        payload
    };
};
