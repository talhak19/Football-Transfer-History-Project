const express = require('express');
const router = express.Router();

const inCharge = require('../middleware/isInCharge');
const locals = require("../middleware/locals");
const presidentController = require("../controllers/president")

router.get("/club_players",locals,inCharge,presidentController.getPlayers);


router.get("/add_player",locals,inCharge,presidentController.getAddPlayer);

router.post("/add_player",locals,inCharge,presidentController.postAddPlayer);

router.get('/club_players/:playerid',locals, inCharge,presidentController.getEditPlayer);

router.post('/club_players',locals, inCharge,presidentController.postEditPlayer);

router.post('/delete_player',locals,inCharge, presidentController.postDeletePlayer);


module.exports = router;
