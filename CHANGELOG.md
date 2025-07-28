# Changelog

Tất cả các thay đổi đáng chú ý của dự án này sẽ được ghi lại trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
và dự án này tuân theo [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 🐳 Docker support với multi-stage build
- 🔄 GitHub Actions CI/CD pipeline
- 📦 Tự động build và push Docker images
- 🚀 GitHub Pages deployment
- 🔍 Security scanning với Trivy
- 📊 Automated testing pipeline
- 🛠 Makefile cho Docker operations
- 📝 Vietnamese documentation

### Changed
- 🔧 Cập nhật package.json với Docker scripts
- 📋 Cải thiện README với hướng dẫn Docker
- ⚡ Tối ưu Git performance settings

### Technical
- **Docker**: Multi-stage build với Node 20 Alpine và Nginx
- **CI/CD**: GitHub Actions với security scan và multi-platform builds
- **Registry**: GitHub Container Registry (ghcr.io)
- **Deployment**: Tự động deploy lên GitHub Pages
- **Performance**: Git preload index, fsmonitor, untracked cache

## [0.1.0] - 2025-01-28

### Added
- 🎨 Modern Angular 18 workflow builder application
- 🌓 Dark/Light theme support với system preference detection
- 🔧 Node-based workflow system với drag & drop
- 📱 Responsive design cho desktop và tablet
- 🎯 Component architecture với standalone components
- 💾 LocalStorage persistence cho settings
- 🔄 RxJS signals cho reactive state management

### Features
- **Header**: Modern gradient design với theme toggle
- **Sidebar**: Collapsible node toolbox với categorization
- **Canvas**: Grid-based workflow canvas với zoom controls
- **Nodes**: Draggable workflow nodes với connection system
- **Editor**: Modal-based node property editor
- **Themes**: Smooth dark/light mode transitions

### Technical
- **Framework**: Angular 18 với strict TypeScript
- **Styling**: Custom CSS với BEM methodology
- **State**: RxJS signals và services
- **Build**: Angular CLI với optimization
- **Code Quality**: ESLint, Prettier, strict type checking
