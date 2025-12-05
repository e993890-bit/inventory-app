// ========== 開始 & 結束 ==============
document.getElementById("startBtn").onclick = () => {
    document.getElementById("startTime").textContent = new Date().toLocaleString();
};

document.getElementById("endBtn").onclick = () => {
    document.getElementById("endTime").textContent = new Date().toLocaleString();
};

// ========== 取得欄位值 ==============
function getFormData() {
    return {
        barcode: document.getElementById("barcode").value,
        location: document.getElementById("location").value,
        putQty: document.getElementById("putQty").value,
        recvQty: document.getElementById("recvQty").value,
        expiry: document.getElementById("expiry").value,
        lotNo: document.getElementById("lotNo").value,
        putDate: document.getElementById("putDate").value,
        timestamp: new Date().toLocaleString()
    };
}
// ========== 送出資料到 Google Sheet ==========
let user = localStorage.getItem("user") || "未登入";

async function sendData() {

    let data = {
        user: user,
        barcode: document.getElementById("barcode").value,
        location: document.getElementById("location").value,
        putQty: document.getElementById("putQty").value,
        recvQty: document.getElementById("recvQty").value,
        expiry: document.getElementById("expiry").value,
        lotNo: document.getElementById("lotNo").value,
        putDate: document.getElementById("putDate").value
    };

    let res = await fetch(WRITE_API, {
        method: "POST",
        body: JSON.stringify(data)
    });

    let json = await res.json();

    if (json.ok) {
        alert("✅ 上架資料已成功寫入 Google Sheet！");
    } else {
        alert("❌ 寫入失敗，請稍後再試");
    }
}

// ========== 上傳 Google Sheet ============
document.getElementById("uploadBtn").onclick = async () => {
    const data = getFormData();

    const res = await fetch(SHEET_API_URL, {
        method: "POST",
        body: JSON.stringify(data)
    });

    alert("已寫入 Google Sheet！");
};

// ========== 下載 Excel（本地離線也能用） ============
document.getElementById("excelBtn").onclick = () => {
    const data = [getFormData()];

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "上架紀錄");

    const filename = `上架_${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, filename);
};

// ========== 條碼掃描功能 =============
const video = document.getElementById("scanner");
document.getElementById("scanBtn").onclick = async () => {
    video.style.display = "block";
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    video.play();
    scanLoop();
};

function scanLoop() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    function tick() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(img.data, canvas.width, canvas.height);

            if (code) {
                document.getElementById("barcode").value = code.data;
                stopCamera();
                return;
            }
        }
        requestAnimationFrame(tick);
    }
    tick();
}

function stopCamera() {
    const stream = video.srcObject;
    if (stream) stream.getTracks().forEach(t => t.stop());
    video.style.display = "none";
}

