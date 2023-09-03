export const otherUserChat = (otherUserChat = [], action) => {
    switch (action.type) {
        case "setChats":
            return action.payload;
        default:
            return otherUserChat;
    }
}