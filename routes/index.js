const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


//Welcome Page
router.get('/dashboard', ensureAuthenticated, (req, res) =>  
res.render('dashboard', {
    name: req.user.name 
}));

//Dashboard  Page
module.exports = router;