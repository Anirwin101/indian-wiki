// ✅ Remove .html from URLs for cleaner navigation
if (window.location.pathname.endsWith(".html")) {
    window.history.replaceState(null, "", window.location.pathname.replace(".html", ""));
}

// ✅ Redirect based on authentication status
async function checkAuthAndRedirect() {
    try {
        const response = await fetch("/check-auth");
        const data = await response.json();
        
        window.location.href = data.isAuthenticated ? "/states" : "/signup";  
    } catch (error) {
        console.error("Error checking authentication:", error);
        window.location.href = "/signup";  
    }
}

// ✅ Show/hide logout button based on authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch("/check-auth");
        const data = await response.json();
        const logoutButton = document.getElementById("logout-btn");

        if (logoutButton) {
            logoutButton.style.display = data.isAuthenticated ? "block" : "none";  
        }
    } catch (error) {
        console.error("Error checking auth status:", error);
    }
}

// ✅ Logout function
async function logout() {
    await fetch("/logout");
    window.location.href = "/login";  
}

// ✅ Run checkAuthStatus when page loads
document.addEventListener("DOMContentLoaded", checkAuthStatus);

document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");
    const thankYouMsg = document.getElementById("thank-you");

    stars.forEach(star => {
        star.addEventListener("click", async (event) => {
            const rating = event.target.getAttribute("data-rating");

            // Highlight the selected stars
            stars.forEach(s => s.classList.remove("active"));
            for (let i = 0; i < rating; i++) {
                stars[i].classList.add("active");
            }

            // Show thank you message
            thankYouMsg.style.display = "block";

            // Send the rating to the backend
            try {
                await fetch("/submit-rating", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ rating })
                });
            } catch (error) {
                console.error("Error submitting rating:", error);
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const states = [
        { name: "Andhra Pradesh", url: "/states/andhra" },
        { name: "Arunachal Pradesh", url: "/states/arunachal" },
        { name: "Assam", url: "/states/assam" },
        { name: "Bihar", url: "/states/bihar" },
        { name: "Chhattisgarh", url: "/states/chhattisgarh" },
        { name: "Goa", url: "/states/goa" },
        { name: "Gujarat", url: "/states/gujarat" },
        { name: "Haryana", url: "/states/haryana" },
        { name: "Himachal Pradesh", url: "/states/himachal" },
        { name: "Jharkhand", url: "/states/jharkhand" },
        { name: "Karnataka", url: "/states/karnataka" },
        { name: "Kerala", url: "/states/kerala" },
        { name: "Madhya Pradesh", url: "/states/madhya" },
        { name: "Maharashtra", url: "/states/maharashtra" },
        { name: "Manipur", url: "/states/manipur" },
        { name: "Meghalaya", url: "/states/meghalaya" },
        { name: "Mizoram", url: "/states/mizoram" },
        { name: "Nagaland", url: "/states/nagaland" },
        { name: "Odisha", url: "/states/odisha" },
        { name: "Punjab", url: "/states/punjab" },
        { name: "Rajasthan", url: "/states/rajasthan" },
        { name: "Sikkim", url: "/states/sikkim" },
        { name: "Tamil Nadu", url: "/states/tamilnadu" },
        { name: "Telangana", url: "/states/telangana" },
        { name: "Tripura", url: "/states/tripura" },
        { name: "Uttar Pradesh", url: "/states/uttarpradesh" },
        { name: "Uttarakhand", url: "/states/uttarakhand" },
        { name: "West Bengal", url: "/states/westbengal" }
    ];
    const cities = [
        {name: "Mumbai", url: "/cities/mumbai"},
        {name: "Delhi", url: "/cities/delhi"},
        {name: "Bangalore", url: "/cities/bangalore"},
        {name: "Hyderabad", url: "/cities/hyderabad"},
        {name: "Chennai", url: "/cities/chennai"},
        {name: "Kolkata", url: "/cities/kolkata"},
        {name: "Pune", url: "/cities/pune"},
        {name: "Jaipur", url: "/cities/jaipur"},
        {name: "Ahmedabad", url: "/cities/ahmedabad"},
        {name: "Surat", url: "/cities/surat"},
        {name: "Lucknow", url: "/cities/lucknow"},
        {name: "Kochi", url: "/cities/kochi"},
    ]

    const all = [
        { name: "Andhra Pradesh", url: "/states/andhra" },
        { name: "Arunachal Pradesh", url: "/states/arunachal" },
        { name: "Assam", url: "/states/assam" },
        { name: "Bihar", url: "/states/bihar" },
        { name: "Chhattisgarh", url: "/states/chhattisgarh" },
        { name: "Goa", url: "/states/goa" },
        { name: "Gujarat", url: "/states/gujarat" },
        { name: "Haryana", url: "/states/haryana" },
        { name: "Himachal Pradesh", url: "/states/himachal" },
        { name: "Jharkhand", url: "/states/jharkhand" },
        { name: "Karnataka", url: "/states/karnataka" },
        { name: "Kerala", url: "/states/kerala" },
        { name: "Madhya Pradesh", url: "/states/madhya" },
        { name: "Maharashtra", url: "/states/maharashtra" },
        { name: "Manipur", url: "/states/manipur" },
        { name: "Meghalaya", url: "/states/meghalaya" },
        { name: "Mizoram", url: "/states/mizoram" },
        { name: "Nagaland", url: "/states/nagaland" },
        { name: "Odisha", url: "/states/odisha" },
        { name: "Punjab", url: "/states/punjab" },
        { name: "Rajasthan", url: "/states/rajasthan" },
        { name: "Sikkim", url: "/states/sikkim" },
        { name: "Tamil Nadu", url: "/states/tamilnadu" },
        { name: "Telangana", url: "/states/telangana" },
        { name: "Tripura", url: "/states/tripura" },
        { name: "Uttar Pradesh", url: "/states/uttarpradesh" },
        { name: "Uttarakhand", url: "/states/uttarakhand" },
        { name: "West Bengal", url: "/states/westbengal" },
        {name: "Mumbai", url: "/cities/mumbai"},
        {name: "Delhi", url: "/cities/delhi"},
        {name: "Bangalore", url: "/cities/bangalore"},
        {name: "Hyderabad", url: "/cities/hyderabad"},
        {name: "Chennai", url: "/cities/chennai"},
        {name: "Kolkata", url: "/cities/kolkata"},
        {name: "Pune", url: "/cities/pune"},
        {name: "Jaipur", url: "/cities/jaipur"},
        {name: "Ahmedabad", url: "/cities/ahmedabad"},
        {name: "Surat", url: "/cities/surat"},
        {name: "Lucknow", url: "/cities/lucknow"},
        {name: "Kochi", url: "/cities/kochi"},
    ]

    document.getElementById("randomStateImage").addEventListener("click", () => {
        const randomState = states[Math.floor(Math.random() * states.length)];
        window.location.href = randomState.url;
    });

    document.getElementById("randomCityImage").addEventListener("click", () => {
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        window.location.href = randomCity.url;
    });

    document.getElementById("randomImage").addEventListener("click", () => {
        const randomAll = all[Math.floor(Math.random() * all.length)];
        window.location.href = randomAll.url;
    });
});

