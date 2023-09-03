export const userChat = (userChatInitial = [], action) => {
    switch (action.type) {
        case "setChats":
            return action.payload;
        default:
            return userChatInitial;
    }
}