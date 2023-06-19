require("dotenv").config();
const bitcore = require("bitcore-lib");
const axios = require("axios");

exports.sendBitcoin = async (req, res) => {
  try {
    const testnet = bitcore.Networks.testnet;
    const privateKey = new bitcore.PrivateKey.fromWIF(
      process.env.BITCOIN_PRIVATE_KEY,
      testnet
    );
    const address = privateKey.toAddress(testnet);

    const { data: utxos } = await axios.get(
      `https://blockstream.info/testnet/api/address/${address}/utxo`
    );

    let totalAmountAvailable = 0;
    const transaction = new bitcore.Transaction();

    if (utxos.length === 0) {
      return res
        .status(400)
        .send({ error: "No UTXOs found for this address." });
    }

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

    const satoshisToSend = bitcore.Unit.fromBTC(req.body.amount).toSatoshis();
    const fee = 50000;
    const remaining = totalAmountAvailable - satoshisToSend - fee;

    if (remaining < 0) {
      return res.status(400).send({ error: "Insufficient balance." });
    }

    transaction.to(req.body.to, satoshisToSend);
    transaction.change(address);
    transaction.fee(fee);
    transaction.sign(privateKey);

    const serializedTransaction = transaction.serialize();

    // Blockstream doesn't provide an API for broadcasting transactions,
    // so you can use blockcypher's API for this
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
