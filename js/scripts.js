document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("bg-video");
    const volumeSlider = document.getElementById("volume-slider");
    const sliderFill = document.querySelector(".slider-fill");
    const sliderThumb = document.querySelector(".slider-thumb");
    const volumeIcons = document.querySelectorAll(".volume-icon");
    // set initial volume
    let currentVolume = 0.5; // 50% volume
    video.volume = currentVolume;
    // update volume display
    const updateVolumeDisplay = (value) => {
        const percentage = Math.round(value * 100);
        sliderFill.style.width = `${percentage}%`;
        sliderThumb.style.left = `${percentage}%`;
    };
    // enable audio on user interaction
    const enableAudio = () => {
        if (video.muted) {
            video.muted = false; // unmute
            video.volume = currentVolume;
            updateVolumeDisplay(currentVolume);
        }
        document.removeEventListener("click", enableAudio);
    };
    document.addEventListener("click", enableAudio);
    // volume slider control
    volumeSlider.addEventListener("input", () => {
        currentVolume = volumeSlider.value;
        video.volume = currentVolume;
        if (video.muted) video.muted = false;
        updateVolumeDisplay(currentVolume);
    });
    // mute and max volume buttons
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
    // update display
    updateVolumeDisplay(currentVolume);
});

document.addEventListener("DOMContentLoaded", () => {
    const commentForm = document.getElementById("comment-form");
    const commentInput = document.getElementById("comment-input");
    const commentsContainer = document.getElementById("comments-display");
    // Function to create a new comment
    function createComment(commentText) {
        const comment = document.createElement("div");
        comment.classList.add("comment");
        comment.innerHTML = `<p>${commentText}</p>`;
        commentsContainer.appendChild(comment);
    }
    // Handle comment form submission
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent page reload
        const commentText = commentInput.value.trim();
        if (commentText) {
            createComment(commentText);
            commentInput.value = ""; // Clear input field
        }
    });
});