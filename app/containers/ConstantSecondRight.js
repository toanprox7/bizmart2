import React, { Component } from 'react';
import { BrowserRouter, Route,Switch,Link,NavLink } from 'react-router-dom'
import ProductsRight from '../components/products/ProductsRight';
import PostNewRight from '../components/postNew/PostNewRight';
import HomeRight from '../components/home/HomeRight';
class ConstantSecondRight extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/products/*-:idCategory" component={ProductsRight} />
                <Route exact path="/post-new" component={PostNewRight} />
                <Route exact path="/" component={HomeRight} />
            </Switch>
        );
    }
}

export default ConstantSecondRight;
