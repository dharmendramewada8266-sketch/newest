function startVoiceInput(inputId) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'hi-IN';

    recognition.start();

    recognition.onresult = function(event) {
        document.getElementById(inputId).value = event.results[0][0].transcript;
    };
}
document.getElementById("workerPhoto").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const preview = document.getElementById("photoPreview");
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});
function setLanguage(lang) {
    if (lang === "hi") {
        document.getElementById("worker-title").innerText = "मजदूर पंजीकरण";
        document.getElementById("worker-subtitle").innerText = "काम पाने के लिए अपनी जानकारी भरें";
        document.body.classList.add("hindi");
    } else {
        document.getElementById("worker-title").innerText = "Worker Registration";
        document.getElementById("worker-subtitle").innerText = "Complete your profile to start getting work";
        document.body.classList.remove("hindi");
    }
}