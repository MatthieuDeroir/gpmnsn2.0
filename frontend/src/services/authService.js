import axios from "axios";
import { config } from '../config'
import jwtDecode from "jwt-decode";

class AuthService {
    login(username, password) {
        return axios.post(config.domain_name +"/auth/signin", {
            username,
            password
        }).then((response) => {
            if (response.data.accessToken) {
                const token = response.data.accessToken;
                const decodedToken = jwtDecode(token); // replaced jwt with jwtDecode
                const expirationTime = decodedToken.exp * 1000; // convert to milliseconds

                // store token, user info and expiration time in localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("tokenExpiration", expirationTime);

                // check token validity every minute
                setInterval(() => {
                    const now = Date.now(); // current time in milliseconds
                    const tokenExpirationTime = localStorage.getItem("tokenExpiration");

                    // if token is expired
                    if (now >= tokenExpirationTime) {
                        this.logout();
                    }
                }, 60000); // check every minute

                return response.data;
            }
        });
    }
    logout() {
        localStorage.removeItem("user");
        window.location.reload();
        window.location.href("/login");
    }
    register(username, password, role) {
        let roles = [];
        roles[0] = role;
        console.log('services/register');
        return axios.post(config.domain_name +"/auth/signup", {
            username,
            password,
            roles
        });
    }

    updateUser(_id, role) {
        let roles = [];
        console.log(_id)
        roles[0] = role;
        return axios.put(config.domain_name +"/user/" + _id, {
            roles
        });
    }
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();