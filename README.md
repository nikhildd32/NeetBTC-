# 🚀 NeetBTC - Real-time Bitcoin Dashboard

> **All-in-one Bitcoin dashboard with real-time mempool data, smart fee estimation, and latest Bitcoin news**

## Features

### 🔄 Real-time Mempool Tracker
- Live unconfirmed transaction monitoring
- Interactive block visualization
- Historical mempool data comparison
- Transaction search functionality

### ⚡ Smart Fee Estimator
- Real-time fee recommendations
- Multiple priority levels (Priority, Standard, Economic, Low)
- Cost calculations in BTC, USD, and satoshis
- Network congestion analysis

### 📰 Bitcoin News Aggregator
- Live news from trusted Bitcoin sources
- Bitcoin-focused content filtering
- Real-time updates every hour
- Clean, readable article cards

### 🎯 Additional Features
- **Keyboard Shortcuts** - Navigate quickly with hotkeys (press `?` to see all)
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Accessibility** - Screen reader support and keyboard navigation
- **Performance** - Loading skeletons and optimized animations
- **Error Handling** - Graceful error boundaries and fallbacks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/neetbtc.git
cd neetbtc

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app in action!



### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles
```

### Security

- All sensitive data is stored in environment variables
- API keys and secrets are never committed to the repository
- Security headers are implemented for protection against common web vulnerabilities
- Input validation and sanitization are implemented throughout the application
- Error handling is implemented to prevent information leakage
- CORS policies are properly configured

For more information, see our [Security Policy](SECURITY.md).

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Ensure accessibility compliance
- Maintain responsive design
- Follow security best practices
- Update documentation as needed

For more details, see our [Contributing Guidelines](CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Mempool.space** - For providing excellent Bitcoin network APIs
- **Bitcoin Community** - For inspiration and feedback
- **Open Source Contributors** - For making this project possible

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/neetbtc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/neetbtc/discussions)
- **Security**: [Security Policy](SECURITY.md)

*NeetBTC is an open-source project dedicated to making Bitcoin data more accessible and user-friendly for everyone.*
