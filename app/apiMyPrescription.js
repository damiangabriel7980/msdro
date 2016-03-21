/**
 * Created by user on 05.10.2015.
 */
var products = require('./models/products.js');
var myPrescription = require('./models/myPrescription.js');
var ModelInfos = require('./modules/modelInfos');
var mongoose = require('mongoose');
var Config = require('../config/environment.js')();

module.exports = function (app, logger, router) {

  //=============================================Define variables
  var handleSuccess = require('./modules/responseHandler/success.js')(logger);
  var handleError = require('./modules/responseHandler/error.js')(logger);

  app.all('/apiAplicationUpgrade', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Last-Modified");
    next();
  });

  var getMyPrescriptionInfo = function (res, date) {
    myPrescription.find({}).select('generalDescription privacyPolicyUrl termsOfUseUrl telefon').exec(function (err, info) {
      if (err) {
        handleError(res, err, 500);
      } else {
        res.setHeader('last-modified', date);
        res.status(200).send(info);
      }
    })
  };

  var PathToAmazon = Config.amazonPrefix + Config.amazonBucket + "/";

  router.route('/config')
    .get(function (req, res) {
      if (!req.headers['last-modified']) {
        ModelInfos.getLastUpdate('myPrescription').then(function(resp){
          getMyPrescriptionInfo(res, new Date(resp).getTime());
        });
      } else {
        ModelInfos.getLastUpdate('myPrescription').then(function (resp) {
          if (new Date(resp).getTime() > req.headers['last-modified']) {
            getMyPrescriptionInfo(res, new Date(resp).getTime());
          } else {
            handleSuccess(res, true, 16, 304)
          }
        })
      }

    });

  router.route('/drug')
    .get(function (req, res) {
      if (req.query.drugCode) {
        products.aggregate([
            { $match: { codeQR: req.query.drugCode, enable: true } },
            {
              $project: {
                _id: "$_id",
                name: "$name",
                rpc: "$file_path",
                code: "$codeQR",
                drugDescription: "$description",
                mainImageUrl: "$mainImageUrl",
                imageUrls: "$imageUrls",
                videoUrls: "$videoUrls",
                last_updated: "$last_updated"
              }
            }])
          .exec(function (err, drug) {
            if (err) {
              return handleError(res, err, 500)
            } else {
              if (drug.length == 0) {
                res.status(404).send();
              } else {
                res.setHeader('last-modified', drug[0].last_updated.getTime());
                drug[0].rpc = Config.amazonPrefix + Config.amazonBucket + "/" + drug[0].rpc;
                drug[0].mainImageUrl = PathToAmazon + drug[0].mainImageUrl;
                res.status(200).send(drug);
              }

            }
          })
      }
    });

  router.route('/drug/id')
    .get(function (req, res) {
      if (req.query.id) {
        products.aggregate([
          { $match: { _id: mongoose.Types.ObjectId(req.query.id), enable: true } },
          {
            $project: {
              _id: "$_id",
              name: "$name",
              rpc: "$file_path",
              code: "$codeQR",
              drugDescription: "$description",
              mainImageUrl: "$mainImageUrl",
              imageUrls: "$imageUrls",
              videoUrls: "$videoUrls",
              last_updated: "$last_updated"
            }
          }
        ]).exec(function (err, drug) {
          if (err) {
            return handleError(res, err, 500);
          } else if (drug.length == 0) {
            res.status(404).send();
          } else {
            if (drug[0].last_updated.getTime() > req.headers['last-modified']) {
              drug[0].rpc = Config.amazonPrefix + Config.amazonBucket + "/" + drug[0].rpc;
              res.setHeader('last-modified', drug[0].last_updated);
              res.status(200).send(drug[0]);
            } else {
              res.status(304).send();
            }
          }
        });
      }
    });

  app.use('/apiMyPrescription', router);
};
