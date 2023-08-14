const axios = require("axios");

/**
 * Fetches the status of a given Bitcoin transaction ID from the Blockstream API.
 *
 * @param {string} txid - The Bitcoin transaction ID or hash to fetch status for.
 * @returns {Object} - Returns the status and relevant details of the transaction.
 * @throws {Error} - Throws an error if there's an issue fetching the transaction or if the transaction is not found.
 */
const getTransactionStatus = async (txid) => {
  try {
    const response = await axios.get(`https://blockstream.info/api/tx/${txid}`);
    const transaction = response.data;

    if (transaction.status.confirmed) {
      return {
        txid,
        confirmed: true,
        confirmations: transaction.status.block_height,
        message: "Transaction is confirmed.",
      };
    } else {
      return {
        txid,
        confirmed: false,
        confirmations: 0,
        message: "Transaction is unconfirmed.",
      };
    }
  } catch (error) {
    return {
      txid,
      error: "Error fetching transaction or transaction not found.",
    };
  }
};

/**
 * Endpoint to verify the status of one or multiple Bitcoin transactions.
 *
 * @param {Object} req - Express request object, containing one or multiple transaction IDs in the body.
 * @param {Object} res - Express response object, used to send back the verification results.
 */
exports.verifyTx = async (req, res) => {
  // Check if the input is an array of transaction IDs. If not, make it an array for easier processing.
  const txids = Array.isArray(req.body.txids)
    ? req.body.txids
    : [req.body.txids];

  // Use Promise.all to fetch the status for all transaction IDs concurrently.
  const promises = txids.map((txid) => getTransactionStatus(txid));

  const results = await Promise.all(promises);

  res.json(results);
};
