
import React, { useState, useRef, useEffect } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthSociete from "../services/societe";
import "react-datepicker/dist/react-datepicker.css";
import checkForm from '../common/Ajouter/checkedForm'
import { useHistory } from 'react-router-dom';
import './../assets/css/picklist.css'
import Multiselect from 'multiselect-react-dropdown';
import axios from 'axios';
import liste from "../assets/JsonData/liste_syndicat.json"
import origine_prospect from "../assets/JsonData/origine_prospect.json"
import Button from '@mui/material/Button';
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import Soc from '../controllers/Societe';
import RoleUser from "../controllers/Role";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
require('dotenv').config();
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
const AddTutorial = () => {
  let history = useHistory();
  //GET societer
  const [societeListe, SetsocieteListe] = useState([])
  //variable checked from
  const required = checkForm.required;
  const vsiret = checkForm.vsiret;
  const vsiren = checkForm.vsiren;

  const vsyndicat = checkForm.vobservation;
  const vtel = checkForm.vtel;
  const vpays = checkForm.vpays;
  const user = AuthService.getCurrentUser();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;


  // intitial societe
  const initialSocieteState = {
    siret: "",
    siren: "",
    nom_soc: "",
    date_creation_soc: "",
    activite_soc: "",
    libelle_naf: "",
    adresse_local: "",
    pays: "",
    ville_soc: "",
    code_postal: "",
    syndicat: "",
    observation: "",
    tel: "",
    app_sofitech: "",
    app_cemeca: "",
    soc_sofitech: "",
    soc_cemeca: "",
    id_role: "",
    id_utili: "",
    origineprospect: "",


  };



  const [Societe, setSociete] = useState({ initialSocieteState });
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [messagesiret, setMessagesiret] = useState("");
  const [myJSON, setactive] = useState([]);
  const [myJSON2, setactive2] = useState([]);
  const [role, setrole] = useState("")
  const [rolesofitech, setrolesofitech] = useState("")
  const form = useRef();
  const checkBtn = useRef();
  const mysofitech = RoleUser.SofitechRole();
  //GET role cemece
  const mycemeca = RoleUser.CemecaRole();

  useEffect(() => {
    //afficher cemca
    if (mycemeca) Soc.CemecaListe().then(data => SetsocieteListe(data))
    //afficher sofitech
    if (mysofitech) Soc.AllSociete().then(data => SetsocieteListe(data))
  }, [mycemeca, mysofitech])
  const land = (e) => {
    setactive(Array.isArray(e) ? e.map(x => x.NOM) : [])
  }
  const land2 = (e) => {
    setactive2(Array.isArray(e) ? e.map(x => x.NOM) : [])
  }

  const Retriverole = () => {
    //sofitech Role
    UserService.getSofitechBoard().then(() => {
      setrole(2)
    })
      .catch(() => {
        setrole(1)
      });

  }


  const saveSociete = (e) => {
    const syndicat = myJSON.join();
    const Origine_du_prospect = myJSON2.join();
    var data = {

      siret: Societe.siret,
      siren: Societe.siren,
      nom_soc: Societe.nom_soc,
      nom_responsable_soc: Societe.nom_responsable_soc,
      date_creation_soc: Societe.date_creation_soc,
      activite_soc: Societe.activite_soc,
      libelle_naf: Societe.libelle_naf,
      adresse_local: Societe.adresse_local,
      pays: Societe.pays,
      ville_soc: Societe.ville_soc,
      code_postal: Societe.code_postal,
      origineprospect: Origine_du_prospect,
      syndicat: syndicat,
      observation: Societe.observation,
      tel: Societe.tel,
      id_role: role,
      app_sofitech: rolesofitech,
      Origine_du_prospect: Origine_du_prospect,
      message: message.message,
      successful: successful.successful,
      id_utili: user.id
    };

    e.preventDefault();
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0 && messagesiret === "Siret PAPPERS validé.") {
      AuthSociete.create(data)
        .then(response => {
          setSociete({
            siren: response.data.siren,
            siret: response.data.siret,
            nom_soc: response.data.nom_soc,
            nom_responsable_soc: response.data.nom_responsable_soc,
            activite_soc: response.data.activite_soc,
            libelle_naf: response.data.libelle_naf,
            adresse_local: response.data.adresse_local,
            app_sofitech: response.data.app_sofitech,
            pays: response.data.pays,
            ville_soc: response.data.ville_soc,
            code_postal: response.data.code_postal,
            syndicat: response.data.syndicat,
            origineprospect: response.data.origineprospect,
            observation: response.data.observation,
            tel: response.data.tel,
            date: response.data.date,
            id_role: response.data.id_role,
            Origine_du_prospect: response.data.Origine_du_prospect,
            id_utili: response.data.id_utili
          }
          );
          setSuccessful(true);
          setMessage(response.data.message)
          setTimeout(() => {
            history.push("/Societes");
          }, 1000)

        },
          error => {
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
              error.message ||
              error.toString();
            setMessage("Société déjà ajouté");
          }
        )
        .catch(e => {
          console.log(e);

        });
    }
  };


  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...societeListe]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, societeListe]);
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);



  //API INSEE

  const API_INSEE_SIRET = 'https://api.pappers.fr/v2/entreprise/?siret='
  var b = String(Societe.siret)
  const chaine = API_INSEE_SIRET + b
  const getAPINSEE = () => {

    return axios.get(chaine, {
      headers: { "Authorization": ` Bearer ${process.env.API_TOKEN}` }

    });
  }


  const [SIRETAPI, setSIRETAPI] = useState([]);
  const [Etablissement, SetETA] = useState([]);
  console.log(Etablissement)
  const [value, setValue] = useState("");
  const GetAPI = () => {
    getAPINSEE().then(response => {
      setSIRETAPI(response.data);
      SetETA(response.data.etablissement);
      setMessagesiret("Siret PAPPERS validé.");
      setMessage('')
    },
      error => {

        setMessagesiret("Siret non reconnu PAPPERS.");
      }
    )
  }
  const handleInputChange = event => {
    const { name, value } = event.target;
    setSociete({ ...Societe, [name]: value });

  };
  const result = Object.entries(SIRETAPI)
  const result2 = Object.entries(Etablissement)
  const Siren = result.filter(([key]) => key === 'siren');
  const Nom = result.filter(([key]) => key === "nom_entreprise");
  const Code_naf = result.filter(([key]) => key === "code_naf");
  const libelle_naf = result.filter(([key]) => key === "libelle_code_naf");
  const adresse = result2.filter(([key]) => key === "adresse_ligne_1");
  const paye = result2.filter(([key]) => key === "pays");
  const ville = result2.filter(([key]) => key === "ville");
  const code_postal = result2.filter(([key]) => key === "code_postal");


  const SIREN = () => {

    return (
      <div className="col-6">
        {Siren.map((e, valeur) =>
          <Input
            key={valeur}
            type="text"
            className="form-control"
            id="title"
            value={Societe.siren = e[1]}
            onChange={handleInputChange}
            validations={[required, vsiren]}
            name="siren"
          />
        )}
      </div>
    )

  }

  const NOM = () => {

    return (<div>
      {Nom.map((e, valeur) =>
        <Input
          key={valeur}
          type="text"
          className="form-control"
          id="title"
          value={Societe.nom_soc = e[1]}
          onChange={handleInputChange}
          name="nom_soc"
        />
      )}
    </div>)

  }
  const CODENAF = () => {

    return (<div>
      {Code_naf.map((e, valeur) =>
        <Input
          key={valeur}
          type="text"
          className="form-control"
          id="title"
          value={Societe.activite_soc = e[1]}
          onChange={handleInputChange}
          validations={[required, vsyndicat]}
          name="activite_soc"
        />
      )}
    </div>)

  }
  const LibelleCodeNaf = () => {

    return (<div>
      {libelle_naf.map((e, valeur) =>
        <Input
          key={valeur}
          type="text"
          className="form-control"
          id="title"
          value={Societe.libelle_naf = e[1]}
          onChange={handleInputChange}
          validations={[required, vsyndicat]}
          name="activite_soc"
        />
      )}
    </div>)

  }
  const ADRESSE = () => {

    return (<div>
      {adresse.map((e, valeur) =>
        <Input
          key={valeur}
          type="text"
          className="form-control"
          id="title"
          value={Societe.adresse_local = e[1]}
          onChange={handleInputChange}
          validations={[required]}
          name="adresse_local"
        />
      )}
    </div>)

  }
  const PAYE = () => {

    return (<div>
      {paye.map((e, valeur) =>
        <Input
          key={valeur}
          type="text"
          className="form-control"
          id="title"
          value={Societe.pays = e[1]}
          onChange={handleInputChange}
          validations={[required, vpays]}
          name="pays"
        />
      )}
    </div>)

  }
  const VILLE = () => {

    return (<div>
      {ville.map((e, valeur) =>
        <Input
          key={valeur}
          type="text"
          className="form-control"
          id="title"
          value={Societe.ville_soc = e[1]}
          onChange={handleInputChange}
          validations={[required]}
          name="ville_soc"
        />
      )}
    </div>)

  }
  const CODE = () => {

    return (
      <div>

        {code_postal.map((e, valeur) =>
          <Input
            key={valeur}
            type="text"
            className="form-control"
            id="title"
            value={Societe.code_postal = e[1]}
            onChange={handleInputChange}
            validations={[required]}
            name="code_postal"
          />
        )}
      </div>)

  }


  useEffect(() => {
    Retriverole()

    if (role === 2) {
      setrolesofitech(1)
    }

  }, [role])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('tges')
    }
  };



  return (
    <div className="submit-form">
      <div className="container">
      <div className="row">
        <div className="col-6">
          <Autocomplete
            noOptionsText={'societé non trouvée dans le CRM'}
            id="asynchronous-demo"
            sx={{ width: 300 }}
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.nom_soc === value.nom_soc}
            getOptionLabel={(option) => option.nom_soc}
            options={options}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Recheche societé CRM"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </div>
        <div className="col-6">
          <Form ref={form}>
            <div>
              <div className="form-group">
                <div className="container">
                <div className="row">
                  <div className="col-5">
                  <TextField
                    label="Recherche PAPPERS"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyPress={handleKeyDown}
                  />
                  </div>
                  <div className="col">
                  <Button type="submit" variant="contained" onClick={() => window.open(`https://www.pappers.fr/recherche?q=${value}`, "_blank")}>
                    recherche
                  </Button>
                  </div>  
                </div>
                </div>
              </div>
            </div>

            <CheckButton style={{ display: "none" }} ref={checkBtn} />

          </Form>
        </div>
      </div>
      </div>
      <div className="card card-container">

        <h3><i class='bx bxs-bank danger'></i> Ajouter une Société</h3>
        <Form onSubmit={saveSociete} ref={form}>
          {!successful && (
            <div>

              <div className="form-group">
                <div className="row">
                <label htmlFor="title">siret</label>
                  <div className="col-6">
                    
                    <Input
                      type="text"
                      className="form-control"
                      id="title"
                      onChange={handleInputChange}
                      value={Societe.siret}
                      validations={[required, vsiret]}
                      name="siret"
                    />
                  </div>
                  <div className="col-6">
                    <Button onClick={GetAPI} variant="contained">valider</Button>
                  </div>
                  {messagesiret && (
                    <div className="form-group">
                      <div
                        className={
                          messagesiret === "Siret PAPPERS validé."
                            ? "alert alert-success"
                            : "alert alert-warning"
                        }
                        role="alert"
                      >
                        {messagesiret}
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}


          {result.length > 0 && (

            <div>

              <div>

                <div className="form-group">
                  <label htmlFor="title">Siren</label>

                  <SIREN />
                </div>
                <div className="form-group">
                  <label htmlFor="title">Nom de la societe</label>
                  <NOM />
                </div>

                <div className="form-group">
                  <label htmlFor="title">Code naf</label>
                  <CODENAF />
                </div>
                <div className="form-group">
                  <label htmlFor="title">Libellé</label>
                  <LibelleCodeNaf />
                </div>
                <div className="form-group">
                  <label htmlFor="title">Adresse local</label>
                  <ADRESSE />
                </div>
                <div className="form-group">
                  <label htmlFor="title">Pays</label>
                  <PAYE />
                </div>
                <div className="form-group">
                  <label htmlFor="title">Ville</label>
                  <VILLE />
                </div>
                <div className="form-group">
                  <label htmlFor="text">Code postale</label>
                  <CODE />
                </div>


              </div>



            </div>
          )}
          <div className="form-group">

            <label htmlFor="title">Origine du prospect </label>
            <Multiselect
              displayValue="NOM"
              groupBy="TYPE"
              value="4"
              isObject={true}
              selectedValues={console.log}
              onChange={console.log}
              id={console.log}
              onNOMPressFn={function noRefCheck() { }}
              onRemove={function noRefCheck() { }}
              onSearch={function noRefCheck() { }}
              onSelect={land2}
              options={origine_prospect}
              emptyRecordMsg='No options available'
              showCheckbox
            />


          </div>
          <div className="form-group">

            <label htmlFor="title">Syndicat</label>
            <Multiselect
              displayValue="NOM"
              groupBy="TYPE"
              value="4"
              isObject={true}
              selectedValues={console.log}
              onChange={console.log}
              id={console.log}
              onNOMPressFn={function noRefCheck() { }}
              onRemove={function noRefCheck() { }}
              onSearch={function noRefCheck() { }}
              onSelect={land}
              options={liste}
              showCheckbox
            />

          </div>

          <div className="form-group">
            <label htmlFor="title">Observation</label>
            <Input
              type="text"
              className="form-control"
              id="title"
              defaultValue="Thierry"
              value={Societe.observation}
              onChange={handleInputChange}
              name="observation"
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Telephone</label>
            <Input
              type="text"
              className="form-control"
              id="title"
              value={Societe.tel}
              onChange={handleInputChange}
              validations={[required, vtel]}
              name="tel"
            />
          </div>





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
          <button className="btn btn-success">
            AJOUTER
          </button>
        </Form>
      </div>
    </div>
  );
};

export default AddTutorial;



