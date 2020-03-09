import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../Aux/Aux'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import classes from './Layout.module.css';

class Layout extends Component {
  state = {
    showSideDraw: false
  }

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDraw: false });
  }

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return { showSideDraw: !prevState.showSideDraw };
    });
  }

  render() {
    return (
      <Aux>
        <Toolbar
          isAuth={this.props.isAuthenticated}
          isAdmin={this.props.isAdmin}
          userId={this.props.userId}
          drawOpen={this.state.showSideDraw}
          drawerToggleClicked={this.sideDrawerToggleHandler} />

        <SideDrawer
          isAuth={this.props.isAuthenticated}
          isAdmin={this.props.isAdmin}
          userId={this.props.userId}
          open={this.state.showSideDraw}
          closed={this.sideDrawerClosedHandler} />

        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAdmin: state.auth.admin,
    userId: state.auth.userId
  }
}

export default connect(mapStateToProps)(Layout);
