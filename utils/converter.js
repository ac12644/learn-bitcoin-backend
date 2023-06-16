function convertToBTC(balance) {
  const satoshisPerBTC = 100000000; // 1 BTC = 100 million satoshis
  const btcValue = balance / satoshisPerBTC;
  return btcValue.toFixed(8); // Return the BTC value formatted with 8 decimal places
}

function convertToSatoshis(value) {
  const satoshisPerBTC = 100000000; // 1 BTC = 100 million satoshis
  return Math.round(btcValue * satoshisPerBTC);
}

module.exports = { convertToBTC, convertToSatoshis };
