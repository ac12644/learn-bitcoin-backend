require("dotenv").config();
const bitcore = require("bitcore-lib");
const axios = require("axios");

/**
 * Create a time-locked Bitcoin transaction.
 * This transaction cannot be broadcasted to the network until the specified lock time has expired.
 *
 * @param {Object} req - The express request object.
 * @param {Object} req.body - The request body containing transaction details.
 * @param {string} req.body.recipientAddress - The Bitcoin address to which funds should be sent once time-lock expires.
 * @param {string} req.body.amountInBTC - The amount in Bitcoin to send.
 * @param {number} req.body.timestamp - The Unix timestamp after which the transaction can be broadcasted.
 *
 * @returns {string} A serialized transaction that can be broadcasted to the Bitcoin network once the time-lock has expired.
 */

exports.createTimeLockTransaction = async (req, res) => {
  try {
    const { recipientAddress, amountInBTC, timestamp } = req.body;

    console.log(recipientAddress, amountInBTC, timestamp);

    // Check if params are provided

    if (!recipientAddress || !amountInBTC || !timestamp) {
      return res.status(400).json({ error: "Parameters are  missing!" });
    }

    // Check if provided timestamp is in the past.
    const currentTimestamp = Math.floor(Date.now() / 1000); // Convert current date to seconds (Unix timestamp).
    if (timestamp <= currentTimestamp) {
      throw new Error(
        "Provided timestamp is in the past. Please provide a future timestamp."
      );
    }

    // Initialize the Bitcoin testnet.
    const testnet = bitcore.Networks.testnet;
    const privateKey = new bitcore.PrivateKey.fromWIF(
      process.env.BITCOIN_PRIVATE_KEY,
      testnet
    );
    const address = privateKey.toAddress(testnet);

    const { data: utxos } = await axios.get(
      `https://blockstream.info/testnet/api/address/${address}/utxo`
    );

    if (utxos.length === 0) {
      throw new Error("No UTXOs found for this address.");
    }

    let totalAmountAvailable = 0;
    const transaction = new bitcore.Transaction();

    const publicKey = bitcore.PublicKey.fromPrivateKey(privateKey);
    const scriptPubKey =
      bitcore.Script.buildPublicKeyHashOut(publicKey).toString();

    utxos.forEach((utxo) => {
      transaction.from({
        txId: utxo.txid,
        outputIndex: utxo.vout,
        script: scriptPubKey,
        satoshis: utxo.value,
      });
      totalAmountAvailable += utxo.value;
    });

    const satoshisToSend = bitcore.Unit.fromBTC(amountInBTC).toSatoshis();
    const fee = 50000;
    const remaining = totalAmountAvailable - satoshisToSend - fee;

    if (remaining < 0) {
      throw new Error("Insufficient balance.");
    }

    // Directly use the provided timestamp as lockTime for the transaction.
    const lockTime = timestamp;

    transaction.to(recipientAddress, satoshisToSend);
    transaction.change(address);
    transaction.fee(fee);
    transaction.lockUntilDate(new Date(lockTime * 1000));
    transaction.sign(privateKey);

    return transaction.serialize();
  } catch (error) {
    console.error("Error creating time-locked transaction:", error);
    throw error;
  }
};
