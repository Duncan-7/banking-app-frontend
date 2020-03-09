import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-instance';
import { Link } from 'react-router-dom';
import * as actions from '../../store/actions/index';

import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Account from '../../components/Account/Account';
import NewAccountForm from '../NewAccountForm/NewAccountForm';

class Client extends Component {
  state = {
    userData: null,
    accounts: null,
    showNewAccountForm: false,
    error: null
  }

  componentDidMount() {
    this.getClientData();
    this.props.reinitialiseAuth();
  }

  getClientData = () => {
    axios.get('/users/' + this.props.match.params.id)
      .then(response => {
        this.setState({
          userData: response.data.user,
          accounts: response.data.accounts
        })
      })
      .catch(error => {
        let err = error.response ? error.response.data.error : "Problem contacting server. Please try again.";
        this.setState({ error: err });
      })
  }

  toggleShowNewAccountForm = () => {
    this.setState(prevState => {
      return { showNewAccountForm: !prevState.showNewAccountForm };
    });
  }

  render() {
    let userDetails = <Spinner />;
    let accounts = null;
    let editDetailsPath = this.props.isAdmin
      ? "/manage-clients/" + this.props.match.params.id + '/edit'
      : "/clients/" + this.props.match.params.id + '/edit';

    if (this.state.error) {
      userDetails = <p className="error">{this.state.error}</p>;
    }

    if (this.state.userData) {
      userDetails = <div>
        <h3>User Information</h3>
        <p>Full Name: {this.state.userData.fullName}</p>
        <p>Email Address: {this.state.userData.email}</p>
        <Link to={{
          pathname: editDetailsPath,
          userData: this.state.userData
        }}>
          <Button btnType="Success">Edit</Button>
        </Link>
      </div>
    }
    if (this.state.accounts) {
      accounts = this.state.accounts.map(account => {
        return <Account
          key={account._id}
          id={account._id}
          accountNumber={account.accountNumber}
          currentBalance={account.currentBalance} />
      });
    }

    const newAccountForm = <Modal
      show={this.state.showNewAccountForm}
      modalClosed={this.toggleShowNewAccountForm}>
      <NewAccountForm
        clientId={this.props.match.params.id}
        toggleForm={this.toggleShowNewAccountForm}
        updateData={this.getClientData} />
    </Modal>
    let newAccount = this.state.showNewAccountForm ? newAccountForm : null;

    let newAccountButton = this.props.isAdmin ? <Button btnType="Success" clicked={this.toggleShowNewAccountForm}>Create New Account</Button> : null;
    return <div>
      {userDetails}
      <h3>Accounts</h3>
      {accounts}
      {newAccountButton}
      {newAccount}
    </div>
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    isAdmin: state.auth.admin
  }
}

const mapDispatchToProps = dispatch => {
  return {
    reinitialiseAuth: () => dispatch(actions.authInit())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Client);