// ===============================
// ON PAGE LOAD
// ===============================
window.onload = function () {

    // Prevent past date booking
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").setAttribute("min", today);

    // Check if payment was successful
    const paymentStatus = localStorage.getItem("paymentStatus");

    if (paymentStatus === "success") {
        alert("🎉 Booking Confirmed Successfully!");
        localStorage.removeItem("paymentStatus");
        localStorage.removeItem("selectedPaymentMethod");
    }
};


// ===============================
// ONLY NUMBERS IN PHONE FIELD
// ===============================
document.getElementById("phone").addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, '');
});


// ===============================
// ONLY NUMBERS IN PINCODE FIELD
// ===============================
document.getElementById("pincode").addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, '');
});


// ===============================
// FORM SUBMIT
// ===============================
document.getElementById("bookingForm").addEventListener("submit", function (e) {

    e.preventDefault();

    // Get field values
    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const addressLine1 = document.getElementById("addressLine1").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    const payment = document.querySelector('input[name="payment"]:checked');

    // Basic Required Validation
    if (!fullName || !phone || !addressLine1 || !city || !pincode || !date || !time) {
        alert("Please fill all required fields.");
        return;
    }

    // Phone Validation
    if (phone.length !== 10) {
        alert("Phone number must be exactly 10 digits.");
        return;
    }

    // Pincode Validation
    if (pincode.length !== 6) {
        alert("Pincode must be exactly 6 digits.");
        return;
    }

    // Payment Validation
    if (!payment) {
        alert("Please select payment method.");
        return;
    }

    const method = payment.value;

    // ===============================
    // CASH ON SERVICE
    // ===============================
    if (method === "Cash") {
        alert("🎉 Booking Confirmed Successfully (Cash on Service)");
        return;
    }

    // ===============================
    // ONLINE PAYMENT REDIRECTION
    // ===============================
    localStorage.setItem("selectedPaymentMethod", method);

    // Optional: store booking data temporarily
    const bookingData = {
        name: fullName,
        phone: phone,
        address: addressLine1,
        city: city,
        pincode: pincode,
        date: date,
        time: time,
        paymentMethod: method
    };

    localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

    // Redirect to payment page
    window.location.href = "payment.html";

});