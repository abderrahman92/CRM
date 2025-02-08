//variable d'environement
const express = require("express");
const cors = require("cors");
const path =require('path')
const app = express();
const PORT = process.env.PORT || 8080 ;

const db = require("./models");

const Role = db.role;

require('dotenv').config();
var corsOptions = {
  origin: "https://crm.sofitech.pro"
};

app.use(cors(corsOptions));
console.log(cors(corsOptions))
app.use(express.static(path.join(__dirname , "client","build")))
//all path in front end
app.get('/register', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/login', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/Ajouter', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/Societes', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/Societe/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/AllAction', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/modifier/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/Action/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.get('/Actions/modifier/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/Inter/modifier/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/Interl', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/Interlocuteur/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/user/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/admin', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/User/Info/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/change-password', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/reset-password/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/forget-password', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/confirmation/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
app.get('/reject/:id', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));



// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/societes')(app);
require('./routes/action')(app);
require('./routes/interlocuteur')(app);




//role insert data en dure 
function initial() {
  Role.create({
    id: 1,
    name: "cemeca"
  });
 
  Role.create({
    id: 2,
    name: "sofitech"
  });
 
  Role.create({
    id: 3,
    name: "admin_cemaca"
  });
  Role.create({
    id: 4,
    name: "admin_sofitech"
  });
  Role.create({
    id: 5,
    name: "super_cemeca"
  });
  Role.create({
    id: 6,
    name: "super_sofitech"
  });
  Role.create({
    id: 7,
    name: "super_admin1"
  });
  Role.create({
    id: 8,
    name: "super_admin"
  });
}
/* Get hostname of os in Node.js */
let mysql = require('mysql2');

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});



//listen port 
app.listen(PORT,process.env.PORT, () => {
  console.log(`Server is running `);
});

