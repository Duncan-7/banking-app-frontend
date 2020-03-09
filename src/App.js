import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import * as actions from './store/actions/index';
import Layout from './hoc/Layout/Layout';
import Auth from './containers/Auth/Auth';
import ManageClients from './containers/ManageClients/ManageClients';
import ViewTransactions from './containers/ViewTransactions/ViewTransactions';
import Client from './containers/Client/Client';
import Logout from './containers/Auth/Logout/Logout';
import Home from './components/Home/Home';
import './App.css';


class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" render={(props) => <Auth {...props} isSignUp={false} />} />
        <Redirect to="/auth" />
      </Switch>
    )

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/logout" component={Logout} />
          <Route path="/clients/:id/edit" render={(props) => <Auth {...props} isSignUp={true} isEdit={true} />} />
          <Route path="/clients/:id" component={Client} />
          <Route path="/accounts/:id" component={ViewTransactions} />
          <Route path="/" exact component={Home} />
          <Redirect to="/" />
        </Switch>
      )
    }

    if (this.props.isAuthenticated && this.props.isAdmin) {
      routes = (
        <Switch>
          <Route path="/logout" component={Logout} />
          <Route path="/manage-clients/create" exact render={(props) => <Auth {...props} isSignUp={true} />} />
          <Route path="/manage-clients/:id/edit" render={(props) => <Auth {...props} isSignUp={true} isEdit={true} />} />
          <Route path="/manage-clients/:id" component={Client} />
          <Route path="/manage-clients" component={ManageClients} />
          <Route path="/accounts/:id" component={ViewTransactions} />
          <Route path="/" exact component={Home} />
          <Redirect to="/" />
        </Switch>
      )
    }

    return (
      <Layout>
        <div className="App">
          {routes}
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAdmin: state.auth.admin
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
