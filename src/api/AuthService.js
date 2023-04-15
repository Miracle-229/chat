import axios from "axios";
//запросы на бэк для авторизации 

class AuthService {
    static async auth(login, password, path) {
        return await axios.post("http://localhost:8080/api/auth/" + path, {
            login: login,
            password: password
        });
    }

    static async login(login, password) {
        return await AuthService.auth(login, password, "login");
    }

    static async signUp(login, password, confirmPassword) {
        return await AuthService.auth(login, password, "signup");
    }
}

export default AuthService;