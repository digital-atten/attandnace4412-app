import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- FAST2SMS + WHATSAPP ENGINE ---
const FAST2SMS_API_KEY = "0VrvUafCoG75A8mgyPjSKxnDeIhtbNYXMBucWTOw9iz42lJdFLDbfCkPe1TRGpEt9Vxa0wyzrNKIJ6d2";

async function sendSMS(phone, message) {
    try {
        await fetch("https://www.fast2sms.com/dev/bulkV2", {
            method: "POST",
            headers: {
                "authorization": FAST2SMS_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                route: "q",
                message: message,
                language: "english",
                numbers: phone
            })
        });
    } catch (err) {
        console.error("SMS Error:", err);
    }
}

function sendWhatsApp(phone, message) {
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

// Local state runtime storage for dynamic feature rendering across pages
let studentsState = {
    1: { name: "Abhishek Kumar Soren", phone: "9876543210", lectures: 18, percentage: 18.75 }
};

let dailyTracking = { present: 0, absent: 0 };

// --- 1. SIGN IN AUTHORITY ENGINE ---
window.login = () => {
    const id = document.getElementById("user-id").value.trim();
    const pass = document.getElementById("user-pass").value;

    if (id === "teacher1" && pass === "mgm123") {
        document.getElementById("login-page").style.display = "none";
        document.getElementById("main-app").style.display = "block";
        alert("Authorized Access. Welcome Professor PRADIP GUDDE!");
    } else {
        alert("Invalid Access Control Credentials! Try (teacher1 / mgm123)");
    }
};

// --- 2. MULTI-PANEL TAB SWITCHER VIEW ENGINE ---
window.showPage = (pageId) => {
    document.querySelectorAll('.content-page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));

    document.getElementById(pageId).classList.add('active');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
};

// --- 3. DYNAMIC ADD STUDENT + MOBILE REGISTRATION ENGINE ---
window.addStudent = async() => {
    const sName = document.getElementById('s-name').value.trim();
    const sRoll = document.getElementById('s-roll').value.trim();
    const sPhone = document.getElementById('s-phone').value.trim();

    if (!sName || !sRoll || !sPhone) {
        alert("Bhai, Name, Roll No aur Parent Phone Number daalna zaroori hai!");
        return;
    }

    try {
        await addDoc(collection(db, "students"), {
            name: sName,
            roll: parseInt(sRoll),
            parent_phone: sPhone,
            timestamp: new Date().toISOString()
        });

        studentsState[sRoll] = { name: sName, phone: sPhone, lectures: 0, percentage: 100.00 };

        const tbody = document.getElementById("attendance-tbody");
        tbody.innerHTML += `
            <tr id="row-${sRoll}">
                <td>${sRoll}</td>
                <td>${sName}</td>
                <td class="pct-cell" id="pct-${sRoll}">100.00 %</td>
                <td id="lect-${sRoll}">0</td>
                <td>
                    <button class="btn-action present" onclick="markAttendance(${sRoll}, '${sName}', 'Present')">⚙️ Present</button>
                    <button class="btn-action absent" onclick="markAttendance(${sRoll}, '${sName}', 'Absent')">➖ Absent</button>
                </td>
            </tr>
        `;

        alert(`Success: ${sName} added!`);

    } catch (err) {
        console.error(err);
        alert("Error saving student");
    }
};

// --- 4. MARK ATTENDANCE ---
window.markAttendance = (roll, name, state) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const student = studentsState[roll] || { phone: "9999999999" };

    if (state === 'Present') {
        dailyTracking.present += 1;
        alert(`${name} is PRESENT`);
    } else {
        dailyTracking.absent += 1;
        alert(`${name} is ABSENT`);
    }

    // ✅ NEW FEATURE ADDED (SMS + WHATSAPP)
    const msg = `Student ${name} (Roll ${roll}) is ${state} at ${time}`;
    sendSMS(student.phone, msg);
    sendWhatsApp(student.phone, msg);

    updateDailyYieldStats();
};

// --- 5. STATS ---
const updateDailyYieldStats = () => {
    const total = Object.keys(studentsState).length;
    document.getElementById("yield-total").innerText = total;
    document.getElementById("yield-p").innerText = dailyTracking.present;
    document.getElementById("yield-a").innerText = dailyTracking.absent;

    const yieldPct = total > 0 ? ((dailyTracking.present / total) * 100).toFixed(2) : "0.00";
    document.getElementById("yield-pct").innerText = `${yieldPct}%`;
};