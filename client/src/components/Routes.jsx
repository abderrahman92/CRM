import React, { useEffect, useState } from "react";
import { Route, Switch,useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import axios from "axios";
import Customers from '../pages/Customers';
import Register from '../pages/Register';
import Login from '../pages/Login';
import ActionDetails from '../pages/ActionUser';
import Action from '../pages/Action';
import Ajouter from '../pages/Ajouter';
import DashboardAdmin from '../pages/DashboardAdmin';
import AuthService from "../services/auth.service";
import Interlocuteur from '../pages/Interlocuteur';
import InterlocuteurDetails from '../pages/InterlocuteurDetails';
import CustomerInfo from '../pages/CustomerInfo';
import UsersInfo from '../pages/User';
import CustomerModify from '../pages/societeMod';
import ActionMod from '../pages/ActionMod';
import InterlocuteurMod from '../pages/InterlocuteurMod';
import PageError from '../pages/Error-page';
import RoleUser from "../controllers/Role";
import Evolis from '../pages/Evolis';
import PasswordChangeCountdown from '../pages/PasswordChange';
import PasswordForget from '../pages/sendMail';
import Resetpassword from '../pages/resetPassword';
import { MailReturn } from "../pages/MailReturn";
import {MailReturnReject} from "../pages/MailReturnReject"


const CRMRoutes = () => {
  const user = AuthService.getCurrentUser();
  const mysofitech = RoleUser.SofitechRole();
  const location = useLocation();
  const [daysSinceLastChange, setDaysSinceLastChange] = useState(null);
  useEffect(() => {
    // Fetch the number of days since the last password change from the backend API
    const fetchDaysSinceLastChange = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST}/api/auth/days-since-password-change/${user.id}`
        );
        const data = response.data;
        setDaysSinceLastChange(data.days);
      } catch (error) {
        console.error("Error fetching days since password change:", error);
      }
    };

    fetchDaysSinceLastChange();
  }, []);
console.log(daysSinceLastChange);
const isConfirmationRoute = location.pathname.startsWith('/confirmation/') || location.pathname.startsWith('/reject/') ;
  return (
    <Switch>
       <>
          {isConfirmationRoute && <Route path='/confirmation/:id' exact component={MailReturn} />}
          {isConfirmationRoute && <Route path='/reject/:id' exact component={MailReturnReject} />}
          {!isConfirmationRoute && (
       <>
      {user && mysofitech ? (
        <>
          <Route path='/' exact component={Dashboard} />
          <Route path='/admin'  component={DashboardAdmin} />
          <Route path='/register' component={Register} />
          <Route path='/Action/:id' component={Action} />
          <Route path='/Evolis' component={Evolis} />
          <Route path='/AllAction' component={ActionDetails}  />
          <Route path='/Societes' component={Customers} />
          <Route path='/Societe/:id' component={CustomerInfo} />
          <Route path='/modifier/:id' component={CustomerModify} />
          <Route path='/Interlocuteur/:id' component={Interlocuteur} />
          <Route path='/ajouter' component={Ajouter} />
          <Route path='/user/:id' component={UsersInfo} />
          <Route path='/Login' component={Login} />
          <Route path='/Inter/modifier/:id' component={InterlocuteurMod} />
          <Route path='/Actions/modifier/:id' component={ActionMod} />
          <Route path='/Interl' component={InterlocuteurDetails} />

          {/* Route for change password page */}
          <Route
            path="/change-password"
            render={(props) => <PasswordChangeCountdown {...props} userId={user.id} />}
          />
        </>
      ) : (
        <div>
          <Route path='/confirmation/:id' exact component={MailReturn} />
          <Route path='/reject/:id' exact component={MailReturnReject} />
          <Route path='*' exact component={PageError} />
          <Route path='/Login' component={Login} />
          <Route path='/forget-password' component={PasswordForget} />
          <Route path='/reset-password/:id' component={Resetpassword} /> {/* Nouvelle route pour l'oubli de mot de passe */}
        </div>
      )}
      </>
      )}
      </>
    </Switch>
  );
};

export default CRMRoutes;
