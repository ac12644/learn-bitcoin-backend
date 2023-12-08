const express = require("express");
const bodyParser = require("body-parser");
const walletRoutes = require("./routes/wallet");
const transactionRoutes = require("./routes/transaction");
const paymentRoutes = require("./routes/payment");
const sendBtcRouter = require("./routes/sendBtc");
const timeLockRouter = require("./routes/timeLock");
const verifyTxRouter = require("./routes/verifyTx");
const validateAddressRouter = require("./routes/validateAddress");
const estimateFeeRouter = require("./routes/estimateFee");
const historicalDataRouter = require("./routes/historicalData");

const app = express();

app.use(bodyParser.json());

// Routes
app.use("/wallet", walletRoutes);
app.use("/transactions", transactionRoutes);
app.use("/payment", paymentRoutes);
app.use("/sendbtc", sendBtcRouter);
app.use("/timeLock", timeLockRouter);
app.use("/verifyTx", verifyTxRouter);
app.use("/validateAddress", validateAddressRouter);
app.use("/estimateFee", estimateFeeRouter);
app.use("/historicalData", historicalDataRouter);

// API Documentation
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <!-- Basic SEO tags -->
      <title>Bitcoin API</title>
      <meta name="description" content="An API interface for Bitcoin operations.">
      <meta name="keywords" content="Bitcoin, Wallet, API, Cryptocurrency, Blockchain">
      <!-- Open Graph / Facebook tags -->
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://github.com/ac12644/bitcoin-backend-playground">
      <meta property="og:title" content="Bitcoin Wallet API">
      <meta property="og:description" content="An API interface for Bitcoin wallet operations.">
      <meta property="og:image" content="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png">
      <link rel="icon" href="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/800px-Bitcoin.svg.png" type="image/x-icon">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.17/tailwind.min.css">
      <style>
         @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
         body {
         background-color: #1A1A1A;
         color: #fff;
         font-family: 'Roboto', sans-serif;
         line-height: 1.6;
         }
         h1, h4 {
         color: #f2a900;
         }
         .container {
         max-width: 800px;
         margin: 0 auto;
         padding: 2rem;
         }
         .api-card {
         background-color: #2a2a2a;
         border-radius: 8px;
         padding: 20px;
         margin-bottom: 1rem;
         }
         .api-card:hover {
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
         }
         input[type="text"], input[type="number"], input[type="date"] {
         padding: 8px;
         border-radius: 4px;
         border: 1px solid #ccc;
         margin-right: 10px;
         line-height: 1.5;
         background-color: #000; 
         color: #fff; 
         }
         button {
         background-color: #f2a900;
         color: black;
         border: none;
         padding: 10px 20px;
         border-radius: 4px;
         cursor: pointer;
         }
         button:hover {
         background-color: #e2a500;
         }
         .response {
         background-color: #333;
         color: #0f0;
         font-family: 'Courier New', monospace;
         padding: 10px;
         margin-top: 10px;
         border-radius: 4px;
         max-height: 200px;  /* Set a maximum height */
         overflow-y: auto;   /* Make it scrollable */
         }
      </style>
   </head>
   <body>
      <div class="container mx-auto p-6">
         <h1 class="text-3xl mb-6">Bitcoin API Playground</h1>
         <p class="mb-4">Below are the available routes:</p>
         <ol>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">GET: <code>/wallet</code></h4>
               <p class="mb-2">Create a new Bitcoin wallet</p>
               <button onclick="fetchCreateWallet()">Create Wallet</button>
               <div id="createWalletResponse" class="response"></div>
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">GET: <code>/wallet/hd</code></h4>
               <p class="mb-2">Create a new HD (Hierarchical Deterministic) wallet</p>
               <button onclick="fetchCreateHDWallet()">Create HD Wallet</button>
               <div id="createHDWalletResponse" class="response"></div>
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">POST: <code>/wallet/multisig</code></h4>
               <p class="mb-2">Create a Multisig wallet</p>
               <form id="createMultisigWalletForm" class="mb-4">
                  <input type="text" id="publicKeysInput" placeholder="Public Keys (comma-separated)" required>
                  <input type="number" id="requiredSignaturesInput" placeholder="Required Signatures" required>
                  <button type="submit">Create Multisig Wallet</button>
               </form>
               <div id="createMultisigWalletResponse" class="response"></div>
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">GET: <code>/wallet/retrieveWallet</code></h4>
               <p class="mb-2">Import wallet details from a mnemonic phrase</p>
               <form id="retrieveWalletForm" class="mb-4">
                  <input type="text" id="mnemonicInput" placeholder="Mnemonic Phrase" required>
                  <button type="submit">Retrieve Wallet</button>
               </form>
               <div id="retrieveWalletResponse" class="response"></div>
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">GET: <code>/transactions/balance/:address</code></h4>
               <p class="mb-2">Get the balance of a specific address</p>
               <form id="getBalanceForm" class="mb-4">
                  <input type="text" id="balanceAddressInput" placeholder="Bitcoin Address" required>
                  <button type="submit">Get Balance</button>
               </form>
               <div id="getBalanceResponse" class="response"></div>
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">GET: <code>/transactions/:address</code></h4>
               <p class="mb-2">Get the transactions of a specific address</p>
               <form id="getTransactionsForm" class="mb-4">
                  <input type="text" id="transactionsAddressInput" placeholder="Bitcoin Address" required>
                  <button type="submit">Get Transactions</button>
               </form>
               <div id="getTransactionsResponse" class="response"></div>
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">POST: <code>/verifyTx</code></h4>
               <p class="mb-2">Verify the status of one or multiple Bitcoin transactions</p>
               <form id="verifyTxForm" class="mb-4">
                  <input type="text" id="txidsInput" placeholder="Transaction ID(s)" required>
                  <button type="submit">Verify Transactions</button>
               </form>
               <div id="verifyTxResponse" class="response"></div>
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">POST: <code>/sendbtc</code></h4>
               <p class="mb-2">Send Bitcoin from a specific address to another</p>
               <form id="sendBtcForm" class="mb-4">
                  <input type="text" id="btcToInput" placeholder="Destination BTC Address" required>
                  <input type="number" id="btcAmountInput" placeholder="Amount to Send" required>
                  <button type="submit">Send BTC</button>
               </form>
               <div id="sendBtcResponse" class="response"></div>
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">GET: <code>/payment/payment-request-qr</code></h4>
               <p class="mb-2">Generate a payment request with a QR code</p>
               <form id="paymentRequestQRForm" class="mb-4">
                  <input type="text" id="qrAddressInput" placeholder="Bitcoin Address" required>
                  <input type="text" id="qrAmountInput" placeholder="Amount" required>
                  <input type="text" id="qrMessageInput" placeholder="Message">
                  <button type="submit">Generate QR</button>
               </form>
               <div id="paymentRequestQRResponse" class="response"></div>
               <img id="qrCodeImage" style="display:none; margin-top:10px;" />
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">POST: <code>/timeLock</code></h4>
               <p class="mb-2">Create a time-locked Bitcoin transaction</p>
               <form id="timeLockForm" class="mb-4">
                  <input type="text" id="recipientAddressInput" placeholder="Recipient Address" required>
                  <input type="text" id="amountInBTCInput" placeholder="Amount in BTC" required>
                  <input type="number" id="timestampInput" placeholder="Timestamp" required>
                  <button type="submit">Create Time Lock</button>
               </form>
               <div id="timeLockResponse" class="response"></div>
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">GET: <code>/estimateFee</code></h4>
               <p class="mb-2">Estimate transaction fees based on network congestion</p>
               <button onclick="fetchEstimateFee()">Estimate Fee</button>
               <div id="estimateFeeResponse" class="response"></div>
            </li>
            <li class="rounded-lg p-4">
               <h4 class="text-lg font-medium">GET: <code>/historicalData</code></h4>
               <p class="mb-2">Fetch historical data for Bitcoin, such as past prices and transaction volumes</p>
               <form id="historicalDataForm" class="mb-4">
                  <input type="date" id="startDateInput" required>
                  <input type="date" id="endDateInput" required>
                  <button type="submit">Fetch Data</button>
               </form>
               <div id="historicalDataResponse" class="response"></div>
            </li>
         </ol>
      </div>
      <script>
         function fetchEstimateFee() {
           fetch('/estimateFee')
             .then(response => response.json())
             .then(data => {
               document.getElementById('estimateFeeResponse').innerText = JSON.stringify(data, null, 2);
             })
             .catch(error => console.error('Error:', error));
         }
         
         document.getElementById('historicalDataForm').addEventListener('submit', function(e) {
           e.preventDefault();
           var startDate = document.getElementById('startDateInput').value;
           var endDate = document.getElementById('endDateInput').value;
           var url = '/historicalData?startDate=' + encodeURIComponent(startDate) + '&endDate=' + encodeURIComponent(endDate);
         
           fetch(url)
             .then(function(response) { return response.json(); })
             .then(function(data) {
               document.getElementById('historicalDataResponse').innerText = JSON.stringify(data, null, 2);
             })
             .catch(function(error) { console.error('Error:', error); });
         });
         
         document.getElementById('sendBtcForm').addEventListener('submit', function(e) {
           e.preventDefault();
           const toAddress = document.getElementById('btcToInput').value;
           const amount = document.getElementById('btcAmountInput').value;
           fetch('/sendbtc', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({ to: toAddress, amount: amount }),
           })
             .then(response => response.json())
             .then(data => {
               document.getElementById('sendBtcResponse').innerText = JSON.stringify(data, null, 2);
             })
             .catch(error => console.error('Error:', error));
         });
         
         
          document.getElementById('timeLockForm').addEventListener('submit', function(e) {
           e.preventDefault();
           const recipientAddress = document.getElementById('recipientAddressInput').value;
           const amountInBTC = document.getElementById('amountInBTCInput').value;
           const timestamp = document.getElementById('timestampInput').value;
           fetch('/timeLock', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               recipientAddress: recipientAddress,
               amountInBTC: amountInBTC,
               timestamp: timestamp
             }),
           })
           .then(response => response.json())
           .then(data => {
             document.getElementById('timeLockResponse').innerText = JSON.stringify(data, null, 2);
           })
           .catch(error => console.error('Error:', error));
         });
         
         
          document.getElementById('getBalanceForm').addEventListener('submit', function(e) {
           e.preventDefault();
           var address = document.getElementById('balanceAddressInput').value;
           var url = '/transactions/balance/' + encodeURIComponent(address);
         
           fetch(url)
             .then(function(response) { return response.json(); })
             .then(function(data) {
               document.getElementById('getBalanceResponse').innerText = JSON.stringify(data, null, 2);
             })
             .catch(function(error) { console.error('Error:', error); });
         });
         
         document.getElementById('getTransactionsForm').addEventListener('submit', function(e) {
           e.preventDefault();
           var address = document.getElementById('transactionsAddressInput').value;
           var url = '/transactions/' + encodeURIComponent(address);
         
           fetch(url)
             .then(function(response) { return response.json(); })
             .then(function(data) {
               document.getElementById('getTransactionsResponse').innerText = JSON.stringify(data, null, 2);
             })
             .catch(function(error) { console.error('Error:', error); });
         });
         
         
          document.getElementById('verifyTxForm').addEventListener('submit', function(e) {
           e.preventDefault();
           const txids = document.getElementById('txidsInput').value.split(','); // Assuming comma-separated transaction IDs
           fetch('/verifyTx', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({ txids: txids }),
           })
           .then(response => response.json())
           .then(data => {
             document.getElementById('verifyTxResponse').innerText = JSON.stringify(data, null, 2);
           })
           .catch(error => console.error('Error:', error));
         });
         
         document.getElementById('paymentRequestQRForm').addEventListener('submit', function(e) {
         e.preventDefault();
         
         // Get values from input fields
         var address = document.getElementById('qrAddressInput').value;
         var amount = document.getElementById('qrAmountInput').value;
         var message = document.getElementById('qrMessageInput').value;
         
         // Construct URL with query parameters
         var url = '/payment/payment-request-qr?address=' + encodeURIComponent(address) +
                   '&amount=' + encodeURIComponent(amount) +
                   '&message=' + encodeURIComponent(message);
         
         // Fetch API call
         fetch(url)
           .then(function(response) { return response.json(); })
           .then(function(data) {
             // Update the UI with the response
             document.getElementById('paymentRequestQRResponse').innerText = JSON.stringify(data, null, 2);
         
             // Display QR code image if available
             if (data.qrCodeImageUrl) {
               document.getElementById('qrCodeImage').src = data.qrCodeImageUrl;
               document.getElementById('qrCodeImage').style.display = 'block';
             } else {
               document.getElementById('qrCodeImage').style.display = 'none';
             }
           })
           .catch(function(error) {
             console.error('Error:', error);
             document.getElementById('qrCodeImage').style.display = 'none';
           });
         });
         
         
         
          function fetchCreateWallet() {
           fetch('/wallet')
             .then(response => response.json())
             .then(data => {
               document.getElementById('createWalletResponse').innerText = JSON.stringify(data, null, 2);
             })
             .catch(error => console.error('Error:', error));
         }
         
          function fetchCreateHDWallet() {
           fetch('/wallet/hd')
             .then(response => response.json())
             .then(data => {
               document.getElementById('createHDWalletResponse').innerText = JSON.stringify(data, null, 2);
             })
             .catch(error => console.error('Error:', error));
         }
         
         
         document.getElementById('retrieveWalletForm').addEventListener('submit', function(e) {
         e.preventDefault();
         var mnemonic = document.getElementById('mnemonicInput').value;
         fetch('/wallet/retrieveWallet?mnemonic=' + encodeURIComponent(mnemonic))
           .then(function(response) { return response.json(); })
           .then(function(data) {
             document.getElementById('retrieveWalletResponse').innerText = JSON.stringify(data, null, 2);
           })
           .catch(function(error) { console.error('Error:', error); });
         });
         
         document.getElementById('createMultisigWalletForm').addEventListener('submit', function(e) {
           e.preventDefault();
           const publicKeys = document.getElementById('publicKeysInput').value.split(',');
           const requiredSignatures = document.getElementById('requiredSignaturesInput').value;
           fetch('/wallet/multisig', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({ publicKeys: publicKeys, requiredSignatures: requiredSignatures }),
           })
           .then(response => response.json())
           .then(data => {
             document.getElementById('createMultisigWalletResponse').innerText = JSON.stringify(data, null, 2);
           })
           .catch(error => console.error('Error:', error));
         });
         
          document.getElementById('receiveTransactionQRForm').addEventListener('submit', function(e) {
           e.preventDefault();
           const address = document.getElementById('receiveAddressInput').value;
           const amount = document.getElementById('receiveAmountInput').value;
           fetch('/receiveTransactionQR', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({ address: address, amount: amount }),
           })
           .then(response => response.json())
           .then(data => {
             document.getElementById('receiveTransactionQRResponse').innerText = JSON.stringify(data, null, 2);
           })
           .catch(error => console.error('Error:', error));
         });
         
      </script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.4.2/alpine.min.js"></script>
   </body>
</html>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
