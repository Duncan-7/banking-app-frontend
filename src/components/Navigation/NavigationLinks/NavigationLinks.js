import React from 'react';
import NavigationLink from './NavigationLink/NavigationLink';
import classes from './NavigationLinks.module.css';

const NavigationLinks = (props) => {
  let authLinks = <ul className={classes.NavLinks}>
    <NavigationLink link="/" exact>Home</NavigationLink>
  </ul>
  if (props.isAuth) {
    authLinks = <ul className={classes.NavLinks} onClick={props.closer}>
      <NavigationLink link="/" exact>Home</NavigationLink>
      <NavigationLink link={"/clients/" + props.userId}>View Accounts</NavigationLink>
      <NavigationLink link="/logout">Logout</NavigationLink>
    </ul>
  }

  if (props.isAdmin) {
    authLinks = <ul className={classes.NavLinks} onClick={props.closer}>
      <NavigationLink link="/" exact>Home</NavigationLink>
      <NavigationLink link="/manage-clients">Manage Clients</NavigationLink>
      <NavigationLink link="/logout">Logout</NavigationLink>
    </ul>
  }
  return (
    <div className={classes.NavBar}>
      {authLinks}
    </div>
  )
}

export default NavigationLinks;