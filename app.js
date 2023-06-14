const express = require("express");
const bodyParser = require("body-parser");
const walletRoutes = require("./routes/wallet");
const transactionRoutes = require("./routes/transaction");

const app = express();

app.use(bodyParser.json());

// Routes
app.use("/wallet", walletRoutes);
app.use("/transactions", transactionRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
