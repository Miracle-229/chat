import axios from "axios";
//запросы на бэк для чата

class ChatService {
    static async sendMessage(message) {
        console.log('Send message: ' + message);
        return await axios.post("http://localhost:8080/api/chat",
                {
                    text: message
                }
        );
    }

    static async editMessage(messageId, newText) {
        return await axios.put("http://localhost:8080/api/chat/" + messageId,
                {text: newText}
        );
    }

    static async findHistory(page, size) {//динамический скроллинг
        return await axios.get("http://localhost:8080/api/chat",
            {
                params: {page: page, size: size}
            }
        );
    }

    static async deleteMessage(messageId) {
        return await axios.delete("http://localhost:8080/api/chat/" + messageId,
                {}
        );
    }
}


export default ChatService;