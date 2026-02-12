# PokéAPI E2E Testing Suite

![Cypress](https://img.shields.io/badge/Cypress-17202C?style=flat&logo=cypress&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![Page Object Model](https://img.shields.io/badge/POM-Design_Pattern-blue)

A comprehensive end-to-end testing suite for the PokéAPI documentation website using Cypress with Page Object Model design pattern. This project demonstrates professional test automation patterns including navigation testing, search functionality validation, and responsive design verification.

**Application Under Test:** [pokeapi.co](https://pokeapi.co/)

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running Tests](#-running-tests)
- [Test Scenarios](#-test-scenarios)
- [Page Object Model](#-page-object-model)
- [Best Practices](#-best-practices-implemented)
- [Author](#-author)

## 🎯 Overview

This testing suite automates validation of the PokéAPI documentation website, covering homepage navigation, API documentation search, code examples verification, and responsive design across multiple viewports.

## ✨ Features

- ✅ **Page Object Model (POM)** - Clean separation of concerns
- ✅ **Data-Driven Testing** - JSON fixtures for test data
- ✅ **Advanced DOM Navigation** - .nextUntil() pattern for content location
- ✅ **Responsive Testing** - Mobile and tablet viewport validation
- ✅ **Stale Element Handling** - Re-query pattern for reliability
- ✅ **Conditional State Management** - Handles collapsed/expanded UI
- ✅ **Video Recording** - Automatic recording of test runs
- ✅ **Screenshot on Failure** - Easy debugging

## 📁 Project Structure
```
pokemon-web-cypress/
├── cypress/
│   ├── e2e/
│   │   ├── navigation.cy.js            # Navigation tests (7 tests)
│   │   ├── documentation.cy.js         # Search & validation (2 tests)
│   │   └── responsive.cy.js            # Responsive tests (3 tests)
│   ├── fixtures/
│   │   ├── navigationLinks.json        # Navigation test data
│   │   ├── expectedDocSections.json    # Documentation sections
│   │   └── criticalDocAnchors.json     # API endpoint data
│   ├── support/
│   │   ├── commands.js                 # Custom commands
│   │   └── e2e.js                      # Global config
│   ├── pages/
│   │   ├── NavigationPage.js           # Navigation POM
│   │   └── DocumentationPage.js        # Documentation POM
│   ├── videos/                         # Test recordings
│   └── screenshots/                    # Failure captures
├── cypress.config.js                   # Cypress configuration
├── package.json                        
├── .gitignore                          
└── README.md                           
```

## 🔧 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge)
```bash
# Verify installations
node --version
npm --version
```

## 📥 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/pokemon-web-cypress.git
cd pokemon-web-cypress
```

### 2. Install dependencies
```bash
npm install
```

## 🚀 Running Tests

### Interactive Mode (Recommended for development)
```bash
npm run cypress:open
```

Best for:
- Test development
- Debugging
- Visual inspection

### Headless Mode
```bash
# Run all tests
npm run cypress:run

# Run in specific browser
npm run test:chrome
npm run test:firefox
npm run test:edge
```

### Run Specific Test Suite
```bash
npm run test:navigation
npm run test:documentation
npm run test:responsive
```

## 🧪 Test Scenarios

### Navigation Test Suite (7 tests)

**Objective:** Validate homepage and documentation navigation

**Test Flow:**

1. **Homepage Verification** 🏠
   - Verify page title "PokéAPI"
   - Validate logo visibility
   - Check navigation links

2. **Documentation Access** 📚
   - Navigate from header
   - Verify URL redirect
   - Validate sections display

3. **Multi-Section Navigation** 🔗
   - Test About, Docs, GraphQL links
   - Verify URL changes
   - Data-driven approach

4. **Link Validation** ✅
   - Test multiple identical links
   - Re-query pattern for stability
   - Verify all links functional

5. **Documentation Structure** 📋
   - Validate critical sections
   - Check headers (10+ h2 elements)
   - Verify anchor links (15+)
   - Confirm code blocks exist

6. **Anchor Navigation** ⚓
   - Navigate to Pokemon, Berries, Moves
   - Verify URL anchors
   - Validate content display

**Total Validations:** 25+ assertions

### Documentation Test Suite (2 tests)

**Objective:** Search functionality and code example validation

**Test Flow:**

1. **API Explorer Search** 🔍
   - Enter search query "pokemon"
   - Verify results display
   - Expand JSON viewer
   - Validate JSON structure

2. **Code Examples** 💻
   - Navigate to endpoint section
   - Handle collapsed/expanded states
   - Parse JSON code
   - Verify data accuracy

**Total Validations:** 8+ assertions

### Responsive Test Suite (3 tests)

**Objective:** Validate responsive design

**Viewports Tested:**
- 📱 Mobile: 375x667 (iPhone SE)
- 📱 Tablet: 768x1024 (iPad)

**Test Flow:**

1. **Layout Validation** 📐
   - Set viewport size
   - Verify content visible
   - Check no horizontal overflow

2. **Navigation Accessibility** 🔗
   - Verify links accessible
   - Check important CTAs
   - Validate GitHub link

**Total Validations:** 10+ assertions

## 🏗️ Page Object Model

### Architecture
```
NavigationPage
├── Homepage verification methods
├── Navigation methods
└── Documentation validation methods

DocumentationPage
├── Search methods
└── Code example validation methods
```

### Example: NavigationPage.js
```javascript
class NavigationPage {
  elements = {
    headerLogo: () => cy.get('header').find('img'),
    docsV2Link: () => cy.get('[href="/docs/v2"]').first()
  }

  navigateToDocsFromHeader() {
    this.elements.docsV2Link().should('be.visible').click()
    cy.url().should('include', '/docs/v2')
  }
}
```

### Example: DocumentationPage.js
```javascript
class DocumentationPage {
  searchForEndpoint(query) {
    cy.get('#url-input').clear().type(query)
    cy.get('button[type="submit"]').click()
  }

  verifySearchResults(expectedResource) {
    cy.contains(`Resource for ${expectedResource}`).should('be.visible')
  }
}
```

## 🎯 Best Practices Implemented

### 1. Code Organization
- ✅ Page Object Model pattern
- ✅ DRY principle
- ✅ Separated test data in fixtures
- ✅ Reusable page methods

### 2. Test Reliability
- ✅ Re-query pattern for stale elements
- ✅ Explicit waits for animations
- ✅ Proper selector strategies
- ✅ Test isolation with beforeEach

### 3. Advanced Patterns
- ✅ .nextUntil() for DOM navigation
- ✅ Conditional state handling
- ✅ JSON parsing for validation
- ✅ Data-driven testing

### 4. Debugging
- ✅ Video recording
- ✅ Screenshots on failure
- ✅ Descriptive test names
- ✅ Console logging

### 5. Documentation
- ✅ Comprehensive JSDoc comments
- ✅ Clear method descriptions
- ✅ Professional code structure

## 👤 Author

**[Your Name]**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 📧 Contact

For questions or feedback: your.email@example.com

## 🔗 Related Projects

- [E-commerce Testing Suite](https://github.com/tyraelw/cypress-ecommerce-testing) - E2E testing with Cypress
- [API Testing Project](link) - REST API automation

---

⭐ If you find this project helpful, please consider giving it a star!