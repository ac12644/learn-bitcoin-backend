const bitcore = require("bitcore-lib");

/**
 * Endpoint to validate a Bitcoin address and identify its network (mainnet or testnet).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.validateAddress = (req, res) => {
  const address = req.query.address;

  try {
    let isValid = false;
    let network = "invalid";

    if (bitcore.Address.isValid(address, bitcore.Networks.livenet)) {
      isValid = true;
      network = "mainnet";
    } else if (bitcore.Address.isValid(address, bitcore.Networks.testnet)) {
      isValid = true;
      network = "testnet";
    }

    res.json({ address, isValid, network });
  } catch (error) {
    console.error("Error validating address:", error);
    res.status(400).json({ error: "Invalid address format" });
  }
};
