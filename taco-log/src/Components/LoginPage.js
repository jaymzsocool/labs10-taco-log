import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { firebase, provider } from '../firebase/firebase';
import axios from 'axios'

class LoginPage extends Component {
    constructor() {
        super();
        this.state= {
            user:null,
            userInfo: {}
        }
        this.login = this.login.bind(this);
        //this.logout = this.logout.bind(this);
    }

    login() {
        firebase.auth().signInWithPopup(provider)
          .then((result)=> {
            const user = {
                name: result.user.displayName,
                email: result.user.email,
                ext_user_id: result.user.uid
            }                       
            axios
                .get('https://tacobe.herokuapp.com/api/users') 
                .then(res => {                    
                    let post = true
                    for(let i = 0; i < res.data.length; i++){
                        if(res.data[i].ext_user_id == user.ext_user_id){
                           axios.get(`https://tacobe.herokuapp.com/api/users/${res.data[i].internal_id}`)
                           .then(res =>{                                
                                this.setState({userInfo: res.data})
                           })
                           .catch(err => {
                                console.log(err);
                            });
                            post = false
                        }
                    }       
                    if(post){
                        axios    
                            .post('https://tacobe.herokuapp.com/api/users', user)
                            .then(res => {                    
                                this.setState({userInfo: res.data})
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }                    
                })
                .catch(err => {
                    console.log(err);
                });
            
            this.setState({
              user: true
            });
          });
      }

    render() {console.log(this.state.userInfo)
        return (
            <div className= 'login-page'>
                <p>This is the login page</p>
                <Button onClick= {this.login}>Login</Button>
            </div>
        )
    }
}

export default LoginPage; 