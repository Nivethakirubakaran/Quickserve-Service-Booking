// ===============================
// SET PAYMENT TITLE
// ===============================
const method = localStorage.getItem("selectedPaymentMethod");

if(method){
    document.getElementById("paymentTitle").innerText = method + " Payment";
}

// ===============================
// PAYMENT BUTTON
// ===============================
document.getElementById("payBtn").addEventListener("click", function(){

    const field1 = document.getElementById("paymentField1").value.trim();
    const field2 = document.getElementById("paymentField2").value.trim();

    if(!field1 || !field2){
        alert("Please fill payment details.");
        return;
    }

    // Show Loader
    document.getElementById("loader").style.display = "block";
    this.disabled = true;

    // Simulate payment processing
    setTimeout(function(){

        // Save payment status
        localStorage.setItem("paymentStatus", "success");

        // Redirect back
        window.location.href = "booking.html";

    }, 2000);
});