import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../assets/images/sofitech.png"// Assurez-vous d'importer les styles Bootstrap

export const MailReturn = () => {
  return (
    <div className="container text-center mt-5">
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              {/* Icône de confirmation (coche) */}
              <h1 className="text-success"><i className="bi bi-check-circle-fill"></i></h1>
              {/* Emoji pour une touche sympathique */}
              {/* Message de remerciement */}
              <h2 className="card-title">Confirmation réussie!</h2>
              <p className="card-text">Merci pour votre confiance.</p>
              {/* Logo de la société */}
              {/* Remplacez 'path_to_your_logo' par le chemin d'accès réel à votre logo */}
              <img src={logo} alt="Logo Société" className="img-fluid" style={{maxWidth: '150px'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
