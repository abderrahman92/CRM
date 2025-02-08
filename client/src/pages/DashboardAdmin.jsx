import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "moment/locale/fr";
import Stack from "@mui/material/Stack";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
//table class
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from "@mui/material/IconButton";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import SvgIcon from "@mui/material/SvgIcon";
import PropTypes from "prop-types";
//controlleurs
import UserService from "../services/user.service";
import RoleUser from "../controllers/Role";
import Societe from "../controllers/Societe";

//require page Action
import AuthAction from "../services/Action";
//require page Interlocuteur
import AuthInter from "../services/Interlocuteur";

const FontAwesomeSvgIcon = React.forwardRef((props, ref) => {
  const { icon } = props;

  const {
    icon: [width, height, , , svgPathData],
  } = icon;

  return (
    <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
      {typeof svgPathData === "string" ? (
        <path d={svgPathData} />
      ) : (
        /**
         * A multi-path Font Awesome icon seems to imply a duotune icon. The 0th path seems to
         * be the faded element (referred to as the "secondary" path in the Font Awesome docs)
         * of a duotone icon. 40% is the default opacity.
         *
         * @see https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons#changing-opacity
         */
        svgPathData.map((d, i) => (
          <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
        ))
      )}
    </SvgIcon>
  );
});

FontAwesomeSvgIcon.propTypes = {
  icon: PropTypes.any.isRequired,
};

const DashboardAdmin = () => {
  const history = useHistory();
  const handleClickGoToUsers = (userId) => {
    history.push({
      pathname: `/user/${userId}`,
      state: {
        fltr_date,
      },
    });
  };
  const [listuser, setListeUser] = useState([]);
  const [societe, setsociete] = useState([]);
  const [interlocuteur, setInterlocuteur] = useState([]);
  const [ListeAction, SetAction] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [valueDate1, setValueDate1] = React.useState("");
  const [valueDate2, setValueDate2] = React.useState("");
  const [search, setSearch] = useState("");
  //GET role sofitech
  const mysofitech = RoleUser.SofitechRole();
  //GET role cemece
  const mycemeca = RoleUser.CemecaRole();
  //GET societer
  //SELECT WHERE SEARCH INPUT

  //Date change Action
  const mysn = 1000 * 3600 * 24;
  const fltr_date = ListeAction.filter(
    (task) =>
      (new Date(task.date_rdv) - valueDate2) / mysn < 0 &&
      (new Date(task.date_rdv) - valueDate1) / mysn > 0
  );
  const fltr_inter = interlocuteur.filter(
    (task) =>
      (new Date(task.createdAt) - valueDate2) / mysn < 0 &&
      (new Date(task.createdAt) - valueDate1) / mysn > 0
  );
  const fltr_societe = societe.filter(
    (task) =>
      (new Date(task.createdAt) - valueDate2) / mysn < 0 &&
      (new Date(task.createdAt) - valueDate1) / mysn > 0
  );

  console.log(fltr_inter, fltr_societe, fltr_date);
  

  const handleChangeDate1 = (newValue) => {
    setValueDate1(newValue);
  };
  const handleChangeDate2 = (newValue) => {
    setValueDate2(newValue);
  };
  //afficher la liste des users
  const retrieveUsers = () => {
    UserService.getListe_User()
      .then((response) => {
        setListeUser(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //afficher la liste des Actions
  const retrieveActions = () => {
    AuthAction.findAll()
      .then((response) => {
        SetAction(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //afficher la liste des interlocuteur
  const retrieveInter = () => {
    AuthInter.findAll()
      .then((response) => {
        setInterlocuteur(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //afficher la liste des societes
  const retrieveSociete = () => {
    //afficher cemca
    if (mycemeca) Societe.CemecaListe().then((data) => setsociete(data));
    //afficher sofitech
    if (mysofitech) Societe.AllSociete().then((data) => setsociete(data));
  };

  useEffect(() => {
    retrieveUsers();
    retrieveActions();
    retrieveInter();
    retrieveSociete();
  }, [mysofitech, mycemeca]);

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      {/* si le client est connecter*/}
      {currentUser ? (
        <div>
          <h2 className="page-header">Tableau de bord Admin</h2>
          <div className="row">
            {/* SEARCH INPUT */}
            {/* activiter commercial cree */}
            <div className="col-12">
              <div className="card">
                <div className="card__body">
                  <div className="row">
                    <div className="col-3">
                      <p>Date début d'action</p>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Stack spacing={5}>
                          <DesktopDatePicker
                            value={valueDate1}
                            onChange={handleChangeDate1}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </div>
                    <div className="col-3">
                      <p>Date fin d'action</p>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Stack spacing={5}>
                          <DesktopDatePicker
                            value={valueDate2}
                            onChange={handleChangeDate2}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </div>
                    <div className="col-6">
                      <p>Trouvé un utilisateur</p>
                      <div className="topnav__search">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Recherche "
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <i className="bx bx-search"></i>
                      </div>
                    </div>
                  </div>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Nom</TableCell>
                          <TableCell align="center">Action </TableCell>
                          <TableCell align="center">Interlocuteur</TableCell>
                          <TableCell align="center">Societes</TableCell>
                          <TableCell align="center">info</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listuser
                          .filter((e) => {
                            return search.toLowerCase() === ""
                              ? e
                              : e.username
                                  .toLowerCase()
                                  .includes(search.toLowerCase());
                          })
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell align="center">
                                {row.username}
                              </TableCell>
                              <TableCell align="center">
                                {
                                  fltr_date.filter(
                                    (task) => task.id_utili === row.id
                                  ).length
                                }
                              </TableCell>
                              <TableCell align="center">
                                {
                                  fltr_inter.filter(
                                    (task) => task.id_utili === row.id
                                  ).length
                                }
                              </TableCell>
                              <TableCell align="center">
                                {
                                  fltr_societe.filter(
                                    (task) => task.id_utili === row.id
                                  ).length
                                }
                              </TableCell>
                              <TableCell
                                align="center"
                                style={{ minWidth: 50 }}
                              >
                                <IconButton
                                  aria-label="Example"
                                  onClick={() => handleClickGoToUsers(row.id)}
                                >
                                  <FontAwesomeSvgIcon icon={faFile} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[2, 5, 10]}
                    component="div"
                    labelRowsPerPage="lignes par page"
                    count={listuser.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ from, to, count }) =>
                      `Affichage des pages ${from}-${to} sur un total de  ${count} pages`
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="sidebar__item">
          <div disabled className={`sidebar__item-inner `}>
            <i className="bx bxs-user-x"></i>
            <span>pas connecter</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
