document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("bg-video");
    const volumeSlider = document.getElementById("volume-slider");
    const sliderFill = document.querySelector(".slider-fill");
    const sliderThumb = document.querySelector(".slider-thumb");
    const volumeIcons = document.querySelectorAll(".volume-icon");

    // Modal Elements
    const modal = document.getElementById("info-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalInfo = document.getElementById("modal-info");
    const closeModal = document.querySelector(".close");

    // Set initial volume
    let currentVolume = 0.38; // 38% volume
    video.volume = currentVolume;

    // Update volume display
    const updateVolumeDisplay = (value) => {
        const percentage = Math.round(value * 100);
        sliderFill.style.width = `${percentage}%`;
        sliderThumb.style.left = `${percentage}%`;
    };

    // Ensure the video is muted initially (required for autoplay on mobile)
    video.muted = true;

    // Ensure video doesn't play until user interaction on mobile
    const enableAudio = () => {
        if (video.paused) {
            video.play().then(() => {
                video.muted = false; // Unmute after user interaction
                video.volume = currentVolume; // Set volume to the current level
                updateVolumeDisplay(currentVolume); // Update volume slider
            }).catch((err) => {
                console.warn("Autoplay failed:", err); // Log if autoplay failed
            });
        }
        document.removeEventListener("click", enableAudio); // Prevent it from triggering again
        document.removeEventListener("touchstart", enableAudio); // Prevent it from triggering again
    };

    // Listen for user interaction (click or touch) to play video and unmute
    document.addEventListener("click", enableAudio); // For clicks on the page
    document.addEventListener("touchstart", enableAudio); // For mobile touch events

    // Volume slider control
    volumeSlider.addEventListener("input", () => {
        currentVolume = volumeSlider.value;
        video.volume = currentVolume;
        if (video.muted) video.muted = false;
        updateVolumeDisplay(currentVolume);
    });

    // Mute and Max Volume buttons
    volumeIcons[0].addEventListener("click", () => {
        video.volume = 0;
        volumeSlider.value = 0;
        currentVolume = 0;
        updateVolumeDisplay(0);
    });

    volumeIcons[1].addEventListener("click", () => {
        video.volume = 1;
        volumeSlider.value = 1;
        currentVolume = 1;
        updateVolumeDisplay(1);
    });

    // Show modal when clicking on milestone
    document.querySelectorAll(".milestone").forEach((milestone) => {
        milestone.addEventListener("click", () => {
            const date = milestone.getAttribute("data-date");
            const info = milestone.getAttribute("data-info");

            modalTitle.textContent = `📅 ${date}`;
            modalInfo.textContent = info;

            modal.style.display = "flex";
        });
    });

    // Close modal when clicking the close button
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal on outside click
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Initialize display
    updateVolumeDisplay(currentVolume);
});
