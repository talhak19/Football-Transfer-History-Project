const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/authentication');
const locals = require("../middleware/locals");

const userController = require('../controllers/user');

router.get('/',locals, userController.getMain);
router.get('/players', locals,userController.getPlayers);


router.get('/in_transfer_list', locals,userController.getInterestedTransfer);
router.get('/in_loan_list', locals,userController.getInterestedLoan);
router.get("/all_transfers",locals,userController.getAllTransfers);


router.get('/negotiations',locals, isAuthenticated,userController.getNegotiations);
router.post('/negotiations',locals,isAuthenticated, userController.postNegotiations);
router.post('/delete_listitem',locals, isAuthenticated,userController.postTransferListDelete);



router.get('/done_deals',locals, isAuthenticated,userController.getDoneDeals);
router.post('/complete_transfer', locals,isAuthenticated,userController.postDeal);


router.get('/player_details/:playerid',locals, isAuthenticated,userController.getPlayerDetails);

router.get("/positions/:positionid",locals, isAuthenticated,userController.getPlayerByPosition);



module.exports = router;