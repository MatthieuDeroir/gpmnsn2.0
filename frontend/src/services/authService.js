import axios from "axios";
import { config } from '../config'


class AuthService {
    login(username, password) {
        return axios.post(config.domain_name +"/auth/signin", {
            username,
            password
        }).then(response => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));

            }
            return response.data;
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