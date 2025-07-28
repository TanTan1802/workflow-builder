# 🚀 Công Cụ Xây Dựng Workflow Hiện Đại

Một ứng dụng xây dựng workflow hiện đại và tinh vi được phát triển với Angular 18, tích hợp giao diện kéo-thả trực quan, hỗ trợ chế độ sáng/tối và hệ thống workflow dựa trên node toàn diện.

![Workflow Builder](https://img.shields.io/badge/Angular-18-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![CSS3](https://img.shields.io/badge/CSS3-Modern-blue?style=for-the-badge&logo=css3)

## ✨ Tính Năng

### 🎨 **Giao Diện Người Dùng Hiện Đại**
- **Thiết Kế Responsive**: Tối ưu cho desktop và tablet
- **Chế Độ Sáng/Tối**: Chuyển đổi theme mượt mà với tự động phát hiện thiết lập hệ thống
- **Header Hiện Đại**: Thiết kế gradient với các nút hành động trực quan
- **Sidebar Thu Gọn**: Hộp công cụ node tiết kiệm không gian

### 🔧 **Quản Lý Workflow**
- **Kéo & Thả**: Đặt node và tạo workflow một cách trực quan
- **Phân Loại Node**: Template được tổ chức (Dữ liệu & API, Giao tiếp, Logic & Điều khiển)
- **Canvas Trực Quan**: Canvas workflow dạng lưới với điều khiển zoom
- **Trình Chỉnh Sửa Node**: Chỉnh sửa thuộc tính dạng modal

### 🛠 **Xuất Sắc Về Kỹ Thuật**
- **Angular 18**: Kiến trúc standalone components mới nhất
- **TypeScript Strict**: Đảm bảo type safety và phát triển hiện đại
- **RxJS Signals**: Quản lý state reactive
- **CSS Tùy Chỉnh**: Phương pháp BEM với CSS variables
- **Hiệu Năng**: Kích thước bundle tối ưu và sẵn sàng lazy loading

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu Hệ Thống
- Node.js 18+ 
- npm hoặc yarn

### Cài Đặt
```bash
# Clone repository
git clone https://github.com/TanTan1802/workflow-builder.git
cd workflow-builder

# Cài đặt dependencies
npm install

# Khởi động development server
npm start
```

### Xây Dựng Cho Production
```bash
# Build ứng dụng
npm run build

# Chạy ứng dụng đã build
cd dist/workflow-builder/browser
node -e "const http = require('http'); const fs = require('fs'); const path = require('path'); const server = http.createServer((req, res) => { let filePath = '.' + req.url; if (filePath === './') filePath = './index.html'; const extname = String(path.extname(filePath)).toLowerCase(); const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }; const contentType = mimeTypes[extname] || 'application/octet-stream'; fs.readFile(filePath, (error, content) => { if (error) { if(error.code == 'ENOENT') { res.writeHead(404); res.end('File not found'); } else { res.writeHead(500); res.end('Server error'); } } else { res.writeHead(200, { 'Content-Type': contentType }); res.end(content, 'utf-8'); } }); }); server.listen(4200, () => console.log('Server running at http://localhost:4200'));"
```

## 📁 Cấu Trúc Dự Án

```
src/
├── app/
│   ├── components/
│   │   ├── node-toolbox/          # Sidebar với node templates
│   │   ├── workflow-canvas/       # Khu vực canvas chính
│   │   ├── workflow-node/         # Các workflow node riêng lẻ
│   │   └── node-editor/           # Trình chỉnh sửa thuộc tính node
│   ├── models/
│   │   └── workflow.models.ts     # Data models và interfaces
│   ├── services/
│   │   ├── workflow.service.ts    # Quản lý state workflow
│   │   ├── theme.service.ts       # Xử lý chế độ sáng/tối
│   │   └── node-template.service.ts # Cung cấp node templates
│   ├── app.ts                     # Component ứng dụng chính
│   ├── app.html                   # Template ứng dụng
│   └── app.scss                   # Styles toàn cục
└── styles.scss                    # Stylesheet toàn cục
```

## 🎯 Các Loại Node Có Sẵn

### 📊 Dữ Liệu & API
- **HTTP Request**: Thực hiện API calls
- **Database Query**: Thực thi các thao tác database
- **JSON Parser**: Phân tích và thao tác dữ liệu JSON
- **CSV Reader**: Đọc file CSV

### 📞 Giao Tiếp
- **Email Sender**: Gửi thông báo email
- **SMS Notification**: Gửi tin nhắn SMS
- **Slack Message**: Đăng lên Slack channels
- **Webhook**: Kích hoạt webhook bên ngoài

### 🔧 Logic & Điều Khiển
- **Conditional**: Nhánh logic IF/ELSE
- **Loop**: Lặp qua tập dữ liệu
- **Delay**: Thêm độ trễ thời gian
- **Transformer**: Chuyển đổi định dạng dữ liệu

## 🔧 Phát Triển

### Các Scripts Có Sẵn
- `npm start` - Khởi động development server
- `npm run build` - Build cho production
- `npm run test` - Chạy unit tests
- `npm run lint` - Chạy linting

### Tiêu Chuẩn Code
- **TypeScript Strict Mode**: Bật để đảm bảo type safety
- **Angular Style Guide**: Tuân theo quy ước chính thức
- **BEM CSS**: Phương pháp Block Element Modifier
- **Reactive Programming**: RxJS observables và signals

## 🌟 Công Nghệ Chính

- **Angular 18**: Framework hiện đại với standalone components
- **TypeScript 5.5**: Kiểm tra type nghiêm ngặt và tính năng mới nhất
- **RxJS**: Lập trình reactive và quản lý state
- **CSS Variables**: Styling hiện đại với hỗ trợ theme
- **Angular Material**: Sẵn sàng tích hợp thư viện component

## 📝 Giấy Phép

Dự án này được cấp phép theo MIT License - xem file [LICENSE](LICENSE) để biết chi tiết.

## 🤝 Đóng Góp

1. Fork dự án
2. Tạo feature branch của bạn (`git checkout -b feature/TinhNangTuyetVoi`)
3. Commit các thay đổi (`git commit -m 'Thêm tính năng tuyệt vời'`)
4. Push lên branch (`git push origin feature/TinhNangTuyetVoi`)
5. Mở Pull Request

## 📧 Liên Hệ

Link dự án: [https://github.com/TanTan1802/workflow-builder](https://github.com/TanTan1802/workflow-builder)

## 🧪 Kiểm Thử

### Unit Tests
```bash
ng test
```

### End-to-End Tests
```bash
ng e2e
```

## 🚀 Triển Khai

### Build Cho Production
```bash
npm run build
```

### Phục Vụ File Tĩnh
Sau khi build, bạn có thể phục vụ các file tĩnh bằng bất kỳ web server nào:
```bash
# Sử dụng Node.js
cd dist/workflow-builder/browser
node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{let filePath='.'+(req.url==='/'?'/index.html':req.url);fs.readFile(filePath,(err,content)=>{if(err){res.writeHead(404);res.end('Not found');}else{res.writeHead(200,{'Content-Type':({'html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(filePath)]||'application/octet-stream'});res.end(content);}});}).listen(4200,()=>console.log('Server: http://localhost:4200'));"

# Sử dụng Python
python -m http.server 4200

# Sử dụng live-server
npx live-server dist/workflow-builder/browser --port=4200
```

## 📊 Hiệu Năng

- **Kích Thước Bundle**: ~421KB (đã tối ưu)
- **Thời Gian Tải**: <2s trên trình duyệt hiện đại
- **Điểm Lighthouse**: 90+ (Hiệu năng, Khả năng tiếp cận, Thực hành tốt nhất)

---

⭐ **Hãy star dự án này nếu bạn thấy hữu ích!**
