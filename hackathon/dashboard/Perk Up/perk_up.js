document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".imageButton").forEach(button => {
        button.addEventListener("click", function() {
            window.location.href = this.dataset.url;
        });

        // Fun hover effect
        button.addEventListener("mouseover", function() {
            this.style.transform = "scale(1.15)";  // Slightly enlarge button
            this.style.transition = "transform 0.10s ease";
        });

        button.addEventListener("mouseout", function() {
            this.style.transform = "scale(1)";  // Reset to normal size
        });
    });
});
