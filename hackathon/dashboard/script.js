document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".imageButton").forEach(button => {
        button.addEventListener("click", function() {
            window.location.href = this.dataset.url;
        });
    });
});


function openNewPage() {
    const config = {
        loginUrl: "login/index.html"
    };

    window.location.href = config.loginUrl;
}