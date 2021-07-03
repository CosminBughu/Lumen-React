export const onResize = (payload = {}) => {
    return {
        payload,
        type: 'WINDOW_RESIZE'
    };
};
