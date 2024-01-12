require("dotenv").config();
const bitcore = require("bitcore-lib");
const axios = require("axios");
const { testnet } = require("bitcore-lib/lib/networks");

/**
 * Reimburse Bitcoin with fee estimation from /estimateFee endpoint.
 *
 * @param {Object} req - The express request object.
 * @param {Object} req.body - The request body parameters.
 * @param {string} req.body.amount - The amount in Bitcoin to reimburse.
 * @param {string} req.body.to - The Bitcoin address to reimburse funds to.
 *
 * @param {Object} res - The express response object.
 * @returns {Object} A JSON response containing the transaction ID if successful.
 */
exports.reimburseBitcoin = async (req, res) => {
  try {
    const privateKey = new bitcore.PrivateKey.fromWIF(
      process.env.BITCOIN_PRIVATE_KEY,
      testnet
    );
    const address = privateKey.toAddress(testnet);

    // Fetch UTXOs for the given address
    const { data: utxos } = await axios.get(
      `https://blockstream.info/testnet/api/address/${address}/utxo`
    );

    if (utxos.length === 0) {
      return res
        .status(400)
        .send({ error: "No UTXOs found for this address." });
    }

    // Call the /estimateFee endpoint to get the average fee in Satoshis
    const { data: feeData } = await axios.get(
      `http://localhost:3000/estimateFee`
    );
    const averageFeeSatoshis = feeData.averageFeeSatoshis;

    let totalAmountAvailable = utxos.reduce((acc, utxo) => acc + utxo.value, 0);
    const satoshisToReimburse = bitcore.Unit.fromBTC(
      req.body.amount
    ).toSatoshis();
    const transactionFee = averageFeeSatoshis;

    const remaining =
      totalAmountAvailable - satoshisToReimburse - transactionFee;

    if (remaining < 0) {
      return res.status(400).send({ error: "Insufficient balance." });
    }

    // Build the transaction
    const transaction = new bitcore.Transaction()
      .from(utxos)
      .to(req.body.to, satoshisToReimburse)
      .change(address)
      .fee(transactionFee)
      .sign(privateKey);

    // Serialize and broadcast the transaction
    const serializedTransaction = transaction.serialize();
    const { data: result } = await axios.post(
      "https://api.blockcypher.com/v1/btc/test3/txs/push",
      {
        tx: serializedTransaction,
      }
    );

    res.send({ txId: result.tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
