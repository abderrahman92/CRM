import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UserService from "../services/user.service";
import AuthInterlocuteur from "../services/Interlocuteur";
import 'moment/locale/fr';
import Societe from '../controllers/Societe';
import axios from 'axios';
import moment from 'moment';
import * as XLSX from 'xlsx';


function InterlocuteurDetails() {
  const calculateTimeRemaining = (expirationDate) => {
    const now = moment();
    const expiration = moment(expirationDate);
    const duration = moment.duration(expiration.diff(now));
    const daysRemaining = duration.days();
    const hoursRemaining = duration.hours();
    const minutesRemaining = duration.minutes();

    let timeRemaining = '';
    if (daysRemaining > 0) {
      timeRemaining += `${daysRemaining} jour(s) `;
    }
    if (hoursRemaining > 0) {
      timeRemaining += `${hoursRemaining} heure(s) `;
    }
    if (minutesRemaining > 0) {
      timeRemaining += `${minutesRemaining} minute(s) `;
    }

    return timeRemaining.trim();
  };


  const [Inter, SetInter] = useState([]);
  const [search, setSearch] = useState('');
  const [listuser, setListeUser] = useState([]);
  const [listSoc, setSoc] = useState([]);
  const [message,setmessage] = useState("");

  const handleEmailConfirmation = async (interlocuteurId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/send_mail_confirmation_interlocuteur/${interlocuteurId}`);
      console.log(response.data);
      setmessage("success")
    } catch (error) {
      console.error('Erreur lors de la confirmation par e-mail:', error);
    }
  };

  const retrieveInterlocuteur = () => {
    AuthInterlocuteur.findAll()
      .then((response) => {
        SetInter(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retriveSociete = () => {
    Societe.AllSociete().then(data => setSoc(data))
  }

  const retrieveUsers = () => {
    UserService.getListe_User()
      .then((response) => {
        setListeUser(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveInterlocuteur();
    retrieveUsers();
    retriveSociete();
    AuthInterlocuteur.archiveExpired()
      .then((response) => {
        console.log('Interlocuteurs archivés :', response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de l\'archivage des interlocuteurs :', error);
      });
  }, []);

  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Interlocuteurs");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const handleExport = () => {
    const dataExport = Inter.map((interlocuteur) => {
      const user = listuser.find((user) => user.id === interlocuteur.id_utili);
      const userName = user ? user.username : 'Non trouvé';
      const soc = listSoc.find((societe) => societe.siret === interlocuteur.id_soc);
      const socName = soc ? soc.nom_soc : 'Non trouvée';
      let expirationDate = '';
      if (!interlocuteur.isConfirmed) {
        expirationDate = moment(interlocuteur.createdAt).add(30, 'days').format('YYYY-MM-DD');
      }

      return {
        'Nom': interlocuteur.nom,
        'Fonction': interlocuteur.fonction_inter,
        'Commercial': userName,
        'Société': socName,
        'Email': interlocuteur.email,
        'Téléphone': interlocuteur.tel,
        'Statut de Confirmation': interlocuteur.isConfirmed === 1 ? 'Confirmé' : interlocuteur.isConfirmed === 2 ? 'Plus tard' : 'En Attente',
        "Date d'Expiration": expirationDate,
      };
    });
    exportToExcel(dataExport, "Liste_Interlocuteurs");
  };
  console.log(message)

  return (
    <div className="row">
      <div className="col-12 list">
        <div className="topnav">
          <div className="topnav__search">
            <input
              type="text"
              className="form-control"
              placeholder="Recherche"
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className='bx bx-search'></i>
          </div>
          <Button onClick={handleExport} variant="contained" color="primary">
            Exporter vers Excel
          </Button>
        </div>
      </div>
      <div>
        <Box sx={{ minWidth: 275 }}>
          {Inter.filter((e) => {
            return search.toLowerCase() === ''
              ? e
              : e.nom.toLowerCase().includes(search.toLowerCase());
          }).map((e) => (
            <Card variant="outlined" key={e.id_interlocuteur}>
              <CardContent>
                <Typography variant="h5" component="div">
                  <i className='bx bxs-id-card'></i>: {e.nom}
                </Typography>
                <Typography variant="body2">
                  Fonction : {e.fonction_inter}
                </Typography>
                {(listuser.filter((task) => task.id === e.id_utili)).map((c) => (
                  <Typography variant="body2" key={c.id}>
                    Commercial : {c.username}
                  </Typography>
                ))}
                {(listSoc.filter((task) => task.siret === e.id_soc)).map((c) => (
                  <Typography variant="body2" key={c.siret}>
                    Société : {c.nom_soc}
                  </Typography>
                ))}
                <Typography variant="body2">
                  Email : {e.email}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Téléphone : {e.tel}
                </Typography>
                {!e.isConfirmed=== 0 ? (
                  <React.Fragment>
                    <Typography variant="body2" color="text.secondary">
                      Statut de confirmation : En attente
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Temps restant : {calculateTimeRemaining(moment(e.createdAt).add(30, 'days'))}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => handleEmailConfirmation(e.id_interlocuteur)}
                    >
                      Email de confirmation RGPD
                    </Button>
                  </React.Fragment>
                ) : e.isConfirmed === 1 ? (
                  <Typography variant="body2" color="text.secondary">
                    Statut de confirmation : Confirmé
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Statut de confirmation : Plus tard
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button href={`/Inter/modifier/${e.id_interlocuteur}`} size="small">
                  Modifier
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </div>
      {message === 'success' && (
                    <div className="alert alert-success" role="alert">
                      Email de confirmation RGPD envoyé  !
                    </div>
                  )}
    </div>
  );
}

export default InterlocuteurDetails;
