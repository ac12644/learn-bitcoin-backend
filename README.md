# Bitcoin Wallet Backend Playground

Welcome to the Bitcoin Wallet Backend Playground documentation! This API allows you to learn and experiment with Bitcoin wallets and transactions. This API will help you understand the basics of creating wallets, managing balances, and exploring transactions.

**Note: This API is for learning purposes only and should not be used in a production environment.**

## Getting Started

To get started with the API, follow the steps below:

1. Install the required dependencies:

   - Node.js
   - Express.js
   - Bitcore-lib

2. Clone the repository to your local machine:

   ```
   git clone https://github.com/your-username/my-wallet-api.git
   ```

3. Navigate to the project directory:

   ```
   cd my-wallet-api
   ```

4. Install the project dependencies:

   ```
   npm install
   ```

5. Start the server:
   ```
   node app.js
   ```

Now you're ready to interact with the API endpoints described below.

## API Endpoints

### Create Wallet

Create a new wallet and get its details.

- **Endpoint:** `/wallet`
- **Method:** GET

### Create HD Wallet

Create a new hierarchical deterministic (HD) wallet and get its details.

- **Endpoint:** `/wallet/hd`
- **Method:** GET

### Get Balance

Get the balance of a specific address.

- **Endpoint:** `/transactions/balance/:address`
- **Method:** GET

### Get Transactions

Get the transactions associated with a specific address.

- **Endpoint:** `/transactions/:address`
- **Method:** GET

## Examples

Here are some example requests and responses for the API endpoints:

### Create Wallet

#### Request

```http
GET /wallet
```

#### Response

```json
{
  "privateKey": "abcf123456789...",
  "address": "mvWqrftxCJa5eSKp229gkZbMf2XXrfZe9p"
}
```

### Create HD Wallet

#### Request

```http
GET /wallet/hd
```

#### Response

```json
{
  "xpub": "xpub6Dp5dtLR...",
  "privateKey": "xprv9s21ZrQH...",
  "address": "mvWqrftxCJa5eSKp229gkZbMf2XXrfZe9p",
  "mnemonic": "word1 word2 word3 ..."
}
```

### Get Balance

#### Request

```http
GET /transactions/balance/:address
```

#### Response

```json
{
  "balance": 0.01234567
}
```

### Get Transactions

#### Request

```http
GET /transactions/:address
```

#### Response

```json
{
  "transactions": [
    {
      "txid": "0004128cae112e3e1b4ae628b7a78c9ec105a120152ddf65c12f9398fbcb1b20",
      "version": 2,
      "locktime": 2437735,
      "vin": [
        {
          "txid": "8fa65fb497ce511a9134ebb8710b1e650148ce3c871b8a814509b938316786f7",
          "vout": 1,
          "prevout": {
            "scriptpubkey": "0014f10a55ec5dd506e2c84505b78c8d779d7cd1be4b",
            "scriptpubkey_asm": "OP_0 OP_PUSHBYTES_20 f10a55ec5dd506e2c84505b78c8d779d7cd1be4b",
            "scriptpubkey_type": "v0_p2wpkh",
            "scriptpubkey_address": "tb1q7y99tmza65rw9jz9qkmcerthn47dr0jtxtgg69",
            "value": 1224074
          },
          "scriptsig": "",
          "scriptsig_asm": "",
          "witness": [
            "3044022006d9e4b1633569311d7a9d8042c57fcb5857209a0e0d2abd8a8f07e96abebe270220708116a8dfe59617165b43bc3c393ace52dc111fbe67d23f032d137de5ae19a501",
            "0216013066fb948dd9cd8eaacb41913a71692254f36770a1d8b5b67f5e3d7a821d"
          ],
          "is_coinbase": false,
          "sequence": 4294967294
        }
      ],
      "vout": [
        {
          "scriptpubkey": "76a914e7d8367357aa01fbdc6b51c9cae3113059fb602688ac",
          "scriptpubkey_asm": "OP_DUP OP_HASH160 OP_PUSHBYTES_20 e7d8367357aa01fbdc6b51c9cae3113059fb6026 OP_EQUALVERIFY OP_CHECKSIG",
          "scriptpubkey_type": "p2pkh",
          "scriptpubkey_address": "n2eqQ65kSrDRHz5QYkGe3GTVDiJYeuatmV",
          "value": 7868
        },
        {
          "scriptpubkey": "76a9146a7c340d7b74f3d347182df2b049f535be8dbafd88ac",
          "scriptpubkey_asm": "OP_DUP OP_HASH160 OP_PUSHBYTES_20 6a7c340d7b74f3d347182df2b049f535be8dbafd OP_EQUALVERIFY OP_CHECKSIG",
          "scriptpubkey_type": "p2pkh",
          "scriptpubkey_address": "mqDziBnVjjFT9oZjRxNGPuatxTf245zybf",
          "value": 1216059
        }
      ],
      "size": 228,
      "weight": 585,
      "fee": 147,
      "status": {
        "confirmed": true,
        "block_height": 2437736,
        "block_hash": "0000000000000018985b8447833b9b47527cd9a83da3ccdeef6bcddfd2052585",
        "block_time": 1686776311
      }
    }
  ]
}
```

## Getting Test BTC

To get test BTC for your generated wallet, you can visit [CoinFaucet.eu](https://coinfaucet.eu/en/btc-testnet/) which provides a faucet for Bitcoin testnet. Follow these steps:

1. Visit [CoinFaucet.eu](https://coinfaucet.eu/en/btc-testnet/) in your web browser.
2. Enter your testnet address (generated from the API) in the provided field.
3. Complete any required verification (e.g., CAPTCHA) if prompted.
4. Click on the "Get Coins" or similar button to request test BTC.
5. Wait for the transaction to be processed, and you should receive test BTC in your generated wallet.

Please note that the availability and functionality of the faucet may vary, so you may need to explore alternative options if the mentioned faucet is not working or accessible.

Happy learning and exploring with your Bitcoin wallet API!

Feel free to modify and customize the content according to your specific needs. Happy learning!
