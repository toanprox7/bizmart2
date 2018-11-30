import React, { Component } from 'react';
import ListProductsRight from './ListProductsRight';
import "./styles/products.css";
class ProductsRight extends Component {
    render() {
        return (

        <div className="main-products-right">
          <div className="top-products-right">
            <h4>Sản Phẩm</h4>
          </div>
         <ListProductsRight id={this.props.match.params.idCategory}/>
        </div>
        );
    }
}

export default ProductsRight;
