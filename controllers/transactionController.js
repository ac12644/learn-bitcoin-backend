const axios = require("axios");
const bitcore = require("bitcore-lib");

/**
 * Get the balance of a Bitcoin address and return it in BTC.
 *
 * @param {Object} req - Express request object, containing the Bitcoin address in the params.
 * @param {Object} res - Express response object, used to send back the balance.
 */
exports.getBalance = async (req, res) => {
  const address = req.params.address; // Extract Bitcoin address from request parameters
  const balance = await fetchBalance(address); // Fetch balance using helper function
  res.json({ balance: bitcore.Unit.fromSatoshis(balance).toBTC() }); // Convert balance from Satoshis to BTC and send response
};

/**
 * Get the list of transactions associated with a Bitcoin address.
 *
 * @param {Object} req - Express request object, containing the Bitcoin address in the params.
 * @param {Object} res - Express response object, used to send back the list of transactions.
 */
exports.getTransactions = async (req, res) => {
  const address = req.params.address; // Extract Bitcoin address from request parameters
  const transactions = await fetchTransactions(address); // Fetch transactions using helper function
  res.json({ transactions }); // Send the transactions list as response
};

/**
 * Fetches the balance of a given Bitcoin address by querying the Blockstream API.
 *
 * @param {string} address - The Bitcoin address to fetch balance for.
 * @returns {number} - Returns the balance in Satoshis.
 * @throws {Error} - Throws an error if there's an issue with the fetch.
 */
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
    throw error; // Propagate the error to be handled by the calling function
  }
};

/**
 * Fetches the transactions associated with a given Bitcoin address from the Blockstream API.
 *
 * @param {string} address - The Bitcoin address to fetch transactions for.
 * @returns {Array} - Returns an array of transactions.
 * @throws {Error} - Throws an error if there's an issue with the fetch.
 */
const fetchTransactions = async (address) => {
  try {
    const response = await axios.get(
      `https://blockstream.info/testnet/api/address/${address}/txs`
    );
    return response.data; // Returns the list of transactions for the provided address
  } catch (error) {
    console.error(`Error: ${error}`);
    throw error; // Propagate the error to be handled by the calling function
  }
};
