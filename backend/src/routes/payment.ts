import { Router } from 'express';
import Payment from '../models/Payment';
import { encrypt, decrypt } from '../utils/ccavenue';

const router = Router();

// Retrieve configuration variables from environment
const getCCavenueConfig = () => ({
  merchantId: process.env.CCAVENUE_MERCHANT_ID || '',
  accessCode: process.env.CCAVENUE_ACCESS_CODE || '',
  workingKey: process.env.CCAVENUE_WORKING_KEY || '',
  mockMode: process.env.CCAVENUE_MOCK === 'true',
  gatewayUrl: process.env.CCAVENUE_GATEWAY_URL || 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction'
});

/**
 * POST /api/payment/initiate
 * Initializes a transaction, registers a Pending Payment in the DB, and encrypts payload for CCAvenue.
 */
router.post('/initiate', async (req: any, res: any) => {
  try {
    const { studentName, studentEmail, studentPhone, courseSlug, amount } = req.body;

    // Check Honeypot for anti-spam (if invisible field is filled by bot)
    if (req.body.fax || req.body.website) {
      console.warn('[SPAM TRIGGERED] Honeypot field filled during payment initiation.');
      return res.status(400).json({ error: 'Bot activity detected.' });
    }

    if (!studentName || !studentEmail || !studentPhone || !courseSlug || !amount) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid transaction amount.' });
    }

    // Generate unique order ID
    const orderId = `ATK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create a new pending payment record
    await Payment.create({
      orderId,
      amount: parsedAmount,
      courseSlug,
      studentName,
      studentEmail,
      studentPhone,
      status: 'Pending'
    });

    const config = getCCavenueConfig();

    if (config.mockMode) {
      // Mock flow details returned to frontend
      console.log(`[PAYMENT MOCK INITIATED] Order: ${orderId}, Amount: ${parsedAmount}`);
      return res.json({
        mock: true,
        orderId,
        amount: parsedAmount,
        studentName,
        studentEmail,
        studentPhone,
        courseSlug
      });
    }

    // Live CCAvenue flow integration
    const host = req.get('host') || 'test.appteknow.com';
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const callbackUrl = `${protocol}://${host}/api/payment/response`;

    // Construct raw query string for encryption
    const queryParams = [
      `merchant_id=${config.merchantId}`,
      `order_id=${orderId}`,
      `amount=${parsedAmount.toFixed(2)}`,
      `currency=INR`,
      `redirect_url=${callbackUrl}`,
      `cancel_url=${callbackUrl}`,
      `language=EN`,
      `billing_name=${encodeURIComponent(studentName)}`,
      `billing_email=${encodeURIComponent(studentEmail)}`,
      `billing_tel=${encodeURIComponent(studentPhone)}`
    ].join('&');

    const encRequest = encrypt(queryParams, config.workingKey);

    return res.json({
      mock: false,
      encRequest,
      accessCode: config.accessCode,
      gatewayUrl: config.gatewayUrl,
      orderId
    });

  } catch (err: any) {
    console.error('Error initiating CCAvenue payment:', err);
    return res.status(500).json({ error: 'Failed to initiate payment.' });
  }
});

/**
 * POST /api/payment/response
 * Callback endpoint that receives form POST response from CCAvenue.
 */
