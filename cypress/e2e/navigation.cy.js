/// <reference types="cypress" />
import NavigationPage from '../pages/NavigationPage'

/**
 * PokéAPI Homepage and Navigation Test Suite
 * 
 * Test Coverage:
 * - Homepage loading and branding verification
 * - Navigation between main site sections (About, Docs, GraphQL)
 * - Documentation accessibility and structure validation
 * - Anchor link navigation within documentation
 * 
 * Features:
 * - Page Object Model pattern for maintainability
 * - Data-driven testing using fixtures
 * - Stale element handling with re-query pattern
 */
describe('PokéAPI - Homepage and Navigation', () => {

    const navigationPage = new NavigationPage()

    beforeEach(() => {
        // Clear all browser storage to ensure test isolation
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.window().then((win) => {
            win.sessionStorage.clear()
        })

        // Visit homepage and verify successful load
        cy.visit('https://pokeapi.co/')
        cy.url().should('include', 'https://pokeapi.co/')
        Cypress.config('defaultCommandTimeout', 8000)
    })

    /**
     * Test: Homepage loads with correct branding elements
     * 
     * Validates:
     * - Page title displays "PokéAPI"
     * - Header logo is visible
     * - Main logo is visible
     * - PokéAPI branded logos are present (2 instances)
     */
    it('should load homepage with correct title and logos', () => {
        navigationPage.verifyPageTitle('PokéAPI')
        navigationPage.verifyLogosVisible()
    })

    /**
     * Test: Navigation to documentation from header
     * 
     * Validates:
     * - Header documentation link is visible and clickable
     * - Navigation redirects to /docs/v2 endpoint
     */
    it('should navigate to API documentation from header', () => {
        navigationPage.navigateToDocsFromHeader()
    })

    /**
     * Test: Multi-section navigation using data-driven approach
     * 
     * Validates:
     * - Navigation to About, Docs, and GraphQL sections
     * - URL updates correctly for each section
     * - Uses fixture data for scalable testing
     */
    it('should navigate between main sections correctly', () => {
        cy.fixture('navigationLinks').then((data) => {
            navigationPage.verifyNavigationLinks(data.mainNavigationLinks)
        })
    })

    /**
     * Test: All documentation links functional
     * 
     * Validates:
     * - Multiple links with same href all work correctly
     * - Uses re-query pattern to avoid stale element references
     * - At least 3 documentation links exist on homepage
     */
    it('should verify all documentation links redirect correctly', () => {
        navigationPage.verifyAllDocsLinksWork()
    })

    /**
     * Test: Documentation sections display correctly
     * 
     * Validates:
     * - Critical API sections are visible (Pokémon, Berries, Evolution, etc.)
     * - Multiple section headers exist (10+ h2 elements)
     * - Anchor navigation links present (15+ anchor links)
     * - Code examples exist in documentation
     */
    it('should display documentation sections after navigating to docs', () => {
        navigationPage.navigateToDocsFromHeader()
        navigationPage.verifyDocumentationSectionsVisible()
    })

    /**
     * Test: Navigation to critical documentation sections
     * 
     * Validates:
     * - Direct navigation to specific API endpoint sections
     * - URL anchor updates correctly
     * - Section content displays as expected
     * - Uses data-driven approach with fixture
     */
    it('should navigate to critical documentation sections correctly', () => {
        navigationPage.navigateToDocsFromHeader()
        
        cy.fixture('criticalDocAnchors').then((data) => {
            navigationPage.verifyNavigationToCriticalSections(data.criticalAnchors)
        })
    })

    /**
     * Test: All anchor links exist and have valid targets
     * 
     * Validates:
     * - All anchor links on documentation page exist
     * - Each anchor has a corresponding section in DOM
     * - Efficient validation without clicking every link
     * - Typical count: 20+ unique anchor links
     */
    it('should verify all anchor links have valid section targets', () => {
        navigationPage.navigateToDocsFromHeader()
        navigationPage.verifyAllAnchorLinksExist()
    })

})