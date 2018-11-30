import React, { Component } from 'react';
import "./styles/login.css";
import {Link} from 'react-router-dom';
import axios from "axios";
import jwt from "jsonwebtoken";
class Login extends Component {
constructor(props) {
  super(props);
  this.state={
    email:"",
    phone_number:""
  }
}

componentWillMount() {
  if(localStorage.getItem("tokenUser")){
    this.handleRedirect();
    // this.props.history.push("/");
    // window.location.reload();
  }
  // window.location.reload();
}

 validateEmail =(email) => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
handleChangeData=(e) => {

  if(this.validateEmail(this.refs.phone_or_email.value)){
     this.setState({
      email:this.refs.phone_or_email.value,
      password:this.refs.password.value
    });
  }else{
    this.setState({
      phone_number:this.refs.phone_or_email.value,
      password:this.refs.password.value
    });
  }


}
handleSubmitLogin=async()=>{
  if(this.state.email!=""){
    var self = this;
    axios.post("/usersapi/login",{email:this.state.email,password:this.state.password,status:"active"})
    .then(function (response) {
      console.log(response);
    })
    .catch(function(err){
      console.log(err)
    })
    await this.handleGetToken();
  }else{
    var self = this;
    axios.post("/usersapi/login",{phone_number:this.state.phone_number,password:this.state.password,status:"active"})
    .then(function (response) {
      console.log(response);
    })
    .catch(function(err){
      console.log(err)
    })
    await this.handleGetToken();
  }

}
handleGetToken=() => {
  var self = this;
  axios.get("/usersapi/tokenUserLogin")
  .then(function (response) {
    localStorage.setItem("tokenUser",response.data);
  }).catch(function(err){
    throw err;
  })
  if(localStorage.getItem("tokenUser") != ""){
    this.handleRedirect();
  }

}
handleRedirect=() =>{
  window.location.reload();
   this.props.history.push("/");

}

    render() {
        return (
<div id="main">
  <div className="container">
    <div className="login">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div className="top-login">
            <div className="title-login">
              <h3>Đăng nhập tài khoản</h3>
            </div>
            <div className="had-username">
              <span>Các bạn chưa có tài khoản</span>
              <Link to="/register"> Đăng ký tại đây !</Link>
            </div>
          </div>
          <div className="block-login">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="left-login">
                  <div className="input-login">
                    <input ref="phone_or_email" name="phone_number" type="text" onChange={this.handleChangeData} placeholder="Email/Số Điện Thoại/Tên đăng nhập" />
                  </div>
                  <div className="input-login pass-padd">
                    <input ref="password" name="password" type="password" onChange={this.handleChangeData} placeholder="Mật khẩu" />
                  </div>
                  <div className="forget-or-help-login">
                    <div className="forget-login">
                      <a href="#">Quên mật khẩu</a>
                    </div>
                    <div className="help-login">
                      <a href="#">Cần trợ giúp?</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <div className="right-login">
            <div className="checkbox-login">
              <label>
                <input type="checkbox" checked />
                <span>Tôi đồng ý với điều khoản của Bizmart</span>
              </label>
            </div>
            <div className="button-login">
              <button onClick={this.handleSubmitLogin}>Đăng nhập</button>
            </div>
            <div className="or-login">
              <p>Hoặc đăng nhập</p>
            </div>
            <div className="button-login-fb">
              <div className="fb-circle">
                <i className="fa fa-facebook" />
              </div>
              <div className="txt-fb">
                <p>Đăng ký bằng Facebook</p>
              </div>
            </div>
            <div className="button-login-email">
              <div className="email-circle">
                <i className="fa fa-envelope-o" />
              </div>
              <div className="txt-email">
                <p>Đăng ký bằng Facebook</p>
              </div>
            </div>
          </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        );
    }
}

export default Login;
