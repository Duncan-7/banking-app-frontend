import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-instance';
import { Link } from 'react-router-dom';
import * as actions from '../../store/actions/index';

import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import ClientPreview from '../../components/ClientPreview/ClientPreview';

class ManageClients extends Component {
  state = {
    clients: null,
    error: null
  }

  componentDidMount() {
    this.props.reinitialiseAuth();

    axios.get('/users?userId=' + this.props.userId)
      .then(response => {
        this.setState({
          clients: response.data.users
        });
      })
      .catch(error => {
        let err = error.response ? error.response.data.error : "Problem contacting server. Please try again.";
        this.setState({ error: err });
      })
  }

  render() {
    let clientList = <Spinner />;
    if (this.state.error) {
      clientList = <p className="error">{this.state.error}</p>
    }
    if (this.state.clients) {
      clientList = this.state.clients.map(client => {
        return <ClientPreview
          key={client._id}
          id={client._id}
          fullName={client.fullName} />
      });
    }
    return <div>
      <Link to={'/manage-clients/create'}>
        <Button btnType="Success">Create Client</Button>
      </Link>
      {clientList}
    </div>
  }
}

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    reinitialiseAuth: () => dispatch(actions.authInit())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageClients);