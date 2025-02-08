import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../assets/images/sofitech.png";
import { useParams } from 'react-router-dom';

export const MailReturn = () => {
  const { id } = useParams(); // Obtient l'ID à partir de l'URL
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // Utilise la variable d'environnement pour l'host de l'API

    fetch(`${process.env.REACT_APP_API_HOST}/client/${id}`) // Modifie le fetch pour utiliser l'URL complète
      .then(response => {
        if (response.ok) {
          setStatus('success');
        } else {
          throw new Error('Échec de la confirmation');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        setStatus('error');
      });
  }, [id]);

  return (
    <div className="container text-center mt-5">
    
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h1 className="text-success"><i className="bi bi-check-circle-fill"></i></h1>
                <h2 className="card-title">Confirmation réussie!</h2>
                <p className="card-text">Merci pour votre confiance.</p>
                <img src={logo} alt="Logo Société" className="img-fluid" style={{ maxWidth: '150px' }} />
              </div>
            </div>
          </div>
        </div>
      )
    </div>
  );
};
