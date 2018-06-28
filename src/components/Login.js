import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios"
import Constants from "../Constants";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            email: '',
            password: ''
        };
        this.Login = this.Login.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    };

    Login() {
        axios.post(Constants.Backendpoint + "authenticate", {
            username: this.state.email,
            password: this.state.password
        })
            .then((response) => {
                Constants.AuthorizationToken = "Bearer " + response.data.id_token;
                this.setState({isAuthenticated: true});
                this.props.Callback(true);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    render() {
        if (this.state.isAuthenticated) {

            return <Redirect to="/myTodos"/>//<TodoList isAuthenticated={true}/>
        }
        else {
            return (
                <div id="login" className="container form-signin">
                    <input type="text" className="form-control" placeholder="Email Address" value={this.state.email}
                           onChange={this.handleChangeEmail}/>
                    <input type="password" className="form-control" name="password" placeholder="Password"
                           onChange={this.handleChangePassword}/>
                    <button onClick={this.Login} className="btn btn-lg btn-primary btn-block">Login</button>
                </div>
            );
        }
    }
}

export default Login;

