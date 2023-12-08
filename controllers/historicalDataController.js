const axios = require("axios");

/**
 * Endpoint to fetch historical Bitcoin data.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getHistoricalData = async (req, res) => {
  const { startDate, endDate } = req.query; // YYYY-MM-DD format

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range`,
      {
        params: {
          vs_currency: "usd",
          from: new Date(startDate).getTime() / 1000,
          to: new Date(endDate).getTime() / 1000,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    res.status(500).json({ error: "Failed to fetch historical data" });
  }
};
