async function showMessage(title, message, buttonText) {
    await Capacitor.Plugins.Dialog.alert({
        title: title,
        message: message,
    });
}

async function getJSONPref(key) {
  try {
    const { value } = await Capacitor.Plugins.Preferences.get({ key });
    return JSON.parse(value || '[]');
  } catch (err) {
    console.error(`Failed to load or parse ${key}:`, err);
    return [];
  }
}

function getStorageKeyFromType(type) {
  switch (type) {
    case 0: return 'CreditCards';
    case 1: return 'DebitCards';
    case 2: return 'Netbankings';
    case 3: return 'Logins';
    case 4: return 'Reminders';
    default: return null;
  }
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