router.post('/response', async (req: any, res: any) => {
  const host = req.get('host') || 'test.appteknow.com';
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const redirectBase = `${protocol}://${host}/thank-you-page`;

  try {
    const config = getCCavenueConfig();
    let orderId = '';
    let status: 'Success' | 'Failure' | 'Aborted' = 'Failure';
    let trackingId = '';
    let bankRefNo = '';
    let failureMessage = '';

    // Check if it is a mock response from the simulator page
    if (req.body.mock === 'true') {
      orderId = req.body.orderId;
      status = req.body.status === 'Success' ? 'Success' : 'Failure';
      trackingId = `MOCK-${Date.now()}`;
      bankRefNo = `BANK-MOCK-${Date.now()}`;
      failureMessage = req.body.status !== 'Success' ? 'Simulated transaction failure.' : '';
    } else {
      // Live decrypted response flow
      const encResp = req.body.encResp;
      if (!encResp) {
        console.error('[CCAVENUE ERROR] Missing encResp in response body.');
        return res.redirect(`${redirectBase}?status=failed`);
      }

      const decrypted = decrypt(encResp, config.workingKey);
      const params: any = {};
      decrypted.split('&').forEach((pair) => {
        const [key, val] = pair.split('=');
        params[key] = decodeURIComponent(val || '').trim();
      });

      orderId = params.order_id;
      trackingId = params.tracking_id;
      bankRefNo = params.bank_ref_no;
      failureMessage = params.failure_message || '';

      const rawStatus = params.order_status;
      if (rawStatus === 'Success') {
        status = 'Success';
      } else if (rawStatus === 'Aborted') {
        status = 'Aborted';
      } else {
        status = 'Failure';
      }
    }

    // Find and update the database record
    const payment = await Payment.findOne({ where: { orderId } });
    if (payment) {
      await payment.update({
        trackingId,
        bankRefNo,
        status,
        failureMessage: status !== 'Success' ? failureMessage : null
      });
      console.log(`[PAYMENT COMPLETED] Order: ${orderId}, Status: ${status}`);
    } else {
      console.error(`[PAYMENT DB ERROR] Payment record not found for orderId: ${orderId}`);
    }

    // Redirect user back to the thank you page with status
    const outcome = status === 'Success' ? 'success' : 'failed';
    return res.redirect(`${redirectBase}?status=${outcome}&orderId=${orderId}`);

  } catch (err: any) {
    console.error('Error handling CCAvenue payment response:', err);
    return res.redirect(`${redirectBase}?status=failed`);
  }
});

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AdminSetting from '../models/AdminSetting';

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '../../uploads_receipts');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpeg, jpg, png, webp, gif)!'));
    }
  }
});

const uploadSingleScreenshot = (req: any, res: any, next: any) => {
  upload.single('screenshot')(req, res, (err: any) => {
    if (err) {
      console.error('[MULTER UPLOAD ERROR]:', err);
      return res.status(400).json({ error: err.message || 'File upload failed.' });
    }
    next();
  });
};

/**
 * GET /api/payment/upi-details
 * Fetches the active UPI ID and QR code image configured by the admin.
 */
router.get('/upi-details', async (req: any, res: any) => {
  try {
    const upiIdSetting = await AdminSetting.findOne({ where: { key: 'upi_id' } }) as any;
    const upiQrSetting = await AdminSetting.findOne({ where: { key: 'upi_qr_code' } }) as any;

    let upiQrCode = upiQrSetting ? upiQrSetting.value : '';
    if (upiQrCode && (upiQrCode.includes('localhost') || upiQrCode.includes('127.0.0.1'))) {
      try {
        upiQrCode = new URL(upiQrCode).pathname;
      } catch (e) {
        const idx = upiQrCode.indexOf('/uploads');
        if (idx !== -1) {
          upiQrCode = upiQrCode.substring(idx);
        }
      }
    }

    // Force default QR code asset if not set or seeded empty
    if (!upiQrCode) {
      upiQrCode = '/uploads_qr/upi_qr_code.png';
    }

    return res.json({
      upiId: upiIdSetting ? upiIdSetting.value : 'aptech.dec-5@okicici',
      upiQrCode
    });
  } catch (err: any) {
    console.error('Error fetching UPI details:', err);
    return res.status(500).json({ error: 'Failed to fetch UPI details.' });
  }
});

/**
 * POST /api/payment/submit-screenshot
 * Handles the UPI screenshot upload and creates a pending payment log in the DB.
 */
router.post('/submit-screenshot', uploadSingleScreenshot, async (req: any, res: any) => {
  try {
    const { studentName, studentEmail, studentPhone, courseSlug, amount } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a transaction screenshot.' });
    }

    if (!studentName || !studentEmail || !studentPhone || !courseSlug || !amount) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid transaction amount.' });
    }

    // Generate unique order ID for manual UPI payment
    const orderId = `ATK-UPI-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const screenshotUrl = `/uploads_receipts/${req.file.filename}`;

    // Create a new pending payment record with paymentMode: 'UPI_SCREENSHOT'
    await Payment.create({
      orderId,
      amount: parsedAmount,
      courseSlug,
      studentName,
      studentEmail,
      studentPhone,
      screenshotUrl,
      paymentMode: 'UPI_SCREENSHOT',
      status: 'Pending'
    });

    console.log(`[UPI PAYMENT REGISTERED] Order: ${orderId}, Screenshot: ${screenshotUrl}`);
    return res.json({
      success: true,
      orderId,
      amount: parsedAmount,
      studentName,
      studentEmail,
      studentPhone,
      courseSlug,
      screenshotUrl
    });

  } catch (err: any) {
    console.error('Error registering UPI payment receipt:', err);
    return res.status(500).json({ error: 'Failed to submit payment registration.' });
  }
});

export default router;