const music = document.getElementById("bg-music");
const playPauseBtn = document.getElementById("play-pause-btn");
const muteBtn = document.getElementById("mute-btn");
const volumeSlider = document.getElementById("volume-slider");
const songNameDisplay = document.getElementById("song-name");

// 🎵 List of songs
const songs = [
    { name: "-India Waale-", src: "/audio/song1.mp3" },
    { name: "-Maa Tujhe Salaam-", src: "/audio/song2.mp3" },
    { name: "-Saare Jahan Se Accha-", src: "/audio/song3.mp3" },
    { name: "-Teri Mitti-", src: "/audio/song4.mp3" }
];

let currentSongIndex = parseInt(localStorage.getItem("songIndex")) || 0;

// Function to play a song
function playSong(index) {
    if (index >= songs.length) index = 0;

    console.log("Playing:", songs[index].name); // Debugging

    currentSongIndex = index;
    music.src = songs[currentSongIndex].src;
    songNameDisplay.textContent = "Now Playing: " + songs[currentSongIndex].name;
    
    // Load only if changing songs to prevent unnecessary reloads
    if (!music.paused) music.load();
    
    music.play();
    playPauseBtn.textContent = "⏸ Pause";
    localStorage.setItem("songIndex", currentSongIndex);
}

// ✅ Restore song progress & play state on page load
document.addEventListener("DOMContentLoaded", () => {
    music.volume = localStorage.getItem("musicVolume") || 0.5;
    volumeSlider.value = music.volume;

    // Load saved song
    playSong(currentSongIndex);

    if (localStorage.getItem("musicTime")) {
        music.currentTime = parseFloat(localStorage.getItem("musicTime"));
    }
    if (localStorage.getItem("isPlaying") === "true") {
        music.play();
    } else {
        music.pause();
        playPauseBtn.textContent = "🔊 Play";
    }
});

// ✅ Auto-play next song when the current one ends
music.addEventListener("ended", () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
});

// Play/Pause button functionality
playPauseBtn.addEventListener("click", () => {
    if (music.paused) {
        music.play();
        playPauseBtn.textContent = "⏸ Pause";
        localStorage.setItem("isPlaying", "true");
    } else {
        music.pause();
        playPauseBtn.textContent = "🔊 Play";
        localStorage.setItem("isPlaying", "false");
    }
});

// Mute/Unmute button functionality
muteBtn.addEventListener("click", () => {
    music.muted = !music.muted;
    muteBtn.textContent = music.muted ? "🔊 Unmute" : "🔇 Mute";
    localStorage.setItem("isMuted", music.muted);
});

// Volume control
volumeSlider.addEventListener("input", () => {
    music.volume = volumeSlider.value;
    localStorage.setItem("musicVolume", music.volume);
});

// ✅ Save music progress & play state every second
setInterval(() => {
    localStorage.setItem("musicTime", music.currentTime);
    localStorage.setItem("isPlaying", !music.paused);
}, 1000);


