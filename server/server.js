const express = require('express');
const path = require('path');
const os = require('os');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// phục vụ React build
app.use(express.static(path.join(__dirname, '../frontend', 'build')));

// proxy /api sang Rails API tại port 3000
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true
}));

// Lấy địa chỉ ip private của máy tính
function getPrivateIP() {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const privateIP = getPrivateIP();

// fallback cho React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html'));
});

app.listen(80, () => {
    console.log(`App chạy tại http://${privateIP}:80`);
});
