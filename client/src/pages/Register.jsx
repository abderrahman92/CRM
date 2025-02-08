
import React, { useState, useRef ,useEffect} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import checkForm from "../common/Register/checkedForm"
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { makeStyles } from '@material-ui/core/styles';
import moment from "moment";
import 'moment/locale/fr';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Grid,
  Typography,
  TablePagination,
  TableFooter,
} from '@material-ui/core';


const Register = (props) => {
  //css style
  //css
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 200,
  },
  tableContainer: {
      borderRadius: 15,
      margin: '10px 10px',
      maxWidth: 950
  },
  tableHeaderCell: {
      fontWeight: 'bold',
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.getContrastText(theme.palette.primary.dark)
  },
  avatar: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.getContrastText(theme.palette.primary.light)
  },
  name: {
      fontWeight: 'bold',
      color: theme.palette.secondary.dark
  },
  status: {
      fontWeight: 'bold',
      fontSize: '0.75rem',
      color: 'white',
      backgroundColor: 'grey',
      borderRadius: 8,
      padding: '3px 10px',
      display: 'inline-block'
  }
}));
    //variable liste des UserService
  const [listuser,setListeUser] = useState([]);
   //variable liste authetification
   const [listauth, setListeAuth] = useState([]);
   const listauthRef = useRef();
   listauthRef.current = listauth;
  //register user variable
  const form = useRef();
  const checkBtn = useRef();
  const vrole = checkForm.vrole;
  const vusername =checkForm.vusername;
  const vpassword = checkForm.vpassword;
  const vemail = checkForm.vemail;
  const required = checkForm.required;
