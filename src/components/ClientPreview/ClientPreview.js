import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button/Button';
import classes from './ClientPreview.module.css';

const ClientPreview = props => {
  return (
    <div className={classes.Container}>
      <div className={classes.Client}>
        {props.fullName}
        <Link to={"/manage-clients/" + props.id}>
          <Button btnType="Neutral">Manage Accounts</Button>
        </Link>
      </div>
    </div>
  )
}

export default ClientPreview;