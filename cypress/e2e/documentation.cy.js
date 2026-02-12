/// <reference types="cypress" />
import NavigationPage from '../pages/NavigationPage'
import DocumentationPage from '../pages/DocumentationPage'

/**
 * PokéAPI Documentation Features Test Suite
 * 
 * Test Coverage:
 * - API Explorer search functionality
 * - JSON response validation and expansion
 * - Code example verification in documentation
 * - Endpoint documentation accuracy
 * 
 * Features:
 * - Page Object Model pattern for maintainability
 * - Conditional handling of collapsed/expanded UI states
 * - Advanced DOM navigation with .nextUntil() pattern
 * - JSON parsing and validation
 */
describe('PokéAPI - Documentation Features', () => {

    const navigationPage = new NavigationPage()
    const documentationPage = new DocumentationPage()

    beforeEach(() => {
        // Clear all browser storage to ensure test isolation
        cy.clearAllCookies()
        cy.clearLocalStorage()
        cy.window().then((win) => {
            win.sessionStorage.clear()
        })

        // Visit homepage and configure timeout
        cy.visit('https://pokeapi.co/')
        cy.url().should('include', 'https://pokeapi.co/')
        Cypress.config('defaultCommandTimeout', 8000)
    })

    // ========== SEARCH FUNCTIONALITY ==========

    /**
     * Test: API Explorer search functionality
     * 
     * Validates:
     * - Search input accepts query terms
     * - Submit button triggers search
     * - Results display resource name
     * - JSON viewer can be expanded
     * - Expanded JSON contains expected fields (name, url)
     * 
     * Technical details:
     * - Uses API Explorer feature on homepage
     * - Expands collapsed JSON with expand button (▶)
     * - Validates JSON structure without full parsing
     */
    it('should search for specific endpoints and display valid JSON response', () => {
        // Execute search for pokemon endpoint
        documentationPage.searchForEndpoint('pokemon')
        
        // Verify search results message appears
        documentationPage.verifySearchResults('pokemon')
        
        // Expand JSON results viewer
        documentationPage.expandJsonResults()
        
        // Validate JSON contains expected fields
        documentationPage.validateJsonContent(['name', 'url'])
    })

    // ========== CODE EXAMPLES VALIDATION ==========

    /**
     * Test: Endpoint code examples are accurate and legible
     * 
     * Validates:
     * - Navigation to specific endpoint section (Generations)
     * - Code example viewer is present
     * - JSON can be expanded if collapsed
     * - Parsed JSON matches expected structure
     * - 'name' field contains correct value ('generation-i')
     * 
     * Technical details:
     * - Uses .nextUntil() pattern to locate content between headers
     * - Handles both collapsed and expanded JSON viewer states
     * - Clicks "View raw JSON" checkbox if needed
     * - Parses JSON to validate data accuracy
     */
    it('should verify code example for generation endpoint is accurate', () => {
        // Navigate to Games section - Generations endpoint
        documentationPage.navigateToEndpointSection('#games-section', 'generations')
        
        // Verify code example matches expected data
        documentationPage.verifyEndpointCodeExample('generations', 'generation-i')
    })

})