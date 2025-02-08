import axios from 'axios';
import authHeader from './auth-header';

const API_URL = `${process.env.REACT_APP_API_HOST}/api/test/`;

class UserService {
  getListe_User() {
 
    return axios.get(API_URL + 'liste_user' ,{ headers: authHeader() });
  }
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getCemecaBoard() {
    return axios.get(API_URL + 'cemeca', { headers: authHeader() });
  }
  getSofitechBoard() {
    return axios.get(API_URL + 'sofitech', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin-societe', { headers: authHeader() });
  }
   // Nouvelle méthode : Supprimer un utilisateur
   deleteUser(userId) {
    return axios.delete(API_URL + `delete_user/${userId}`, { headers: authHeader() });
  }

  // Nouvelle méthode : Modifier un utilisateur (via API)
  updateUser = (userId, userData) => {
    return axios.put(API_URL + `update_user/${userId}`, userData, {
      headers: authHeader(),
    })
  }
}

export default new UserService();
