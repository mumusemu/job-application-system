// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import OpenPositions from './components/OpenPositions';
import PositionDetail from './components/PositionDetail';
import ApplicationForm from './components/ApplicationForm';
import AddPosition from './components/AddPosition';
import NoMatch from './pages/NoMatch';
import SuccessPage from './pages/Success';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ApplicationDetails from './components/ApplicationDetails';
import AdminLayout from './components/AdminLayout'; 

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      sessionStorage.removeItem('token');
      return window.location.assign(
        `http://localhost:3000/adminlogin`
      );
    }
    return Promise.reject(error);
  }
);

function App() {
  const token = sessionStorage.getItem('token');

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={OpenPositions} />
          <Route path="/adminlogin" exact>
            {!token ? <AdminLogin /> : <Redirect to="/admindashboard" />}
          </Route>
          <Route path="/admindashboard">
            {token ? (
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            ) : (
              <Redirect to="/adminlogin" />
            )}
          </Route>
          <Route path="/positions/:id" component={PositionDetail} />
          <Route path="/positions" component={OpenPositions} />
          <Route path="/apply/:id" component={ApplicationForm} />
          <Route path="/success" component={SuccessPage} />
          <Route path="/addposition">
            {token ? (
              <AdminLayout>
                <AddPosition />
              </AdminLayout>
            ) : (
              <Redirect to="/adminlogin" />
            )}
          </Route>
          <Route path="/application-with-feedback/:id">
            {token ? (
              <AdminLayout>
                <ApplicationDetails />
              </AdminLayout>
            ) : (
              <Redirect to="/adminlogin" />
            )}
          </Route>
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */