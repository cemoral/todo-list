import React, {Component} from "react";
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
            password: ''
        };
        this.register = this.register.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    };

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    register(e) {
        axios.post(Constants.Backendpoint + "authenticate", {
            username: 'admin',
            password: 'admin'
        })
            .then((response) => {
                AdminConstants.AuthorizationToken = "Bearer " + response.data.id_token;
                axios.post(Constants.Backendpoint + "users", {
                    login: this.state.password,
                    email: this.state.email,
                    firstName: this.state.email,
                    lastName: this.state.email,
                    imageUrl: "",
                    activated: true,
                    langKey: "en",
                    createdBy: "admin",
                    createdDate: "2018-06-27T21:51:15.268Z",
                    lastModifiedBy: "system",
                    lastModifiedDate: null,
                    authorities: [
                        "ROLE_USER",
                        "ROLE_ADMIN"
                    ]
                }, {headers: {"Authorization": AdminConstants.AuthorizationToken}})
                    .then((response) => {
                        console.log(response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });

        e.preventDefault();
    }

    render() {
        return (
            <div>
                <form className="container form-register" onSubmit={this.register}>
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


