# 🚀 NeetBTC - Real-time Bitcoin Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **All-in-one Bitcoin dashboard with real-time mempool data, smart fee estimation, and latest Bitcoin news**

![NeetBTC Dashboard](https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop)

## ✨ Features

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

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom animations
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Data Sources**: Mempool.space API

## 📱 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `H` | Go to Home |
| `M` | Go to Mempool |
| `F` | Go to Fee Estimator |
| `N` | Go to News |
| `/` | Focus Search |
| `R` | Refresh Page |
| `?` | Show all shortcuts |
| `ESC` | Close modals/escape |

## 🎨 Design Philosophy

NeetBTC follows modern design principles:

- **Apple-level aesthetics** - Clean, sophisticated, and intuitive
- **Micro-interactions** - Thoughtful animations and hover states
- **Accessibility-first** - WCAG compliant with keyboard navigation
- **Performance-focused** - Optimized loading and smooth animations
- **Mobile-responsive** - Perfect experience across all devices

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

### Key Components

- **Header** - Navigation with search and shortcuts
- **MempoolTracker** - Real-time mempool visualization
- **FeeEstimator** - Smart fee calculation engine
- **NewsAggregator** - Live Bitcoin news feed
- **ErrorBoundary** - Graceful error handling
- **LoadingSkeleton** - Performance-optimized loading states

### API Integration

The app integrates with:
- **Mempool.space API** - Real-time Bitcoin network data
- **Custom News API** - Aggregated Bitcoin news sources

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mempool.space** - For providing excellent Bitcoin network APIs
- **Bitcoin Community** - For inspiration and feedback
- **Open Source Contributors** - For making this project possible

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/neetbtc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/neetbtc/discussions)
- **Twitter**: [@neetbtc](https://twitter.com/neetbtc)

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ for the Bitcoin community**

*NeetBTC is an open-source project dedicated to making Bitcoin data more accessible and user-friendly for everyone.*