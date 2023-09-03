export const openChat = (openChat = {name : '', number : ''}, action) => {
    switch (action.type) {
        case "setOpenChat":
            return action.payload;
        default:
            return openChat;
    }
}