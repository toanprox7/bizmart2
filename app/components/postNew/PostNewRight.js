import React, { Component } from 'react';
import "./styles/postNew.css"
import jwt from "jsonwebtoken";
import NumberFormat from 'react-number-format';
import DropzoneWithPreview from './DropzoneWithPreview';
import axios from "axios";
import {connect} from "react-redux";
// const uuidv1 = require('uuid/v1');
class PostNewRight extends Component {
constructor(props) {
  super(props);
  this.state={
    username:"",
    phone_number:"",
    email:"",
    title:"",
    contentDes:"",
    category:"",
    price:"",
    dataCategory:null,
    image:[]
  }
}

  componentWillMount(){
    if(!localStorage.getItem("tokenUser")){
      this.props.history.push("/login");
      window.location.reload();
    }
    var decoded = jwt.verify(localStorage.getItem("tokenUser"), 'toanpro');
    // console.log(decoded.dataUser);
    this.setState({
      username:decoded.username,
      phone_number:decoded.phone_number,
      email:decoded.email,
      id:decoded.id
    });


  }

componentWillReceiveProps(nextProps) {
  // console.log(nextProps,"helo");
  this.setState({
    image:nextProps.dataImage
  });
}

  handleChangeInput=(e)=>{
    e.preventDefault();
    this.setState({
      title: this.refs.title.value,
      contentDes:this.refs.contentDes.value,
      category:this.refs.category.value,
      price:this.refs.price.state.numAsString,

    });
    // console.log(this.refs.price.state.numAsString);
  }
  async componentDidMount() {
    const response = await axios.get('/categoryapi');
    const data = await response.data;
    this.setState({ dataCategory: data });
  }
  listCategory(){
    //khoong tra ve cai gi ak
    let {dataCategory} = this.state

    if((dataCategory != null) &&(dataCategory.length > 0)){
      return dataCategory.map((item,index) => {
        return <option key={index} value={item.id}>{item.name}</option>
    })
    }else{
      return null
    }

   }
   handleSubmitPost=() =>{
     let {title,price,contentDes,image,id,category} = this.state;
     if(title != "" && price != "" && contentDes != "" && image.length > 0 && id != "" && category != ""){
       let categoryInt = parseInt(category);
       var infoData = {
         title:title,
         price:price,
         content:contentDes,
         image:image,
         usersId:id,
         level:"1",
         status:"active",
         total_star:0,
         categoryId:categoryInt
       }
       let self = this;
       axios.get("/files/resizeImg").then(function (res) {
        console.log(res);
       }).catch(function (err) {
        console.log(err);
       })
       axios.post("/productsapi/create",infoData)
        .then(function (res) {
          console.log(res)
          self.props.history.push("/");
        }).catch(function (err) {
          throw err;
        });
     }else{
       alert("ban vui long nhap day du thong tin truoc khi post");
     }
   }
    render() {
      // console.log(this.state.dataCategory,"data root")
        return (
        <div className="post-new">
          <div className="block-post-new">
            <div className="title-post-new">
              <h3>Đăng tin rao</h3>
            </div>
            <div className="block-info-product-post">
              <div className="title-info-post">
                <label>Tiêu đề</label>
                <input onChange={this.handleChangeInput} type="text" name="title" ref="title"/>
              </div>
              <div className="content-des-info-post">
                <label>Nội dung mô tả</label>
                <textarea onChange={this.handleChangeInput} ref="contentDes" placeholder="Điền nội dung chi tiết bằng tiếng việt có dấu" />
              </div>
              <div className="img-products-info-post">
                <h3>Hình ảnh sản phẩm</h3>
                <span>Được phép đăng tối đa 6 ảnh, mỗi ảnh không quá 4mb</span>

                <div className="file-and-area">
                  {/* <input type="file" name="file" id="file" className="inputfile" />
                  <label htmlFor="file"><img src="/images/upload.png" /><span>Tải ảnh lên</span></label> */}
                   <DropzoneWithPreview />
                   <div className="select-custom">
                      <select onChange={this.handleChangeInput} defaultValue={this.state.category} ref="category">
                        <option value="">Chọn danh mục</option>
                        {this.listCategory()}
                      </select>

                    </div>
                </div>
              </div>
              <div className="price-info-post">
                <p>Giá</p>
                <NumberFormat
                onChange={this.handleChangeInput} ref="price" name="price" thousandSeparator={'.'} decimalSeparator={','} suffix={'đ'} />
                <p className="price-info-post red">0 nghìn đồng</p>
              </div>
              <div className="user-sell-phone-info-post">
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="user-sell-info-post">
                      <label>Tên người bán</label>
                      <input value={this.state.username} type="text" />
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="phone-info-post">
                      <label>Số điện thoại</label>
                      <input type="text" value={this.state.phone_number} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="email-info-post">
                <label>Email</label>
                <input value={this.state.email} type="email" placeholder="Nhập email để được tạo tài khoản miễn phí" />
              </div>
              <div className="button-post-new">
                <button onClick={this.handleSubmitPost}>Đăng tin</button>
              </div>
            </div>
          </div>
        </div>
        );
    }
}
const mapStateToProps = (state) => ({
  dataImage:state.productsReducer.dataImageLocal
})
export default connect(mapStateToProps)(PostNewRight)
