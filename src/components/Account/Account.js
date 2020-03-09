import React from 'react';
import Button from '../UI/Button/Button';
import { Link } from 'react-router-dom';
import classes from './Account.module.css';

const Account = props => {
  const viewAccountButton = <Link to={"/accounts/" + props.id}>
    <Button btnType="Neutral">View Transactions</Button>
  </Link>
  return (
    <div className={classes.Container}>
      <div className={classes.Account}>
        <div>
          <p>Account Number: {props.accountNumber}</p>
          <p>Current Balance: £{props.currentBalance.toFixed(2)}</p>
        </div>
        {viewAccountButton}
      </div>
    </div>
  )
}

export default Account;