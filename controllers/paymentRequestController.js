const qrcode = require("qrcode");
const fs = require("fs");
const axios = require("axios");
const { LocalStorage } = require("node-localstorage");

// Create a local storage instance with a specific directory path to save QR codes.
const localStorage = new LocalStorage("./qrCodes");

/**
 * Generate a Bitcoin payment request QR code.
 * The generated QR code encodes a Bitcoin payment request which can be scanned by Bitcoin wallets for ease of payment.
 *
 * @param {Object} req - The express request object.
 * @param {Object} req.query - The request query parameters.
 * @param {string} req.query.address - The Bitcoin address where funds should be sent.
 * @param {string} req.query.amount - The amount in Bitcoin to request.
 * @param {string} req.query.message - An optional message for the payment request.
 *
 * @returns {Object} A JSON response containing the generated QR code data, file path, and URL.
 */
exports.generatePaymentRequestQR = async (req, res) => {
  const { address, amount, message } = req.query;
  if (!address || !amount) return console.log("Parameters missing!");
  try {
    // Construct the payment request string in the BIP21 format.
    const paymentRequest = `bitcoin:${address}?amount=${amount}&message=${message}`;

    // Use the 'qrcode' library to generate the QR code image as a data URL.
    const qrCode = await qrcode.toDataURL(paymentRequest);

    // Store the generated QR code image in local storage for later retrieval.
    const qrCodeId = Date.now().toString();
    const qrCodeKey = `qrCode_${qrCodeId}`;
    localStorage.setItem(qrCodeKey, qrCode);

    // Save the generated QR code image to a PNG file on disk.
    const qrCodeImageFileName = `payment-request-qr-${qrCodeId}.png`;
    const qrCodeImageFilePath = `./qrCodes/${qrCodeImageFileName}`;
    const qrCodeImage = qrCode.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(qrCodeImageFilePath, qrCodeImage, "base64");

    // Use an external QR code generation service to get another version of the QR code.
    const qrCodeAPIUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      paymentRequest
    )}`;

    const response = await axios.get(qrCodeAPIUrl, {
      responseType: "arraybuffer",
    });

    const qrCodeImageBase64 = Buffer.from(response.data, "binary").toString(
      "base64"
    );
    const qrCodeImageUrl = qrCodeAPIUrl; // Use the QR code URL received from the service.

    // Return the QR code details in the response.
    res.json({
      success: true,
      qrCodeId,
      qrCodeImageUrl,
      qrCodeImageBase64,
      qrCodeImageFileName,
      qrCodeImageFilePath,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
