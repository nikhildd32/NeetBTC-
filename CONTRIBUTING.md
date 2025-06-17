# Contributing to NeetBTC

Thank you for your interest in contributing to NeetBTC! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/yourusername/neetbtc.git
cd neetbtc
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Create a new branch for your feature**
```bash
git checkout -b feature/your-feature-name
```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting (Prettier configuration)
- Use semantic HTML and ARIA attributes for accessibility
- Implement responsive design with Tailwind CSS
- Add proper error handling and loading states

### Component Guidelines
- Create reusable components in `src/components/ui/`
- Use proper TypeScript interfaces for props
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Add loading skeletons for better UX
- Use Framer Motion for animations consistently

### Commit Messages
Use conventional commit format:
```
feat: add new fee estimation algorithm
fix: resolve mempool data loading issue
docs: update API documentation
style: improve button hover animations
refactor: optimize news aggregator performance
test: add unit tests for fee calculator
```

### Testing
- Test your changes across different screen sizes
- Verify keyboard navigation works properly
- Check accessibility with screen readers
- Test error scenarios and edge cases

## 🎯 Areas for Contribution

### High Priority
- **Performance optimizations** - Reduce bundle size, improve loading times
- **Accessibility improvements** - Better screen reader support, keyboard navigation
- **Mobile experience** - Touch gestures, mobile-specific optimizations
- **Error handling** - More robust error boundaries and fallbacks

### Medium Priority
- **New features** - Additional Bitcoin tools and utilities
- **UI/UX improvements** - Better animations, micro-interactions
- **Data visualization** - Charts, graphs, and interactive elements
- **Internationalization** - Multi-language support

### Low Priority
- **Documentation** - Code comments, API documentation
- **Testing** - Unit tests, integration tests
- **DevOps** - CI/CD improvements, deployment optimizations

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Browser and device information**
5. **Screenshots or videos** if applicable
6. **Console errors** if any

Use this template:
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120.0
- Device: Desktop/Mobile
- OS: Windows 11/macOS/Linux
```

## 💡 Feature Requests

For new features, please:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** you're trying to solve
3. **Propose a solution** with implementation details
4. **Consider alternatives** and explain why your approach is best
5. **Think about edge cases** and potential issues

## 🔍 Code Review Process

1. **Submit a Pull Request** with clear description
2. **Link related issues** using keywords (fixes #123)
3. **Add screenshots** for UI changes
4. **Ensure CI passes** (linting, building)
5. **Respond to feedback** promptly and professionally

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested keyboard navigation
- [ ] Tested with screen reader

## Screenshots
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

## 🏆 Recognition

Contributors will be:
- **Listed in README** - All contributors get recognition
- **Mentioned in releases** - Significant contributions highlighted
- **Invited to discussions** - Input on project direction
- **Given credit** - Proper attribution for contributions

## 📞 Getting Help

- **GitHub Discussions** - For questions and ideas
- **GitHub Issues** - For bugs and feature requests
- **Code Comments** - For implementation questions

## 🎉 Thank You!

Every contribution, no matter how small, helps make NeetBTC better for the Bitcoin community. Thank you for your time and effort!

---

**Happy coding! 🚀**