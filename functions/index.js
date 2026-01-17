const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const ADMIN_KEY = functions.config().app?.admin_key || "YOUR_ADMIN_KEY_HERE";

function verifyAdmin(key) {
    if (key !== ADMIN_KEY) {
        throw new functions.https.HttpsError("permission-denied", "운영자 키가 일치하지 않습니다.");
    }
}

exports.confirmSchedule = functions.https.onCall(async (data, context) => {
    verifyAdmin(data.key);
    const { scheduleId } = data;
    
    await db.collection("schedules").doc(scheduleId).update({
        status: "CONFIRMED",
        confirmedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
});

exports.updateSchedule = functions.https.onCall(async (data, context) => {
    verifyAdmin(data.key);
    const { scheduleId, payload } = data;
    
    await db.collection("schedules").doc(scheduleId).update({
        ...payload,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
});

exports.deleteSchedule = functions.https.onCall(async (data, context) => {
    verifyAdmin(data.key);
    const { scheduleId } = data;
    
    await db.collection("schedules").doc(scheduleId).delete();
    
    return { success: true };
});

exports.deleteLog = functions.https.onCall(async (data, context) => {
    verifyAdmin(data.key);
    const { logId } = data;
    
    await db.collection("applications_log").doc(logId).delete();
    
    return { success: true };
});

exports.pinPost = functions.https.onCall(async (data, context) => {
    verifyAdmin(data.key);
    const { postId, isPinned } = data;
    
    await db.collection("board_posts").doc(postId).update({
        pinned: isPinned,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
});

exports.deletePost = functions.https.onCall(async (data, context) => {
    verifyAdmin(data.key);
    const { postId } = data;
    
    await db.collection("board_posts").doc(postId).delete();
    
    return { success: true };
});
