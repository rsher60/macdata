var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var ps = require('python-shell');
var dash = require('appmetrics-dash').attach()

var url = 'mongodb://localhost:27017/test-database-1';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//additions after 2/4/2019
router.get('/python',function(req,res,next){
  ps.PythonShell.run('/PATH/TO/example.py', null, function (err, results)
   { if (err) throw err;
     console.log('finished'); 
     console.log(results);
     });
});
//--------------------------------------------------
router.get('/download', function(req,res,nect){
  res.render('index3')
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('collection').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
     // res.render('index4', {items: resultArray});
      return res.json(resultArray)
      console.log(resultArray);
    });
  });
});


router.get('/view-data',function(req,res,next){

  res.render('index4');
})



router.post('/insert', function(req, res, next) {
  var item = {
    Area: req.body.Area,
    content: req.body.content,
    author: req.body.author
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });

  res.redirect('/');
});

router.post('/update', function(req, res, next) {
  var item = {
    Area: req.body.Area,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});



module.exports = router;
