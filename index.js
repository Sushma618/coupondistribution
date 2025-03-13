const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const getNextCoupon = require('./coupons');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const userClaims = {}; // To store IP addresses and timestamps

// Route to distribute coupons
app.get('/get-coupon', (req, res) => {
    const ip = req.ip;
    const now = Date.now();

    // ✅ IP Tracking: Check if the same IP has claimed a coupon within 1 hour
    if (userClaims[ip] && now - userClaims[ip] < 3600000) { // 1 hour = 3600000 ms
        const remainingTime = Math.ceil((3600000 - (now - userClaims[ip])) / 1000);
        return res.status(429).json({ success: false, message: `Try again after ${remainingTime} seconds` });
    }

    // ✅ Cookie Tracking: Check if the same browser session has claimed a coupon within 1 hour
    if (req.cookies.lastClaimTime) {
        const lastClaimTime = parseInt(req.cookies.lastClaimTime);
        if (now - lastClaimTime < 3600000) {
            const remainingTime = Math.ceil((3600000 - (now - lastClaimTime)) / 1000);
            return res.status(429).json({ success: false, message: `Try again after ${remainingTime} seconds` });
        }
    }

    // Store IP and set cookie for 1 hour lock
    userClaims[ip] = now;
    res.cookie('lastClaimTime', now.toString(), { maxAge: 3600000 }); // 1 hour expiry

    const coupon = getNextCoupon();
    res.json({ success: true, coupon });
});

// Start the server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
