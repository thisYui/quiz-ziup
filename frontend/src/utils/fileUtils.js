export async function encodeFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result; // "data:image/png;base64,..."
            const [meta, base64Data] = result.split(',');
            const match = meta.match(/data:(.*);base64/);
            const fullType = match ? match[1] : 'application/octet-stream';
            const extension = fullType.split('/')[1];

            resolve({
                data: base64Data,
                type: extension
            });
        };

        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}
