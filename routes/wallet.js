const express = require("express");
const router = express.Router();
const {
  createWallet,
  createHDWallet,
} = require("../controllers/walletController");

// Create a new wallet
router.get("/", createWallet);

// Create a new HD wallet
router.get("/hd", createHDWallet);

module.exports = router;
