const router = require('express').Router();
const{getCustomers,searchUser,createCustomers} = require('../controllers/customer');
router.get('/', getCustomers);

router.get("/search", searchUser);
router.get("/create", createCustomers)
module.exports = router;