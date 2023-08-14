const express = require("express");
const router = express.Router();
const {
  createWallet,
  createHDWallet,
  importWalletFromMnemonic,
  createMultisig,
} = require("../controllers/walletController");

// Create a new wallet
router.get("/", createWallet);

// Create a new HD wallet
router.get("/hd", createHDWallet);

// Retrieve wallet from MNEMONIC keyy
router.get("/retrieveWallet", importWalletFromMnemonic);

// Create Multisig wallet
router.post("/multisig", createMultisig);

module.exports = router;
