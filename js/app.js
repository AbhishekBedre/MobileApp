async function showMessage(title, message, buttonText) {
    await Capacitor.Plugins.Dialog.alert({
        title: title,
        message: message,
    });
}

function goBack() {
    window.history.back();      
}

function logout(path) {
    sessionStorage.clear();
    window.location.href = path;
}

function showLoader() {
  document.getElementById('loaderOverlay').classList.add('show');
}

function hideLoader() {
  document.getElementById('loaderOverlay').classList.remove('show');
}
