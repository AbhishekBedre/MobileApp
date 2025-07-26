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
//console.log(getReminderOccurrences("2025-01-01", "2025-06-30", "2025-07-20", "monthly"));
// Daily 
//console.log(getReminderOccurrences("2025-01-01", "2025-01-05", null, "daily"));
// Weekly 
//console.log(getReminderOccurrences("2025-01-01", "2025-01-29", null, "weekly"));

function getReminderOccurrences(startDateStr, endDateStr, reminderDate, repeatType) {
  const reminderDay = (new Date(reminderDate)).getDate();
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const results = [];

  let current = new Date(startDate);

  while (current <= endDate) {
    const year = current.getFullYear();
    const month = current.getMonth();
    const day = current.getDate();

    let occurrence = null;

    switch (repeatType) {
      case "1":
        occurrence = new Date(current);
        current.setDate(current.getDate() + 1); // Next day
        break;

      case "2":
        occurrence = new Date(current);
        current.setDate(current.getDate() + 7); // Next week
        break;

      case "3":
        // Handle reminderDay fallback (e.g., 31 → 30/28)
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        const validDay = Math.min(reminderDay, lastDayOfMonth);
        occurrence = new Date(year, month, validDay);
        current.setMonth(current.getMonth() + 1); // Next month
        break;

      case "4":
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
      const formatted =
        occurrence.getFullYear() + "-" +
        String(occurrence.getMonth() + 1).padStart(2, "0") + "-" +
        String(occurrence.getDate()).padStart(2, "0");
      results.push(formatted);
    }
  }

  return results;
}

async function setReminder(title, message, scheduleDateTime, extra) {
    await Capacitor.Plugins.LocalNotifications.schedule({
    notifications: [
      {
        title: title,
        body: message,
        id: Math.floor(Date.now() % 1000000000),
        schedule: { 
          at: scheduleDateTime,
        },
        extra: extra,
        ongoing: true
      },
    ],
  });

} 

async function getScheduledNotifications() {
  const result = await Capacitor.Plugins.LocalNotifications.getPending();
  console.log("getScheduledNotifications: " + result?.length);
  return result;
}

//cancelScheduledNotifications([{id: 1}, {id: 2}])
async function cancelScheduledNotifications(notificationIds) {
  await Capacitor.Plugins.LocalNotifications.cancel({
    notifications: notificationIds
  });
  console.log("cancelScheduledNotifications: " + JSON.stringify(notificationIds));
}

function formatCardNumber(cardNumber) {
  // Remove all non-digit characters first
  const cleaned = cardNumber.replace(/\D/g, '');

  // Insert space after every 4 digits
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
}

function maskLastSixChars(input) {
  if (input.length <= 6) {
    return '*'.repeat(input.length); // mask all if string is 6 or less
  }

  const visiblePart = input.slice(0, -6);
  const maskedPart = '*'.repeat(6);
  return visiblePart + maskedPart;
}

async function exportData() {

  var cardData = [];

  const [creditCardValues, debitCardValues, netbankingsValues, loginsValues, reminderValues] = await Promise.all([
    getJSONPref("CreditCards"),
    getJSONPref("DebitCards"),
    getJSONPref("Netbankings"),
    getJSONPref("Logins"),
    getJSONPref("Reminders"),
  ]);

  creditCardValues?.data?.length > 0 ? cardData.push(...creditCardValues.data) : '';
  debitCardValues?.data?.length > 0 ? cardData.push(...debitCardValues.data) : '';
  netbankingsValues?.data?.length > 0 ? cardData.push(...netbankingsValues.data) : '';
  loginsValues?.data?.length > 0 ? cardData.push(...loginsValues.data) : '';
  reminderValues?.data?.length > 0 ? cardData.push(...reminderValues.data) : '';

  await writeBackupFile(cardData);
}

async function writeBackupFile(dataArray) {
  try {
    // Convert array to JSON string
    const jsonData = JSON.stringify(dataArray, null, 2);

    // Define path and file options
    const filePath = 'VaultBackup/backup.json';

    await Capacitor.Plugins.Filesystem.writeFile({
      path: filePath,
      data: jsonData,
      directory: 'Documents', // Public documents folder
      recursive: true // Ensures folders like VaultBackup are created if not present
    });

    await showMessage('BINGO !!!!', '✅ Backup completed successfully! \n\nThe backup file has been saved as plain text (unsecured JSON format). \n\n⚠️ Warning: This file contains sensitive data and is not encrypted. Do NOT store it permanently on your device, as it can be easily accessed and misused by others. \n\nFor your safety, transfer it to a secure location and delete it from your phone immediately if not needed.');

  } catch (error) {
    await showMessage('Backup Failed', error.message);
  }
}
