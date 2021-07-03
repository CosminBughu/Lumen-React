const redirectAfterLogin = (state = false, action) => {
    switch (action.type) {
        case 'SET_URL':
            state = action.payload;
            break;
        default:
            return state;
    }

    return state;
};

export default redirectAfterLogin;
