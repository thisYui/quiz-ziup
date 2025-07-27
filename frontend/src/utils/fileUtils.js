export async function encodeFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result; // dạng: "data:image/png;base64,iVBORw0KGgoAAA..."
            const [meta, base64Data] = result.split(',');
            const match = meta.match(/data:(.*);base64/);
            const type = match ? match[1] : 'application/octet-stream';

            resolve({
                data: base64Data, // 👈 phần bạn sẽ gửi lên Rails
                type: type        // 👈 để backend biết loại file
            });
        };

        reader.onerror = (err) => reject(err);

        reader.readAsDataURL(file); //
    });
}
