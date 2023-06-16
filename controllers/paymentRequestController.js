const qrcode = require("qrcode");
const fs = require("fs");
const axios = require("axios");

const { LocalStorage } = require("node-localstorage");

// Create a local storage instance with a specific directory path
const localStorage = new LocalStorage("./qrCodes");

// Function to generate a payment request QR code
exports.generatePaymentRequestQR = async (req, res) => {
  const { address, amount, message } = req.query;

  try {
    // Generate the payment request string
    const paymentRequest = `bitcoin:${address}?amount=${amount}&message=${message}`;

    // Generate the QR code image as a data URL
    const qrCode = await qrcode.toDataURL(paymentRequest);

    // Store the QR code image in the local storage
    const qrCodeId = Date.now().toString();
    const qrCodeKey = `qrCode_${qrCodeId}`;
    localStorage.setItem(qrCodeKey, qrCode);

    // Save the QR code image as a PNG file with a unique code name
    const qrCodeImageFileName = `payment-request-qr-${qrCodeId}.png`;
    const qrCodeImageFilePath = `./qrCodes/${qrCodeImageFileName}`;
    const qrCodeImage = qrCode.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(qrCodeImageFilePath, qrCodeImage, "base64");

    // Generate a shareable QR code using an online service
    const qrCodeAPIUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      paymentRequest
    )}`;
    const response = await axios.get(qrCodeAPIUrl, {
      responseType: "arraybuffer",
    });
    const qrCodeImageBase64 = Buffer.from(response.data, "binary").toString(
      "base64"
    );
    const qrCodeImageUrl = qrCodeAPIUrl; // Use the QR code URL received from the service

    // Return the QR code image data, file path, and URL in JSON format
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
