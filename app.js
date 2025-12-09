// ====== 開始 & 結束 ======
document.getElementById("startBtn").onclick = () => {
    document.getElementById("startTime").textContent = new Date().toLocaleString();
};

document.getElementById("endBtn").onclick = () => {
    document.getElementById("endTime").textContent = new Date().toLocaleString();
};

// ====== 取得欄位 ======
function getFormData() {
    return {
        user: localStorage.getItem("user") || "",
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

// ====== 發送上架資料 ======
async function sendData() {
    let data = getFormData();

    let res = await fetch(WRITE_API, {
        method: "POST",
        body: JSON.stringify({ contents: data })
    });

    let json = await res.json();

    if (json.ok) {
        document.getElementById("msg").textContent = "上架成功!";
    } else {
        document.getElementById("msg").textContent = "上架失敗!";
    }
}