//les status des variable
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [rolesupdate, setRolesupdate] = useState([]);
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
 //useEffect de toute la table Register
  useEffect(() => {
    retrieveTutorials();
    retrieveUsers();
  }, []);



 //afficher la liste des users
  const retrieveUsers = () => {
    UserService.getListe_User()
      .then((response) => {
        setListeUser(response.data);

      })
  };



   //afficher la liste des hauthentification
  const retrieveTutorials = () => {
    AuthService.get_historique_auth()
      .then((response) => {
        setListeAuth(response.data);
      })

  };
  listauth.sort((b, a) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());




  //liste des users
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [editingUser, setEditingUser] = useState(null);

  const handleChangePage = ( newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleUpdate = (userId) => {
    const user = listuser.find((user) => user.id === userId);
    if (user) {
      setEditingUser(userId);
      setUsername(user.username);
      setEmail(user.email); // Vous pourriez vouloir cacher le mot de passe ou ne pas l'afficher
    }
  };
  

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    setMessage(""); // Réinitialiser le message
    setSuccessful(false); // Réinitialiser l'état de succès

    // Validation du formulaire
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      const userData = { username, email, roles };
      console.log(userData,editingUser,"testetst")
      AuthService.updateUser(editingUser,username, email,rolesupdate).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        },
        (error) => {
          const resMessage = error.response?.data?.message || error.message || error.toString();
          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  const handleDelete = (userId) => {
    // Demander une confirmation avant de supprimer
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      AuthService.deleteUser(userId).then(
        (response) => {
          // Mettre à jour l'état ou réactualiser la liste des utilisateurs après la suppression
          setMessage(response.data.message);
          setSuccessful(true);  // Par exemple, si vous avez une fonction qui récupère tous les utilisateurs
        },
        (error) => {
          const resMessage = error.response?.data?.message || error.message || error.toString();
          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  
  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };
  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };
  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };
  const onChangeRoles = (e) => {
    const role = e.target.value;
    setRoles((prevRoles) => {
        // Vérifie si le rôle existe déjà dans la liste
        if (prevRoles && prevRoles.includes(role)) {
            return prevRoles; // Ne rien faire si le rôle existe déjà
        }
        return [...(prevRoles || []), role]; // Ajouter le rôle s'il n'existe pas
    });
};


  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email,roles, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        },

        (error) => {
            console.log(roles)
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };


    return (
      <div className="col-md-12">

        <h1>
          gestion utilisateur
        </h1>
    {/* liste des users */}
        <div className="card card-container">
          <div className="list row">
            <div className="col-md-12 list">
              <h3>Listes des Utilisateurs</h3>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableHeaderCell}>nom</TableCell>
                          <TableCell className={classes.tableHeaderCell}>email</TableCell>
                          <TableCell className={classes.tableHeaderCell}>password</TableCell>
                          <TableCell className={classes.tableHeaderCell}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listuser.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                          <TableRow key={row.name}>
                            <TableCell>
                                <Grid container>
                                    <Grid item lg={2}>
                                        <Avatar alt={row.name} src='.' className={classes.avatar}/>
                                    </Grid>
                                    <Grid item lg={10}>
                                        <Typography className={classes.name}>{row.name}</Typography>
                                        <Typography color="textSecondary" variant="body2">{row.username}</Typography>

                                    </Grid>
                                </Grid>
                              </TableCell>
                            <TableCell>
                                <Typography color="primary" variant="subtitle2">{row.email}</Typography>
                                <Typography color="textSecondary" variant="body2">{row.company}</Typography>
                              </TableCell>
                            <TableCell>*********</TableCell>
                         
                              <TableCell> {/* Ajouter des boutons d'action ici */}
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleUpdate(row.id)}
                                >
                                  Modifier
                                </button>
                                <button
                                  className="btn btn-danger"  // Style pour un bouton de suppression
                                  onClick={() => handleDelete(row.id)}  // Fonction de suppression avec l'ID de l'utilisateur
                                >
                                  Supprimer
                                </button>
                               
                              </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                      <TablePagination
                          rowsPerPageOptions={[5, 10, 15]}
                          component="div"
                          count={listuser.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onChangePage={handleChangePage}
                          onChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                      </TableFooter>
                    </Table>
                  </TableContainer>
            </div>
          </div>
        </div>
        {editingUser && (
        <Dialog open={Boolean(editingUser)} onClose={() => setEditingUser(null)}>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogContent>
            <Form onSubmit={handleSubmitUpdate} ref={form}>
              <TextField
                label="Nom d'utilisateur"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
             
             <div className="form-check container">
                        <div className="row">
                        <label className="form-check-label" htmlFor="role">cemeca</label>
                        <Input
                          type="checkbox"
                          className="form-check"
                          name="cemeca"
                          value="1"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                        <label className="form-check-label" htmlFor="role">sofitech</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="sofitech"
                          value="2"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                        <label className="form-check-label" htmlFor="role">admin cemeca</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="admin_cemeca"
                          value="3"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                        <label className="form-check-label" htmlFor="role">admin sofitech</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="admin_sofitech"
                          value="4"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                        </div>
                          <label className="form-check-label" htmlFor="role">super_cemeca</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="super_cemeca"
                          value="5"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                          <label className="form-check-label" htmlFor="role">super_sofitech</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="super_sofitech"
                          value="6"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                          <label className="form-check-label" htmlFor="role">super_admin</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="super_admin1"
                          value="7"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                        <label className="form-check-label" htmlFor="role">super_admin2</label>
                        <Input
                        type="checkbox"
                        className="form-check"
                        name="super_admin2"
                        value="8"
                        onChange={onChangeRoles}
                        validations={[required, vrole]}
                      />
                      </div>
              <Button type="submit" color="primary">
                Enregistrer les modifications
              </Button>
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingUser(null)} color="secondary">
              Annuler
            </Button>
          </DialogActions>
        </Dialog>
      )}
  
  {message && <div className={`alert ${successful ? "alert-success" : "alert-danger"}`}>{message}</div>}

    {/* liste des connections */}
        <div className="card card-container">
          <div className="list row">
            <div className="col-md-12 list">
              <h3>Historique des Authentifications</h3>

                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableHeaderCell}>Username</TableCell>
                          <TableCell className={classes.tableHeaderCell}>Password</TableCell>
                          <TableCell className={classes.tableHeaderCell}>Message</TableCell>
                          <TableCell className={classes.tableHeaderCell}>Date De Connection</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listauth.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                          <TableRow key={row.name}>
                            <TableCell>
                                <Grid container>
                                    <Grid item lg={2}>
                                        <Avatar alt={row.name} src='.' className={classes.avatar}/>
                                    </Grid>
                                    <Grid item lg={10}>
                                        <Typography className={classes.name}>{row.name}</Typography>
                                        <Typography color="textSecondary" variant="body2">{row.username}</Typography>

                                    </Grid>
                                </Grid>
                              </TableCell>

                            <TableCell>{row.password}</TableCell>
                            <TableCell>
                                <Typography
                                  className={classes.status}
                                  style={{
                                      backgroundColor:
                                      ((row.message === 'Connexion établie  !' && 'green') ||
                                      (row.message === 'Connexion échouée  !' && 'red'))
                                  }}
                                >{row.message}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography color="primary" variant="subtitle2">{moment(row.date_connection).format("DD  MMMM YYYY HH:mm")}</Typography>

                              </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                      <TablePagination
                          rowsPerPageOptions={[5, 10, 15]}
                          component="div"
                          count={listauth.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          onChangePage={handleChangePage}
                          onChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                      </TableFooter>
                    </Table>
                  </TableContainer>
            </div>
          </div>
        </div>
    {/* ajouter un user */}
          <div className="card card-container">
            <h3>Ajouter un utilisateur</h3>
              <Form onSubmit={handleRegister} ref={form}>
                {!successful && (
                    <div>
                      <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="username"
                          value={username}
                          onChange={onChangeUsername}
                          validations={[required, vusername]}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <Input
                          type="text"
                          className="form-control"
                          name="email"
                          value={email}
                          onChange={onChangeEmail}
                          validations={[required, vemail]}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Input
                          type="password"
                          className="form-control"
                          name="password"
                          value={password}
                          onChange={onChangePassword}
                          validations={[required, vpassword]}
                        />
                      </div>

                      <div className="form-check container">
                        <div className="row">
                        <label className="form-check-label" htmlFor="role">cemeca</label>
                        <Input
                          type="checkbox"
                          className="form-check"
                          name="cemeca"
                          value="1"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                        <label className="form-check-label" htmlFor="role">sofitech</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="sofitech"
                          value="2"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                        <label className="form-check-label" htmlFor="role">admin cemeca</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="admin_cemeca"
                          value="3"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                        <label className="form-check-label" htmlFor="role">admin sofitech</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="admin_sofitech"
                          value="4"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                        </div>
                          <label className="form-check-label" htmlFor="role">super_cemeca</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="super_cemeca"
                          value="5"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                          <label className="form-check-label" htmlFor="role">super_sofitech</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="super_sofitech"
                          value="6"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                          <label className="form-check-label" htmlFor="role">super_admin</label>
                          <Input
                          type="checkbox"
                          className="form-check"
                          name="super_admin1"
                          value="7"
                          onChange={onChangeRoles}
                          validations={[required, vrole]}
                        />
                        <label className="form-check-label" htmlFor="role">super_admin2</label>
                        <Input
                        type="checkbox"
                        className="form-check"
                        name="super_admin2"
                        value="8"
                        onChange={onChangeRoles}
                        validations={[required, vrole]}
                      />
                      </div>

                      <div className="form-group">
                        <button className="btn btn-primary btn-block">Ajouter</button>
                      </div>
                    </div>
                  )}

                  {message && (
                    <div className="form-group">
                      <div
                        className={
                          successful
                            ? "alert alert-success"
                            : "alert alert-danger"
                        }
                        role="alert"
                      >
                        {message}
                      </div>
                    </div>
                  )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
              </Form>
          </div>
        </div>
    );
  }
  export default Register;

