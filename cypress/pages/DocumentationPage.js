/**
 * DocumentationPage - Page Object Model for PokéAPI documentation features
 * 
 * Responsibilities:
 * - API Explorer search functionality
 * - JSON response validation
 * - Code example verification in endpoint documentation
 * - Handling collapsed/expanded UI states
 * 
 * Design Patterns:
 * - Page Object Model (POM) for maintainability
 * - Conditional state handling for UI flexibility
 * - Advanced DOM navigation with .nextUntil()
 * 
 * Key Features:
 * - Supports both collapsed and expanded JSON viewers
 * - Efficient content location between documentation headers
 * - JSON parsing for data validation
 * 
 * @class DocumentationPage
 */
class DocumentationPage {

    // ========== LOCATORS ==========
    elements = {
        // Search/API Explorer elements
        searchInput: () => cy.get('#url-input'),
        searchButton: () => cy.get('button[type="submit"]'),
        
        // Search results elements
        resultsMessage: (resource) => cy.contains(`Resource for ${resource}`),
        resultsExpandButton: () => cy.contains('results:').parent().find('div').contains('▶'),
        jsonViewer: () => cy.contains('h2', 'Resource for').parent().find('ul'),
        
        // Code example elements
        jsonViewerContainer: () => cy.get('.JsonViewer-module__json--2OTYy'),
        rawJsonCheckbox: () => cy.contains('label', 'View raw JSON').find('input'),
        preCodeBlock: () => cy.get('pre code')
    }

    // ========== API EXPLORER SEARCH METHODS ==========

    /**
     * Search for a specific endpoint using the API Explorer
     * Clears any existing input and types new query
     * @param {string} query - Search term (e.g., 'pokemon', 'berry')
     */
    searchForEndpoint(query) {
        this.elements.searchInput().clear().type(query)
        this.elements.searchButton().click()
    }

    /**
     * Verify search results display expected resource
     * Checks for "Resource for {resource}" message
     * @param {string} expectedResource - Expected resource name to appear in results
     */
    verifySearchResults(expectedResource) {
        this.elements.resultsMessage(expectedResource).should('be.visible')
    }

    /**
     * Expand the JSON results viewer in API Explorer
     * Clicks the expand arrow (▶) to reveal full JSON structure
     * Includes wait for expansion animation to complete
     */
    expandJsonResults() {
        this.elements.resultsExpandButton().click()
        cy.wait(300) // Wait for expansion animation
    }

    /**
     * Validate JSON viewer contains expected fields
     * Verifies expanded JSON includes all specified fields
     * @param {Array<string>} expectedFields - Array of field names that should exist (e.g., ['name', 'url'])
     */
    validateJsonContent(expectedFields) {
        this.elements.jsonViewer().then($jsonViewer => {
            const jsonText = $jsonViewer.text()
            
            // Ensure JSON is not empty
            expect(jsonText.trim()).to.not.be.empty
            
            // Verify each expected field is present
            expectedFields.forEach(field => {
                expect(jsonText).to.include(field)
            })
            
            cy.log('✅ JSON content validated')
        })
    }

    // ========== ENDPOINT DOCUMENTATION METHODS ==========

    /**
     * Navigate to a specific endpoint section in documentation
     * Uses direct URL navigation with anchor for reliability
     * @param {string} sectionAnchor - Section anchor link (e.g., '#games-section', '#pokemon')
     * @param {string} endpointId - Endpoint heading ID (e.g., 'generations', 'pokedexes')
     */
    navigateToEndpointSection(sectionAnchor, endpointId) {
        cy.visit(`https://pokeapi.co/docs/v2${sectionAnchor}`)
        cy.get(`#${endpointId}`).should('be.visible')
        cy.get(`#${endpointId}`).scrollIntoView()
        cy.wait(500) // Wait for scroll animation
    }

    /**
     * Get JSON code from endpoint documentation section
     * 
     * Handles both UI states:
     * 1. Expanded state: JSON already visible in <pre><code>
     * 2. Collapsed state: Clicks "View raw JSON" checkbox to expand
     * 
     * Technical approach:
     * - Uses .nextUntil() to find content between current heading and next heading
     * - Checks if <pre><code> already exists (expanded)
     * - If collapsed, clicks checkbox and waits for expansion
     * - Returns Cypress chainable with JSON text
     * 
     * @param {string} endpointId - Endpoint heading ID
     * @returns {Cypress.Chainable<string>} Chainable with JSON text content
     */
    getEndpointJsonCode(endpointId) {
        return cy.get(`#${endpointId}`)
            .nextUntil('h3, h4')  // Get all siblings until next heading
            .find('.JsonViewer-module__json--2OTYy')
            .then($div => {
                // Check if code is already expanded
                const $pre = $div.find('pre code')

                if ($pre.length > 0) {
                    // State 1: Already expanded - return text directly
                    return cy.wrap($pre).invoke('text')
                } else {
                    // State 2: Collapsed - need to expand first
                    cy.get(`#${endpointId}`)
                        .nextUntil('h3, h4')
                        .contains('label', 'View raw JSON')
                        .find('input')
                        .click({ force: true })
                        .wait(200)  // Wait for expansion

                    // Now return the expanded code
                    return cy.get(`#${endpointId}`)
                        .nextUntil('h3, h4')
                        .find('pre code')
                        .invoke('text')
                }
            })
    }

    /**
     * Verify endpoint code example matches expected data
     * Retrieves JSON code, parses it, and validates 'name' field
     * 
     * @param {string} endpointId - Endpoint heading ID
     * @param {string} expectedName - Expected value of 'name' field in JSON response
     */
    verifyEndpointCodeExample(endpointId, expectedName) {
        this.getEndpointJsonCode(endpointId).then(jsonText => {
            const data = JSON.parse(jsonText)
            expect(data.name).to.equal(expectedName)
            cy.log(`✅ ${endpointId} code example validated`)
        })
    }

}

export default DocumentationPage