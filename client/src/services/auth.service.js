import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_HOST}/api/auth/`;

class AuthService {

  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          sessionStorage.setItem("user", JSON.stringify(response.data));

        }

        return response.data;
      });
  }
  twoFactorAuth(username,verificationCode) {
    return axios
      .post(API_URL + "signin/2fa", {
        username,
        verificationCode
      })
      .then(response => {
        if (response.data.accessToken) {
          sessionStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    sessionStorage.removeItem("user");
  }
  runLogoutTimer() {
    setTimeout(() => {
        this.logout();
    }, 5000);
}


  create_historique_auth(username,password,message){
    return axios.post(API_URL + "historique", {
      username,
      password,
      message

    });

  }
    get_historique_auth(){
    return axios.get(API_URL + "list_historique");

  };
  removeAll_historique_auth () {
    return axios.delete(API_URL +`list_historique`);
  };
  remove_historiqueremove(id) {
    return axios.delete(API_URL +`list_historique/${id}`);
  };

  register(username, email,roles, password,) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      roles,
      password,

    });
  }
 

  // Nouvelle méthode : Modifier un utilisateur (via API)
  updateUser(userId, username, email,roles){
    return axios.put(API_URL + `update_user/${userId}`, {
      username,
      email,
      roles,
    })
  }
  // Nouvelle méthode : Modifier un utilisateur (via API)
  deleteUser(userId) {
    return axios.delete(API_URL + `user_delete/${userId}`)
  }
  
  

  getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('user'));;
  }
  changePassword(userId, oldPassword, newPassword) {
    return axios.post(API_URL + "change-password", {
      userId,
      oldPassword,
      newPassword,
    });
  }
  // Forgot Password
  forgotPassword(email) {
    return axios.post(API_URL + 'reset-password', {
      email
    });
  }

  // Reset Password with Token
  resetPassword(resetToken, newPassword) {
    return axios.post(API_URL + `modifier-password`, {
      resetToken,
      newPassword
      
    });
  }
  
}

export default new AuthService();
