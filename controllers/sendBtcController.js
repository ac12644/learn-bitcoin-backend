require("dotenv").config();
const bitcore = require("bitcore-lib");
const axios = require("axios");

/**
 * Send Bitcoin to a specified address.
 *
 * @param {Object} req - The express request object.
 * @param {Object} req.body - The request body parameters.
 * @param {string} req.body.amount - The amount in Bitcoin to send.
 * @param {string} req.body.to - The Bitcoin address to send funds to.
 *
 * @param {Object} res - The express response object.
 * @returns {Object} A JSON response containing the transaction ID if successful.
 */
exports.sendBitcoin = async (req, res) => {
  try {
    // Initialize for the Bitcoin test network
    const testnet = bitcore.Networks.testnet;

    // Load the Bitcoin private key from environment variables
    const privateKey = new bitcore.PrivateKey.fromWIF(
      process.env.BITCOIN_PRIVATE_KEY,
      testnet
    );
    const address = privateKey.toAddress(testnet);

    // Fetch the unspent transaction outputs (UTXOs) for the given address
    const { data: utxos } = await axios.get(
      `https://blockstream.info/testnet/api/address/${address}/utxo`
    );

    if (utxos.length === 0) {
      return res
        .status(400)
        .send({ error: "No UTXOs found for this address." });
    }

    let totalAmountAvailable = 0;
    const transaction = new bitcore.Transaction();

    // Get the public key from the private key to generate the scriptPubKey
    const publicKey = bitcore.PublicKey.fromPrivateKey(privateKey);
    const scriptPubKey =
      bitcore.Script.buildPublicKeyHashOut(publicKey).toString();

    // Loop through each UTXO to include in our transaction
    utxos.forEach((utxo) => {
      transaction.from({
        txId: utxo.txid,
        outputIndex: utxo.vout,
        script: scriptPubKey,
        satoshis: utxo.value,
      });
      totalAmountAvailable += utxo.value;
    });

    const satoshisToSend = bitcore.Unit.fromBTC(req.body.amount).toSatoshis();
    const fee = 50000;
    const remaining = totalAmountAvailable - satoshisToSend - fee;

    // Check for sufficient balance to send the transaction
    if (remaining < 0) {
      return res.status(400).send({ error: "Insufficient balance." });
    }

    // Build the transaction
    transaction.to(req.body.to, satoshisToSend);
    transaction.change(address);
    transaction.fee(fee);
    transaction.sign(privateKey);

    // Serialize the constructed transaction
    const serializedTransaction = transaction.serialize();

    // Use the blockcypher API to broadcast the transaction
    const { data: result } = await axios.post(
      "https://api.blockcypher.com/v1/btc/test3/txs/push",
      {
        tx: serializedTransaction,
      }
    );

    // Return the transaction ID
    res.send({ txId: result.tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
