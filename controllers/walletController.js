const { PrivateKey } = require("bitcore-lib");
const { mainnet, testnet } = require("bitcore-lib/lib/networks");
const Mnemonic = require("bitcore-mnemonic");
const { LocalStorage } = require("node-localstorage");

// Initialize a local storage instance with a specific directory path
const localStorage = new LocalStorage("./scratch");

/**
 * Endpoint to create and return a new wallet.
 */
exports.createWallet = (req, res) => {
  const wallet = generateWallet();
  res.json(wallet);
};

/**
 * Endpoint to create and return a new Hierarchical Deterministic (HD) wallet.
 */
exports.createHDWallet = (req, res) => {
  const hdWallet = generateHDWallet();
  res.json(hdWallet);
};

/**
 * Generates a new wallet for the specified network (defaults to testnet).
 *
 * @param {Object} [network=testnet] - The network (testnet or mainnet) for which to generate the wallet.
 * @returns {Object} - The generated wallet with its private key and address.
 */
const generateWallet = (network = testnet) => {
  const privateKey = new PrivateKey();
  const address = privateKey.toAddress(network);

  const wallet = {
    privateKey: privateKey.toString(),
    address: address.toString(),
  };

  // Retrieve existing wallets from local storage
  const existingWallets = JSON.parse(localStorage.getItem("wallets")) || [];
  const updatedWallets = [...existingWallets, wallet];

  localStorage.setItem("wallets", JSON.stringify(updatedWallets));

  return wallet;
};

/**
 * Generates a new Hierarchical Deterministic (HD) wallet for the specified network (defaults to testnet).
 *
 * @param {Object} [network=testnet] - The network (testnet or mainnet) for which to generate the HD wallet.
 * @returns {Object} - The generated HD wallet with its extended public key, private key, address, and mnemonic.
 */
const generateHDWallet = (network = testnet) => {
  const passPhrase = new Mnemonic(Mnemonic.Words.SPANISH);
  const xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);

  const hdWallet = {
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    mnemonic: passPhrase.toString(),
  };

  // Retrieve existing wallets from local storage
  const existingWallets = JSON.parse(localStorage.getItem("wallets")) || [];
  const updatedWallets = [...existingWallets, hdWallet];

  localStorage.setItem("wallets", JSON.stringify(updatedWallets));

  return hdWallet;
};

/**
 * Endpoint to import a wallet using a provided mnemonic.
 * @param {Object} req - Express request object, containing the mnemonic in the body.
 * @param {Object} res - Express response object, used to send the response.
 * @returns {Object} JSON response containing the wallet details or an error message.
 */
exports.importWalletFromMnemonic = (req, res) => {
  const { mnemonic } = req.body;

  // Check if mnemonic is provided
  if (!mnemonic) {
    return res.status(400).json({ error: "Mnemonic is required" });
  }

  try {
    // Import wallet using provided mnemonic
    const wallet = importWalletFromMnemonic(mnemonic);

    // Send the imported wallet as JSON response
    res.json(wallet);
  } catch (error) {
    // Log the error and send a failure response
    console.error("Error importing wallet from mnemonic:", error);
    res.status(500).json({ error: "Failed to import wallet from mnemonic" });
  }
};

/**
 * Imports a wallet from a provided mnemonic.
 *
 * @param {string} mnemonic - The mnemonic used to recover the wallet.
 * @returns {Object} - The imported wallet with its extended public key, private key, address, and mnemonic.
 * @throws {Error} - Throws an error if the mnemonic is invalid.
 */
const importWalletFromMnemonic = (mnemonic) => {
  const passPhrase = new Mnemonic(mnemonic);

  // Check if mnemonic is valid
  if (!Mnemonic.isValid(mnemonic)) {
    throw new Error("Invalid mnemonic provided.");
  }

  const xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), testnet); // Assuming you want to use testnet by default

  const wallet = {
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    mnemonic: mnemonic,
  };

  // Retrieve existing wallets from local storage
  const existingWallets = JSON.parse(localStorage.getItem("wallets")) || [];
  const updatedWallets = [...existingWallets, wallet];

  localStorage.setItem("wallets", JSON.stringify(updatedWallets));

  return wallet;
};
