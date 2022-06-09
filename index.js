const express = require('express')
const app = express()
const port = 5000;
var cors = require('cors')
var bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(express.json())

var PASSWORD = 'CeXZmStkP87M1eVA';
var USER = 'jewel4124';

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { json } = require('express/lib/response');
const uri = `mongodb+srv://${USER}:${PASSWORD}@cluster0.jyuwz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const usersCollection = client.db("restaurant").collection("users");
  const menuCollection = client.db("restaurant").collection("menus");
  const productsCollection = client.db("restaurant").collection("products");
  const ingradientCollection = client.db("restaurant").collection("ingradients");
  const cartCollection = client.db("restaurant").collection("cart");


  // perform actions on the collection object


  //-----------------------GET ------------
  app.get('/login/:requestedObj', (req, res) => {

    var jsonObj = JSON.parse(req.params.requestedObj);
    // console.log(jsonObj);

    usersCollection.find(jsonObj).toArray((err, doc) => {
      res.send(doc)
    })
  })

  app.get('/getAllMenus', (req, res) => {

    menuCollection.find({}).toArray((err, doc) => {
      res.send(doc)
    })
  })


  app.get('/getProductDetails/:pdId', (req, res) => {
    const receivedObjectId = ObjectId(req.params.pdId);

    productsCollection.find({ _id: receivedObjectId }).toArray((err, doc) => {
      res.send(doc[0])
    })
  })


  app.get('/getProductIngradients/:pdId', (req, res) => {
    const receivedId = req.params.pdId;

    ingradientCollection.find({ productId: receivedId }).toArray((err, doc) => {
      res.send(doc)
    })
  })


  app.get('/getProductsByMenu/:menuName', (req, res) => {

    //  console.log(req.params.menuName);
    var queryObj = {};
    if (req.params.menuName == 'all') {
      queryObj = {};
    }
    else {
      queryObj = { menuName: req.params.menuName };

    }

    productsCollection.find(queryObj).toArray((err, doc) => {
      res.send(doc)
    })

  })

  //---------POST ---------------


  app.post('/addMenu', (req, res) => {

    //  var jsonObj=req.body);
    console.log(req.body);

    menuCollection.insertOne(req.body, (err, doc) => {
      res.send(doc)
    })
  })

  app.post('/addProduct', (req, res) => {
    // console.log(req.body);

    productsCollection.insertOne(req.body, (err, doc) => {
      res.send(doc)
    })
  })

  app.post('/addIngradient', (req, res) => {
    // console.log(req.body);

    ingradientCollection.insertOne((req.body), (err, doc) => {
      res.send(doc)
    })
  })


  app.post('/addProductToCart', (req, res) => {

    var qty = 0;
    const myCursor = cartCollection.find({ pdId: req.body.id });

    var newObj={};

    myCursor.forEach((doc) => {
      qty = doc.quantity + 1;

    cartCollection.updateOne(
      { pdId: req.body.id },
      {
        $set: {quantity: qty,  date: new Date().toDateString()}
      },(err,doc)=>{
        res.send(doc)
      }
    )

    });
    
  })



  //   client.close();
});

app.listen(process.env.PORT || port);