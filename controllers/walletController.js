const bitcore = require("bitcore-lib");
const Mnemonic = require("bitcore-mnemonic");
const { LocalStorage } = require("node-localstorage");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Initialize a local storage instance with a specific directory path
const localStorage = new LocalStorage("./scratch");

const saltRounds = 10;

// Encrypts the mnemonic using a password
function encryptMnemonic(mnemonic, password) {
  const salt = crypto.randomBytes(16); // Generate a new salt
  const key = crypto.scryptSync(password, salt, 32); // Key length is 32 for AES-256
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(mnemonic, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Store the salt and IV with the encrypted data, for example, by concatenating them
  const encryptedDataWithSaltAndIV =
    salt.toString("hex") + iv.toString("hex") + encrypted;
  return encryptedDataWithSaltAndIV;
}

// Decrypts the mnemonic using a password
function decryptMnemonic(encryptedDataWithSaltAndIV, password) {
  // Extract the salt and IV from the stored data
  const salt = Buffer.from(encryptedDataWithSaltAndIV.substring(0, 32), "hex");
  const iv = Buffer.from(encryptedDataWithSaltAndIV.substring(32, 64), "hex");
  const encryptedData = encryptedDataWithSaltAndIV.substring(64);

  const key = crypto.scryptSync(password, salt, 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Generates a new wallet for the specified network (defaults to testnet).
 *
 * @param {Object} [network=testnet] - The network (testnet or mainnet) for which to generate the wallet.
 * @returns {Object} - The generated wallet with its private key and address.
 */
const generateWallet = (network = bitcore.Networks.testnet) => {
  const privateKey = new bitcore.PrivateKey();
  const address = privateKey.toAddress(network);

  const wallet = {
    privateKey: privateKey.toString(),
    address: address.toString(),
  };

  // Store wallet
  const existingWallets = JSON.parse(localStorage.getItem("wallets")) || [];
  const updatedWallets = [...existingWallets, wallet];
  localStorage.setItem("wallets", JSON.stringify(updatedWallets));

  return wallet;
};

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
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const hdWallet = generateHDWallet(password);
  res.json(hdWallet);
};

/**
 * Endpoint to create and return a new Hierarchical Deterministic (HD) wallet.
 */
exports.createHDWallet = (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const hdWallet = generateHDWallet(password);
  res.json(hdWallet);
};

/**
 * Generates a new Hierarchical Deterministic (HD) wallet.
 * Encrypts the mnemonic using the provided password.
 *
 * @param {string} password - The password used to encrypt the mnemonic.
 * @returns {Object} - The generated HD wallet with encrypted mnemonic and other details.
 */
const generateHDWallet = (password) => {
  const mnemonic = new Mnemonic();
  const xpriv = mnemonic.toHDPrivateKey();

  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const encryptedMnemonic = encryptMnemonic(mnemonic.toString(), password);

  const hdWallet = {
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    encryptedMnemonic: encryptedMnemonic,
    passwordHash: hashedPassword,
  };

  // Store the wallet with encrypted mnemonic and hashed password
  const existingWallets = JSON.parse(localStorage.getItem("hdwallets")) || [];
  const updatedWallets = [...existingWallets, hdWallet];
  localStorage.setItem("hdwallets", JSON.stringify(updatedWallets));

  return {
    xpub: hdWallet.xpub,
    address: hdWallet.address,
  };
};

/**
 * Endpoint to import a wallet using a provided mnemonic and password.
 */
exports.importWalletFromMnemonic = (req, res) => {
  const { mnemonic, password } = req.body;

  if (!mnemonic || !password) {
    return res
      .status(400)
      .json({ error: "Mnemonic and password are required" });
  }

  try {
    const wallet = importWalletFromMnemonic(mnemonic, password);
    res.json(wallet);
  } catch (error) {
    console.error("Error importing wallet from mnemonic:", error);
    res.status(500).json({ error: "Failed to import wallet from mnemonic" });
  }
};

/**
 * Imports a wallet from a provided mnemonic.
 * Encrypts the mnemonic using the provided password.
 *
 * @param {string} mnemonic - The mnemonic used to recover the wallet.
 * @param {string} password - The password used to encrypt the mnemonic.
 * @returns {Object} - The imported wallet with encrypted mnemonic and other details.
 * @throws {Error} - Throws an error if the mnemonic is invalid.
 */
const importWalletFromMnemonic = (mnemonic, password) => {
  if (!Mnemonic.isValid(mnemonic)) {
    throw new Error("Invalid mnemonic provided.");
  }

  const passPhrase = new Mnemonic(mnemonic);
  const xpriv = passPhrase.toHDPrivateKey();

  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const encryptedMnemonic = encryptMnemonic(mnemonic, password);

  const wallet = {
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    encryptedMnemonic: encryptedMnemonic,
    passwordHash: hashedPassword,
  };

  // Store the wallet with encrypted mnemonic and hashed password
  const existingWallets = JSON.parse(localStorage.getItem("wallets")) || [];
  const updatedWallets = [...existingWallets, wallet];
  localStorage.setItem("wallets", JSON.stringify(updatedWallets));

  return {
    xpub: wallet.xpub,
    address: wallet.address,
  };
};

/**
 * Create a multisig P2SH address.
 *
 * @param {Object} req - Express request object containing the public keys and required signature count.
 * @param {Object} res - Express response object, used to send back the multisig address.
 */
exports.createMultisig = (req, res) => {
  const { publicKeys, requiredSignatures } = req.body;

  if (!publicKeys || publicKeys.length < requiredSignatures) {
    return res
      .status(400)
      .json({ error: "Invalid public keys or required signatures count." });
  }

  const address = bitcore.Address.createMultisig(
    publicKeys.map((key) => new bitcore.PublicKey(key)),
    requiredSignatures,
    bitcore.Networks.testnet
  );

  // Store multisig address
  const existingWallets = JSON.parse(localStorage.getItem("multisig")) || [];
  const updatedWallets = [...existingWallets, address.toString()];
  localStorage.setItem("multisig", JSON.stringify(updatedWallets));

  res.json({ address: address.toString() });
};

/**
 * Endpoint to retrieve the decrypted mnemonic of the wallet.
 * @param {Object} req - Express request object, containing the password in the body.
 * @param {Object} res - Express response object, used to send the response.
 */
exports.retrieveMnemonic = (req, res) => {
  const { password } = req.body;

  // Retrieve the wallet from storage
  const walletData = JSON.parse(localStorage.getItem("hdwallets")); // assuming HD wallets are used
  if (!walletData || walletData.length === 0) {
    return res.status(404).json({ error: "Wallet not found" });
  }

  // Assuming the last created wallet is the one to be accessed
  const latestWallet = walletData[walletData.length - 1];

  // Verify the password
  if (!bcrypt.compareSync(password, latestWallet.passwordHash)) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Decrypt the mnemonic
  const decryptedMnemonic = decryptMnemonic(
    latestWallet.encryptedMnemonic,
    password
  );

  res.json({ mnemonic: decryptedMnemonic });
};
