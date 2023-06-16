const { PrivateKey } = require("bitcore-lib");
const { mainnet, testnet } = require("bitcore-lib/lib/networks");
const Mnemonic = require("bitcore-mnemonic");
const { LocalStorage } = require("node-localstorage");

const localStorage = new LocalStorage("./scratch");

// Create a new wallet
exports.createWallet = (req, res) => {
  const wallet = generateWallet();
  res.json(wallet);
};

// Create a new HD wallet
exports.createHDWallet = (req, res) => {
  const hdWallet = generateHDWallet();
  res.json(hdWallet);
};

// Generate a new wallet
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

// Generate a new HD wallet
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
