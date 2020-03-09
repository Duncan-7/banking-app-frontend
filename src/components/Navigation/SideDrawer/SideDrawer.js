import React from 'react';
import classes from './SideDrawer.module.css';
import NavigationLinks from '../NavigationLinks/NavigationLinks';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Aux/Aux';

const SideDrawer = (props) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }
  return (
    <Aux>
      <Backdrop show={props.open} clicked={props.closed} />
      <div className={attachedClasses.join(' ')}>
        <nav>
          <NavigationLinks isAuth={props.isAuth} isAdmin={props.isAdmin} userId={props.userId} closer={props.closed} />
        </nav>

      </div>
    </Aux>
  );
}

export default SideDrawer;