import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";
import Constants from "../Constants";

const AdminConstants = {
    AuthorizationToken: undefined
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            isRegistered: false,
        };
        this.register = this.register.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
    };

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }


    register(e) {
        axios.post(Constants.Backendpoint + "authenticate", {
            username: 'admin',
            password: 'admin'
        })
            .then((response) => {
                AdminConstants.AuthorizationToken = "Bearer " + response.data.id_token;
                axios.post(Constants.Backendpoint + "register", {
                    login: this.state.username,
                    username: this.state.username,
                    password: this.state.password,
                    email: this.state.email,
                    firstName: this.state.username,
                    lastName: this.state.username
                }, {headers: {"Authorization": AdminConstants.AuthorizationToken}})
                    .then((response) => {
                        console.log(response);
                        this.setState({isRegistered: true});
                        alert("User Created. Please Login");
                    })
                    .catch(function (error) {
                        console.log(error);
                        alert("Please create proper email adress and password lenght should be more than 4");
                    });
            })
            .catch(function (error) {
                console.log(error);
            });

        e.preventDefault();
    }

    render() {
        if(this.state.isRegistered)
            return <Redirect to="/login"/>
        else
        return (
            <div>
                <form className="container form-register" onSubmit={this.register}>
                    <input type="text" className="form-control" placeholder="Username" value={this.state.username}
                           onChange={this.handleChangeUsername}/>
                    <input type="text" className="form-control" placeholder="Email Address" value={this.state.email}
                           onChange={this.handleChangeEmail}/>
                    <input type="password" className="form-control" name="password" placeholder="Password"
                           onChange={this.handleChangePassword}/>
                    <button className="btn btn-lg btn-success btn-block" type="submit">Register</button>
                </form>
            </div>
        );
    }

}

export default Register;



