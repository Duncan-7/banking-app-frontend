import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-instance';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './NewTransactionForm.module.css';



class NewTransactionForm extends Component {
  state = {
    controls: {
      targetAccountNumber: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          placeholder: 'Recipient Account Number'
        },
        value: '',
        valid: false,
        touched: false,
        validation: {
          required: true,
          isNumeric: true
        }
      },
      amount: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          placeholder: 'Transfer Amount',
          step: '0.01',
        },
        value: '',
        valid: false,
        touched: false,
        validation: {
          required: true,
          isDecimal: true
        }
      },
    },
    error: null
  }

  checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isDecimal) {
      const pattern = /^-?\d+(,\d+)*(\.\d+(e\d+)?)?$/;
      isValid = pattern.test(value) && isValid
    }

    return isValid;
  }

  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true,
      }
    };
    this.setState({ controls: updatedControls });
  }

  submitHandler = (event) => {
    event.preventDefault();
    const transactionData = {
      sourceAccountId: this.props.sourceAccountId,
      targetAccountNumber: this.state.controls.targetAccountNumber.value,
      amount: this.state.controls.amount.value
    }
    axios.post('/transactions', transactionData)
      .then(response => {
        this.props.toggleForm();
        this.props.updateData();
        alert('Transfer made')
      })
      .catch(error => {
        let err = error.response ? error.response.data.error : "Problem contacting server. Please try again.";
        this.setState({ error: err });
      })
  }

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = formElementsArray.map(formElement => {
      return <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
    });

    if (this.props.loading) {
      form = <Spinner />
    }

    let errorMessage = null;
    if (this.state.error) {
      errorMessage = (
        <p className="error">{this.state.error}</p>
      );
    }


    return (
      < div className={classes.Form} >
        {errorMessage}
        < form onSubmit={this.submitHandler} >
          {form}
          < Button btnType="Success">Submit</Button >
        </form >
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    userCreated: state.auth.userCreated,
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    isAdmin: state.auth.admin,
    adminId: state.auth.userId
  }
}

export default connect(mapStateToProps)(NewTransactionForm);