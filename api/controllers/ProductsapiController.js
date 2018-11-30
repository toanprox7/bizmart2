/**
 * ProductsController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create:function (req,res,next) {
    Productsapi.create(req.params.all(), function (err,data) {
      if(err) return res.serverError(err);
      return res.json({
        message:'successfully!',
        data: data
      })
    })
  },
  getAllProductsById: function (req,res,next) {
    Productsapi.find({
      where: req.params.all()
    }, function (err,data) {
      if(err) return res.serverError(err);
      return res.json(data)
    })
  },

};

