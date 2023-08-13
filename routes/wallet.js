const express = require("express");
const router = express.Router();
const {
  createWallet,
  createHDWallet,
  importWalletFromMnemonic,
} = require("../controllers/walletController");

// Create a new wallet
router.get("/", createWallet);

// Create a new HD wallet
router.get("/hd", createHDWallet);

// Retrieve wallett from MNEMONIC keyy
router.get("/retrieveWallet", importWalletFromMnemonic);

module.exports = router;
