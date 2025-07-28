# 🚀 Modern Workflow Builder

A sophisticated, modern workflow builder application built with Angular 18, featuring an intuitive drag-and-drop interface, dark/light mode support, and a comprehensive node-based workflow system.

![Workflow Builder](https://img.shields.io/badge/Angular-18-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![CSS3](https://img.shields.io/badge/CSS3-Modern-blue?style=for-the-badge&logo=css3)

## ✨ Features

### 🎨 **Modern UI/UX**
- **Responsive Design**: Optimized for desktop and tablet
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Modern Header**: Gradient design with intuitive action buttons
- **Collapsible Sidebar**: Space-efficient node toolbox

### 🔧 **Workflow Management**
- **Drag & Drop**: Intuitive node placement and workflow creation
- **Node Categories**: Organized templates (Data & API, Communication, Logic & Control)
- **Visual Canvas**: Grid-based workflow canvas with zoom controls
- **Node Editor**: Modal-based property editing

### 🛠 **Technical Excellence**
- **Angular 18**: Latest standalone components architecture
- **TypeScript Strict**: Full type safety and modern development
- **RxJS Signals**: Reactive state management
- **Custom CSS**: BEM methodology with CSS variables
- **Performance**: Optimized bundle size and lazy loading ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/workflow-builder.git
cd workflow-builder

# Install dependencies
npm install

# Start development server
npm start
```

### Building for Production
```bash
# Build the application
npm run build

# Serve the built application
cd dist/workflow-builder/browser
node -e "const http = require('http'); const fs = require('fs'); const path = require('path'); const server = http.createServer((req, res) => { let filePath = '.' + req.url; if (filePath === './') filePath = './index.html'; const extname = String(path.extname(filePath)).toLowerCase(); const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }; const contentType = mimeTypes[extname] || 'application/octet-stream'; fs.readFile(filePath, (error, content) => { if (error) { if(error.code == 'ENOENT') { res.writeHead(404); res.end('File not found'); } else { res.writeHead(500); res.end('Server error'); } } else { res.writeHead(200, { 'Content-Type': contentType }); res.end(content, 'utf-8'); } }); }); server.listen(4200, () => console.log('Server running at http://localhost:4200'));"
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── node-toolbox/          # Sidebar with node templates
│   │   ├── workflow-canvas/       # Main canvas area
│   │   ├── workflow-node/         # Individual workflow nodes
│   │   └── node-editor/           # Node property editor
│   ├── models/
│   │   └── workflow.models.ts     # Data models and interfaces
│   ├── services/
│   │   ├── workflow.service.ts    # Workflow state management
│   │   ├── theme.service.ts       # Dark/light mode handling
│   │   └── node-template.service.ts # Node templates provider
│   ├── app.ts                     # Main app component
│   ├── app.html                   # App template
│   └── app.scss                   # Global styles
└── styles.scss                    # Global stylesheet
```

## 🎯 Available Node Types

### 📊 Data & API
- **HTTP Request**: Make API calls
- **Database Query**: Execute database operations
- **JSON Parser**: Parse and manipulate JSON data
- **CSV Reader**: Read CSV files

### 📞 Communication
- **Email Sender**: Send email notifications
- **SMS Notification**: Send SMS messages
- **Slack Message**: Post to Slack channels
- **Webhook**: Trigger external webhooks

### 🔧 Logic & Control
- **Conditional**: IF/ELSE logic branches
- **Loop**: Iterate over data sets
- **Delay**: Add time delays
- **Transformer**: Transform data formats

## 🔧 Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Run linting

### Code Standards
- **TypeScript Strict Mode**: Enabled for type safety
- **Angular Style Guide**: Following official conventions
- **BEM CSS**: Block Element Modifier methodology
- **Reactive Programming**: RxJS observables and signals

## 🌟 Key Technologies

- **Angular 18**: Modern framework with standalone components
- **TypeScript 5.5**: Strict type checking and latest features
- **RxJS**: Reactive programming and state management
- **CSS Variables**: Modern styling with theme support
- **Angular Material**: Component library integration ready

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Project Link: [https://github.com/yourusername/workflow-builder](https://github.com/yourusername/workflow-builder)

---

⭐ **Star this project if you find it helpful!**

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
