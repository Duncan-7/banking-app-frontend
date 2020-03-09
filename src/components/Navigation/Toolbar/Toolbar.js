import React from 'react';
import classes from './Toolbar.module.css'
import NavigationLinks from '../NavigationLinks/NavigationLinks'
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle'

const Toolbar = (props) => (
  <header className={classes.Toolbar}>
    <DrawerToggle clicked={props.drawerToggleClicked} />
    <nav className={classes.DesktopOnly}>
      <NavigationLinks isAuth={props.isAuth} isAdmin={props.isAdmin} userId={props.userId} />
    </nav>
  </header>
)

export default Toolbar;