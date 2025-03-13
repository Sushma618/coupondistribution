const coupons = ["COUPON1", "COUPON2", "COUPON3", "COUPON4", "COUPON5"];
let currentIndex = 0;

function getNextCoupon() {
    const coupon = coupons[currentIndex];
    currentIndex = (currentIndex + 1) % coupons.length;
    return coupon;
}

module.exports = getNextCoupon;
