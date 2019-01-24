"use strict"
const express = require('express');
const Db = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const db = new Db();
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

// CORS middleware
const allowCrossDomain = function (req, res, next) {
  req.header('Access-Control-Allow-Origin', '*');
  req.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, *');
  req.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, *');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, *');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, *');
  next();
}

app.use(allowCrossDomain)

router.get('/users', (req, res) => {
  console.log('[api.USERS]: ' + JSON.stringify(req.body))
  db.getAllUsers().then(users => {
    if (!users) users = []
    return res.status(200).send({users: users})
  }).catch(error => {
    return res.status(500).send({error: '[api.USERS~ERROR]: ' + error})
  })
})

router.get('/users/:userId/budget', (req, res) => {
  console.log('[api.BUDGET]: ' + JSON.stringify(req.body))
  db.getUserBudget(req.params.userId).then(result => {
    const budget = result[0].budget;
    return res.status(200).send({budget: budget})
  }).catch(error => {
    return res.status(500).send({error: '[api.BUDGET~ERROR]: ' + error})
  })
})

router.post('/users/register', (req, res) => {
  console.log('[api.REGISTER]: ' + JSON.stringify(req.body))
  db.insertUser([
    req.body.user.username,
    req.body.user.email,
    bcrypt.hashSync(req.body.user.password, 8),
    req.body.user.birthday,
  ]).then(() => {
    return res.status(200).send({auth: false, token: null});
  }).catch(error => {
    return res.status(500).send({error: '[api.REGISTER~ERROR]: ' + error})
  })
});

router.post('/users/login', (req, res) => {
  console.log('[api.LOGIN]: ' + JSON.stringify(req.body))
  db.selectUserByEmail(req.body.user.email).then(result => {
    const user = result[0];
    if (!user) return res.status(404).send({error: '[api.LOGIN]: No user found or user not activated.'});
    const passwordIsValid = bcrypt.compareSync(req.body.user.password, user.passwd);
    if (!passwordIsValid) return res.status(401).send({
      auth: false,
      token: null,
      error: '[api.LOGIN]: Incorrect password.'
    })
    const token = jwt.sign({id: user.uid}, config.secret, {expiresIn: 86400})
    return res.status(200).send({auth: true, token: token, user: user});
  }).catch(error => {
    return res.status(500).send({error: '[api.LOGIN~ERROR]: ' + error});
  })
})

router.get('/auth', (req, res) => {
  console.log('[api.AUTH]: ' + JSON.stringify(req.headers))
  if (!req.headers.authorization) return res.status(404).send({error: '[api.AUTH]: Please send token for authentication.'})
  const token = req.headers.authorization.replace(/token/gi, '').trim()
  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) return res.status(404).send({error: '[api.AUTH]: Failed authentication.'})
    res.status(200).send({auth: true, token: token})
  })
})

app.use(router)

const port = process.env.PORT || 3000;

const server = app.listen(port, function () {
  console.log('Express api listening on port ' + port)
});
