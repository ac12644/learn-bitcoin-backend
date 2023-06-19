const express = require("express");
const bodyParser = require("body-parser");
const walletRoutes = require("./routes/wallet");
const transactionRoutes = require("./routes/transaction");
const paymentRoutes = require("./routes/payment");
const sendBtcRouter = require("./routes/sendBtc");

const app = express();

app.use(bodyParser.json());

// Routes
app.use("/wallet", walletRoutes);
app.use("/transactions", transactionRoutes);
app.use("/payment", paymentRoutes);
app.use("/sendbtc", sendBtcRouter);

// API Documentation
app.get("/", (req, res) => {
  const routes = [
    {
      route: "/wallet",
      description: "Create a new Bitcoin wallet",
      method: "GET",
      response: {
        example: {
          privateKey: "your_private_key",
          address: "your_wallet_address",
        },
      },
    },
    {
      route: "/wallet/hd",
      description: "Create a new HD wallet",
      method: "GET",
      response: {
        example: {
          xpub: "your_xpub_key",
          privateKey: "your_private_key",
          address: "your_wallet_address",
          mnemonic: "your_mnemonic_phrase",
        },
      },
    },
    {
      route: "/transactions/balance/:address",
      description: "Get the balance of a specific address",
      method: "GET",
      parameters: [
        {
          name: "address",
          description: "The Bitcoin address to retrieve the balance for",
        },
      ],
      response: {
        example: {
          balance: 0.5,
        },
      },
    },
    {
      route: "/transactions/:address",
      description: "Get the transactions of a specific address",
      method: "GET",
      parameters: [
        {
          name: "address",
          description: "The Bitcoin address to retrieve the transactions for",
        },
      ],
      response: {
        example: {
          transactions: [
            {
              txid: "transaction_id_1",
              amount: 0.1,
              timestamp: "2023-06-14T12:00:00Z",
            },
            {
              txid: "transaction_id_2",
              amount: 0.2,
              timestamp: "2023-06-13T10:30:00Z",
            },
          ],
        },
      },
    },
    {
      route: "/sendbtc",
      description: "Send Bitcoin from a specific address to another",
      method: "POST",
      parameters: [
        {
          name: "to",
          description: "The Bitcoin address to send the BTC to",
          type: "string",
          required: true,
        },
        {
          name: "amount",
          description: "The amount of BTC to send",
          type: "number",
          required: true,
        },
      ],
      body_example: {
        to: "destination_BTC_address",
        amount: 0.01,
      },
      response: {
        example: {
          txId: "transaction_id",
        },
      },
    },
    {
      route: "payment/payment-request-qr",
      description: "Generate a payment request with a QR code",
      method: "POST",
      parameters: [
        {
          name: "address",
          description: "The Bitcoin address for the payment request",
        },
        {
          name: "amount",
          description: "The requested payment amount",
        },
        {
          name: "message",
          description: "The message to include in the QR code",
        },
      ],
      response: {
        example: {
          success: Boolean,
          qrCodeId: "generated_qr_code_id",
          qrCodeImageUrl: "generated_qr_code_image_url",
          qrCodeImageBase64: "generated_qr_code_image_base64",
          qrCodeImageFileName: "generated_qr_code_image_file_name",
          qrCodeImageFilePath: "generated_qr_code_image_file_path",
        },
      },
    },
    // Add more routes and descriptions here
  ];

  const documentation = routes.map((route) => {
    return {
      route: route.route,
      method: route.method,
      description: route.description,
      parameters: route.parameters || [],
      response: route.response || {},
    };
  });

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.17/tailwind.min.css">
      <title>My Bitcoin Wallet API</title>
    </head>
    <body>
      <div class="container mx-auto p-6">
        <h1 class="text-3xl mb-6">My Bitcoin Wallet API</h1>
        <p class="mb-4">Welcome to the My Bitcoin Wallet API! Below are the available routes:</p>
        <ul class="space-y-4">
          ${documentation
            .map(
              (doc) => `
                <li class="bg-gray-100 rounded-lg p-4">
                  <h4 class="text-lg font-medium">${doc.method}: <code>${
                doc.route
              }</code></h4>
                  <p class="mb-2">${doc.description}</p>
                  ${
                    doc.parameters.length > 0
                      ? `
                        <h5 class="font-medium mb-1">Parameters:</h5>
                        <ul class="list-disc ml-4">
                          ${doc.parameters
                            .map(
                              (param) => `
                                <li>
                                  <strong>${param.name}</strong>: ${param.description}
                                </li>
                              `
                            )
                            .join("")}
                        </ul>`
                      : ""
                  }
                  ${
                    Object.keys(doc.response).length > 0
                      ? `
                        <h5 class="font-medium mb-1">Response:</h5>
                        <pre class="bg-gray-200 p-2 rounded-lg">${JSON.stringify(
                          doc.response.example,
                          null,
                          2
                        )}</pre>
                      `
                      : ""
                  }
                </li>
              `
            )
            .join("")}
        </ul>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.4.2/alpine.min.js"></script>
    </body>
    </html>
  `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
