const axios = require("axios");

/**
 * Endpoint to estimate Bitcoin transaction fees.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.estimateFee = async (req, res) => {
  try {
    const response = await axios.get(
      `https://blockstream.info/api/fee-estimates`
    );

    // Calculate the average fee for the next 6 blocks
    let totalFee = 0;
    for (let i = 1; i <= 6; i++) {
      totalFee += response.data[i];
    }
    const averageFeeSatoshis = totalFee / 6;

    // Convert the average fee to BTC (1 BTC = 100,000,000 Satoshis)
    const averageFeeBTC = averageFeeSatoshis / 100000000;

    res.json({ averageFeeBTC, averageFeeSatoshis });
  } catch (error) {
    console.error("Error fetching fee estimates:", error);
    res.status(500).json({ error: "Failed to fetch fee estimates" });
  }
};
