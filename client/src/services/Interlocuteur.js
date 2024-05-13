import axios from "axios";


const API_URL = `${process.env.REACT_APP_API_HOST}/api/auth/`;



class AuthInterlocuteur {

//creation de l'interlocuteur
  create(data){
    return axios.post(API_URL + "interlocuteur", data);
  }
 
//afficher les interlocuteurs
  findAll(){
    return axios.get(API_URL + "interlocuteur");

  };

//modifier les interlocuteurs
  update = (id, data) => {
  return  axios.put(API_URL + `interlocuteur/update/${id}`, data);
};
archiveExpired() {
  return axios.get(API_URL + "archiveInterlocuteur");
}
 
}

export default new AuthInterlocuteur();