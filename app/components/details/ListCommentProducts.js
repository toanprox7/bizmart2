import React, { Component } from 'react';
import jwt from "jsonwebtoken";
import StarRatingComponent from 'react-star-rating-component';
import axios from "axios";
import PaginationRating from "./PaginationRating";
import ItemCommentProduct from "./ItemCommentProduct";
import {connect} from "react-redux";
import * as ratingAction from "../../actions/ratingsAction";
import * as userActions from "../../actions/usersAction";

class ListCommentProducts extends Component {
  constructor(props) {
    super(props);
    this.state={
      rating: 0,
      contentRating:"",
      idProduct:parseInt(this.props.idProduct)
    }
  }
  componentDidMount() {

    if(localStorage.getItem("tokenUser")){
      let token = localStorage.getItem("tokenUser");
      var decoded = jwt.verify(token, 'toanpro');
      this.props.fetchUserById(decoded.dataUser.id);
    }
    var self = this;
    axios.get(`/ratingapi/getAllRatingsById?productsId=${this.props.idProduct}&skip=0&limit=10&sort=createdAt+desc`)
      .then(function (res) {
        self.setState({
          dataPaginate:res.data
        });
      }).catch(function (err) {
        console.log(err);
      })
  }


  componentWillReceiveProps(nextProps) {
    // console.log(nextProps,"nextProps");
    if(nextProps.user){
      this.setState({
        idUser:nextProps.user.id,
        image:nextProps.user.image
      });
    }else{
      this.setState({
        image:"/images/rating/guess.jpg",
        idUser:0
      });
    }
  }

  onHandleClick(nextValue, prevValue, name) {
    var self= this;
    self.setState({
      rating:nextValue
    });
  }

  handleChangeDataText(event){
    event.preventDefault();
    let value = event.target.value;
    this.setState({
      contentRating:value
    });
  }
  handleButtonSend(){
   if(this.state.rating != 0){
    var infoRating={
      content:this.state.contentRating,
      star_item:this.state.rating,
      productsId:this.state.idProduct,
      usersId:this.state.idUser
    }
    this.props.createRating(infoRating);
    window.location.reload();
   }else if(this.state.rating == 0){
     alert("Bạn vui lòng đánh giá sao trước khi đánh giá")
   }
  }
  checkMapData(){

    let {dataPaginate} = this.state;
    // console.log(dataPaginate);
    if(dataPaginate){
      if(dataPaginate.length >0){
        return dataPaginate.map((item,index) => {
          return <ItemCommentProduct key={index} dataRatingsItem={item} />
        })
      }

    }else{
      return null
    }
  }
  checkUser(){
    let {user} = this.props;
    if(user.length >0){
      return user;
    }else{
      return null
    }
  }
  handleDataPaginate(dataPaginate){
    this.setState({
      dataPaginate
    });
  }
    render() {
        const { rating } = this.state;
        return (
        <div className="list-rating-products">
            <div className="input-item-rating">
              <div className="img-rating">
                <img src={this.state.image} alt="img_product" />
              </div>
              <div className="input-comment">
                <textarea onChange={(event) => this.handleChangeDataText(event)} ref="inputRating" style={{paddingLeft:10}} name="inputRating" placeholder="Đánh giá sản phẩm..."  />
                <StarRatingComponent
                  name="rate5"
                  starCount={5}
                  value={rating}
                  onStarHover ={this.handleOnHoverStar}
                  onStarClick={(nextValue, prevValue, name) => this.onHandleClick(nextValue, prevValue, name)}
                />
                <button onClick={() => this.handleButtonSend()}>Gửi</button>
              </div>
            </div>
          {this.checkMapData()}
          <PaginationRating idProduct={this.props.idProduct} handleDataPaginate={(dataPaginate)=>{this.handleDataPaginate(dataPaginate)}} />
          </div>

        );
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // This dispatch will trigger
    // the Ajax request we setup
    // in our actions
    createRating: rating => dispatch(ratingAction.createRating(rating)),
    fetchUserById: userId => dispatch(userActions.fetchUserById(userId)),
    fetchAllRatingsByProductId: productId => dispatch(ratingAction.fetchAllRatingsByProductId(productId))

  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    ratings: state.ratingsReducer,
    user: state.userReducer,
    ratingsProduct:state.ratingsProductReducer
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ListCommentProducts)
