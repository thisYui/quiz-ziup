import CryptoJS from "crypto-js";

const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;

export function decryptFromServer(encryptedString) {
    const rawData = CryptoJS.enc.Base64.parse(encryptedString);

    // Tách IV (16 bytes đầu) và encryptedData
    const iv = CryptoJS.lib.WordArray.create(rawData.words.slice(0, 4)); // 4 words = 16 bytes
    const encryptedData = CryptoJS.lib.WordArray.create(rawData.words.slice(4));

    const key = CryptoJS.SHA256(secretKey);

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedData },
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(plaintext);
}
