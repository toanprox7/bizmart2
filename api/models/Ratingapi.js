/**
 * Rating.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    content:{
      type:"string",
      required:true
    },
    star_item:{
      type:"string",
      required:true
    },
    productsId:{
      model:"productsapi"
    },
    usersId:{
     model:"usersapi"
    }
  }
};

