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
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching fee estimates:", error);
    res.status(500).json({ error: "Failed to fetch fee estimates" });
  }
};
