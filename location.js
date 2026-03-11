// ==========================================
// GLOBAL LOCATION HANDLER (ASKS ONLY ONCE)
// ==========================================

function setLocationUI(city) {
  const nav = document.getElementById("navLocation");
  const searchLoc = document.getElementById("searchLocation");
  const inputLoc = document.getElementById("locationInput");

  if (nav) nav.innerHTML = `📍 ${city} ▾`;
  if (searchLoc) searchLoc.innerHTML = `📍 ${city}`;
  if (inputLoc) inputLoc.value = city;
}

function detectGlobalLocation() {

  // 🔹 If already saved, DO NOT ask again
  const savedCity = localStorage.getItem("userCity");
  if (savedCity) {
    setLocationUI(savedCity);
    return;   // 🚀 stop here
  }

  // 🔹 If not saved, ask for location once
  if (!navigator.geolocation) {
    setLocationUI("TN");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async function(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );

        const data = await response.json();

        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.state ||
          "TN";

        // 🔥 Save permanently
        localStorage.setItem("userCity", city);

        setLocationUI(city);

      } catch {
        setLocationUI("TN");
      }
    },
    function() {
      setLocationUI("TN");
    }
  );
}

detectGlobalLocation();