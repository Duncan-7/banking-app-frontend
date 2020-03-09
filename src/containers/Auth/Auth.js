import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email Address'
        },
        value: '',
        valid: false,
        touched: false,
        onlyOnSignup: false,
        validation: {
          required: true,
          isEmail: true
        }
      },
      fullName: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Full Name'
        },
        value: '',
        valid: false,
        touched: false,
        onlyOnSignup: true,
        validation: {
          required: true
        }
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        valid: false,
        touched: false,
        onlyOnSignup: false,
        validation: {
          required: true,
          minLength: 4
        }
      },
      confirmPassword: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Confirm Password'
        },
        value: '',
        valid: false,
        touched: false,
        onlyOnSignup: true,
        validation: {
          required: true,
          minLength: 4
        }
      }

    },
    error: false
  }

  componentDidMount() {
    if (this.props.location.userData) {
      const updatedControls = {
        ...this.state.controls,
        email: {
          ...this.state.controls.email,
          value: this.props.location.userData.email
        },
        fullName: {
          ...this.state.controls.fullName,
          value: this.props.location.userData.fullName
        }
      };
      this.setState({ controls: updatedControls });
    }
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
    const passwordsMatch = this.state.controls.password.value === this.state.controls.confirmPassword.value;
    if (this.props.isSignUp && !passwordsMatch) {
      this.setState({ error: "Passwords did not match, please try again" });
      return;
    };
    this.setState({ error: null });
    const data = {
      email: this.state.controls.email.value,
      fullName: this.state.controls.fullName.value,
      password: this.state.controls.password.value,
      adminId: this.props.adminId,
      userId: this.props.match.params.id
    }
    this.props.onAuth(data, this.props.isSignUp, this.props.isEdit);
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
      if (!formElement.config.onlyOnSignup || this.props.isSignUp) {
        return <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          changed={(event) => this.inputChangedHandler(event, formElement.id)} />
      } else {
        return null;
      }
    });

    if (this.props.loading) {
      form = <Spinner />
    }

    let errorMessage = null;

    if (this.props.error) {
      errorMessage = (
        <p className="error">{this.props.error}</p>
      );
    }

    if (this.state.error) {
      errorMessage = (
        <p>{this.state.error}</p>
      );
    }

    let authRedirect = null;
    if (this.props.isAuthenticated && !this.props.isAdmin && !this.props.isEdit) {
      authRedirect = <Redirect to="/" />
    }

    if (this.props.userCreated) {
      this.props.history.goBack();
    }


    return (
      < div className={classes.Auth} >
        {authRedirect}
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

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (data, isSignUp, isEdit) => dispatch(actions.auth(data, isSignUp, isEdit)),
    onInit: () => dispatch(actions.authInit())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);