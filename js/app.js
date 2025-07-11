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

// Monthly reminder on 31st, fallback to 30/28 if needed
//console.log(getReminderOccurrences("2025-01-01", "2025-06-30", 31, "monthly"));
// Daily 
//console.log(getReminderOccurrences("2025-01-01", "2025-01-05", null, "daily"));
// Weekly 
//console.log(getReminderOccurrences("2025-01-01", "2025-01-29", null, "weekly"));

function getReminderOccurrences(startDateStr, endDateStr, reminderDay, repeatType) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const results = [];

  let current = new Date(startDate);

  while (current <= endDate) {
    const year = current.getFullYear();
    const month = current.getMonth();
    const day = current.getDate();

    let occurrence = null;

    switch (repeatType.toLowerCase()) {
      case "daily":
        occurrence = new Date(current);
        current.setDate(current.getDate() + 1); // Next day
        break;

      case "weekly":
        occurrence = new Date(current);
        current.setDate(current.getDate() + 7); // Next week
        break;

      case "monthly":
        // Handle reminderDay fallback (e.g., 31 → 30/28)
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        const validDay = Math.min(reminderDay, lastDayOfMonth);
        occurrence = new Date(year, month, validDay);
        current.setMonth(current.getMonth() + 1); // Next month
        break;

      case "yearly":
        // Use reminderDay and current month
        const lastDayOfThisMonth = new Date(year, month + 1, 0).getDate();
        const validYearlyDay = Math.min(reminderDay, lastDayOfThisMonth);
        occurrence = new Date(year, month, validYearlyDay);
        current.setFullYear(current.getFullYear() + 1); // Next year
        break;

      default:
        console.warn("Unsupported repeat type:", repeatType);
        return [];
    }

    if (occurrence >= startDate && occurrence <= endDate) {
      results.push(occurrence.toISOString().split("T")[0]);
    }
  }

  return results;
}

