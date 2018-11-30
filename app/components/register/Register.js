import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import validator from 'validator';
import "./styles/styles.css";
import "./styles/register.css";
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import NumberFormat from 'react-number-format';
import FacebookLoginButton from './FacebookLoginButton';
var jwt = require('jsonwebtoken');
class Register extends Component {
  constructor(props) {
    super(props);
    this.state={
      displayCheck:"none",
      labelCheck:"none",
      passCheck:"none",
      password:"",
      re_password:""
    }
  }

  componentWillMount() {
    if(localStorage.getItem("tokenUser")){
      this.handleRedirect();
      window.location.reload();
    }
    var self=this;
    axios.get('/usersapi').then(function(dataUser){
      // console.log(dataUser.data);
      let arrayPhone=[];
      dataUser.data.map(item => {
        arrayPhone.push(item.phone_number);
      })

      self.setState({
        phone:arrayPhone
      });

    }).catch(function (err) {
      throw err;
    })

  }
   handleChange= async(event) => {
    // console.log(event.target.name);
    // console.log(event.target.value);
    event.preventDefault();
    let name=  event.target.name;
    let value=  event.target.value;

    await this.setState({
      [name]:value
    });
    if(name =="phone_number"){
      var phoneStrim = value.trim();
      this.setState({
        phone_number:phoneStrim
      });
      if(this.state.phone){
        this.state.phone.map(item => {
          if(item == this.state.phone_number){
            this.setState({
              labelCheck:"block"
            });
          }else{
            this.setState({
              labelCheck:"none"
            });
          }
        })
      }
    }
    // await console.log(dataUser);
    if(name =="confirm_sms"){
      // console.log("da nhan confirm sms")
      if(this.state.codeConfirm){
        if(value == this.state.codeConfirm){
          this.setState({
            displayCheck:"block"
          });
        }else{
          this.setState({
            displayCheck:"none"
          });
        }
      }
    }
    await this.checkComparePass();

  }
  checkComparePass=()=>{
    if(this.state.password && this.state.re_password){
     if(this.state.password == this.state.re_password){
      //  console.log("khop pass");
       this.setState({
        passCheck:"block"
       });
     }else if(this.state.password != this.state.re_password){
      // console.log("khong pass");
      this.setState({
        passCheck:"none"
       });
     }
    }

  }
  handleSubmitRegister =()=>{
    var dataUser= {
      phone_number:this.state.phone_number,
      username:this.state.name,
      password:this.state.password,
      email:this.state.email,
      role:"2",
      status:"active"
    }
    if(dataUser.phone_number==null || dataUser.phone_number==undefined || this.state.labelCheck =="block" || this.state.passCheck =="none" || this.state.displayCheck == "none" ){
      alert("Thong tin ban nhap chua day du hoac chua dung vui long thu lai");
    }else{
      var self=this;
      alert("Ban da dang ky thanh cong");
      axios.post('/usersapi/create', dataUser)
      .then(function (response) {
        console.log(response);
        // self.handleRedirect();
      })
      .catch(function (error) {
        console.log(error);
      });
      this.handleRedirect();
    }

}

handleSendSms=async()=>{
var phone_number = this.state.phone_number;
var phoneStrim = phone_number.trim();
  if(phone_number==null ||phone_number==undefined){
    alert("truong nay khong duoc de trong")
  }else if(phoneStrim.length < 10){
    // console.log(phone_number,"this.state.phone_number.length < 10");
    alert("sdt phai lon hon 10 so")
  }else{
    alert("Tin nhan dang gui ma xac nhan den");
    axios.post('/SMS/send',{phone:phoneStrim})
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  await this.handleGetToken();
  }

}
handleGetToken=() =>{
  var self = this
  axios.get('/SMS/token')
    .then(function (response) {
      let decoded = jwt.verify(response.data, 'shhhhh');
      self.setState({codeConfirm:decoded.code_confirm});
    })
    .catch(function (error) {
      console.log(error);
    });
}
handleRedirect = () => {
  this.props.history.push('/');
}
    render() {
      const required = (value) => {
        if (!value.toString().trim().length) {
          // We can return string or jsx as the 'error' prop for the validated Component
          return 'require';
        }
      };

      const email = (value) => {
        if (!validator.isEmail(value)) {
          return `${value} is not a valid email.`
        }
      };

      const lt = (value, props) => {
        // get the maxLength from component's props
        if (!value.toString().trim().length > props.maxLength) {
          // Return jsx
          return <span className="error">The value exceeded {props.maxLength} symbols.</span>
        }
      };

      const password = (value, props, components) => {
        // NOTE: Tricky place. The 'value' argument is always current component's value.
        // So in case we're 'changing' let's say 'password' component - we'll compare it's value with 'confirm' value.
        // But if we're changing 'confirm' component - the condition will always be true
        // If we need to always compare own values - replace 'value' with components.password[0].value and make some magic with error rendering.
        if (value !== components['confirm'][0].value) { // components['password'][0].value !== components['confirm'][0].value
          // 'confirm' - name of input
          // components['confirm'] - array of same-name components because of checkboxes and radios
          return <span className="error">Passwords are not equal.</span>
        }
      };
        return (
<div id="main">
  <div className="container">
    <div className="register">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div className="top-register">
            <div className="title-register">
              <h3>Đăng ký tài khoản</h3>
            </div>
            <div className="had-username">
              <span>Các bạn đã có tài khoản</span>
              <Link to="login"> Đăng nhập tại đây !</Link>
            </div>
          </div>
          <Form>
          <div className="block-register">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <div className="left-register">
                  <div className="input-reg send-code">
                    <NumberFormat name="phone_number" onChange={event => this.handleChange(event)} placeholder="Số điện thoại" format="###########" />
                    {/* <input type="text" name="phone_number" onChange={event => this.handleChange(event)} placeholder="Số điện thoại" /> */}
                    <div class="button-SendSms" onClick={this.handleSendSms}>Gửi mã</div>
                    <span style={{display: `${this.state.labelCheck}`}} className="err-label">đã tồn tại số điện thoại này</span>
                  </div>
                  <div className="input-reg confirm">
                    <NumberFormat onChange={event => this.handleChange(event)} name="confirm_sms" format="#####" mask="_" placeholder="Xác nhận mã sms"/><i style={{display: `${this.state.displayCheck}`}} className="fa fa-check-circle"></i>
                    {/* <input type="text" name="confirm_sms" onChange={event => this.handleChange(event)} placeholder="Xác nhận mã sms" />  */}
                  </div>
                  <div className="input-reg">
                    <input type="text" name="name" onChange={event => this.handleChange(event)} placeholder="Họ và tên" />
                  </div>
                  <div className="input-reg">
                    <input type="password" name="password" value={this.state.password} onChange={event => this.handleChange(event)} placeholder="Mật khẩu" />
                  </div>
                  <div className="input-reg reg-pass">
                    <input type="password" name="re_password" value={this.state.re_password} onChange={event => this.handleChange(event)} placeholder="Nhập lại mật khẩu" /><i style={{display: `${this.state.passCheck}`}} className="fa fa-check-circle"></i>
                  </div>
                  <div className="input-reg">
                  <Input placeholder='Nhập email của bạn' name='email' onChange={event => this.handleChange(event)} validations={[required, email]}/>
                    {/* <input type="text" name="email" onChange={event => this.handleChange(event)} placeholder="Nhập email của bạn" /> */}
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <div className="right-reg">
            <div className="checkbox-reg">
              <label>
                <input type="checkbox" checked />
                <span>Tôi đồng ý với điều khoản của Bizmart</span>
              </label>
            </div>
            <div className="button-reg button-registe">
              <div className="button-click" onClick={this.handleSubmitRegister}>Đăng ký</div>
            </div>
            <div className="or-register">
              <p>Hoặc đăng ký</p>
            </div>
           <FacebookLoginButton />
            <div className="button-reg-email">
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
          </Form>
        </div>

      </div>
    </div>
  </div>
</div>

        );
    }
}

export default Register;
