const axios = require("axios");
const bitcore = require("bitcore-lib");

// Get the balance of an address
exports.getBalance = async (req, res) => {
  const address = req.params.address;
  const balance = await fetchBalance(address);
  res.json({ balance: bitcore.Unit.fromSatoshis(balance).toBTC() });
};

// Get the transactions of an address
exports.getTransactions = async (req, res) => {
  const address = req.params.address;
  const transactions = await fetchTransactions(address);
  res.json({ transactions });
};

// Fetch the balance of an address
const fetchBalance = async (address) => {
  try {
    const response = await axios.get(
      `https://blockstream.info/testnet/api/address/${address}`
    );
    return (
      response.data.chain_stats.funded_txo_sum -
      response.data.chain_stats.spent_txo_sum
    );
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
};

// Fetch the transactions of an address
const fetchTransactions = async (address) => {
  try {
    const response = await axios.get(
      `https://blockstream.info/testnet/api/address/${address}/txs`
    );
    return response.data;
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error;
  }
};
