import axios from 'axios';
import { config } from '../config'
import authHeader from "./authHeader";
const API_URL = 'http://' + config.ip + ':' + config.port;

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all');
    }
    getUserBoard() {
        return axios.get(API_URL + 'user');
    }
    getAdminBoard() {
        return axios.get(API_URL + 'admin');
    }
    getSuperuserBoard() {
        return axios.get(API_URL + 'superuser');
    }
}

export default new UserService();