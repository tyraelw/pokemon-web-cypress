/**
 * NavigationPage - Page Object Model for PokéAPI homepage and navigation
 * 
 * Responsibilities:
 * - Homepage element verification (logos, titles)
 * - Main site navigation (About, Docs, GraphQL)
 * - Documentation section navigation
 * - Anchor link validation
 * 
 * Design Patterns:
 * - Page Object Model (POM) for maintainability
 * - Element locators separated from test logic
 * - Reusable methods with clear single responsibilities
 * 
 * @class NavigationPage
 */
class NavigationPage {


    // ========== LOCATORS ==========
    elements = {
        // Logo elements
        headerLogo: () => cy.get('header').find('img'),
        mainLogo: () => cy.get('main').find('img'),
        pokeApiLogos: () => cy.get('img[alt="PokéAPI"]'),

        // Main navigation links
        aboutLink: () => cy.get('[href="/about"]'),
        docsV2Link: () => cy.get('[href="/docs/v2"]').first(),  // Use .first() to avoid multiple element click errors
        docsV2HeaderLink: () => cy.get('header').find('a[href="/docs/v2"]'),
        graphqlDocsLink: () => cy.get('[href="/docs/graphql"]'),
        allDocsLinks: () => cy.get('a[href="/docs/v2"]')  // For testing all doc links on page
    }

    // ========== HOMEPAGE VERIFICATION METHODS ==========

    /**
     * Verify the page title matches expected value
     * @param {string} expectedTitle - Expected page title
     */
    verifyPageTitle(expectedTitle) {
        cy.title().should('eq', expectedTitle)
    }

    /**
     * Verify that all logo elements are visible on the page
     * Checks both header and main logos, plus PokéAPI specific logos
     */
    verifyLogosVisible() {
        this.elements.headerLogo().should('be.visible')
        this.elements.mainLogo().should('be.visible')
        this.elements.pokeApiLogos().should('have.length', 2).and('be.visible')
    }

    // ========== NAVIGATION METHODS ==========

    /**
     * Navigate to API documentation from header link
     * Verifies successful navigation by checking URL
     */
    navigateToDocsFromHeader() {
        this.elements.docsV2HeaderLink().should('be.visible').click()
        cy.url().should('include', '/docs/v2')
    }

    /**
     * Click on a navigation link by key name
     * @param {string} linkName - Key identifier for the link ('about', 'docs', 'graphql')
     */
    clickNavigationLink(linkName) {
        const linkMap = {
            'about': this.elements.aboutLink,
            'docs': this.elements.docsV2Link,
            'graphql': this.elements.graphqlDocsLink
        }

        linkMap[linkName]().should('be.visible').click()
    }

    /**
     * Verify URL contains expected path
     * @param {string} expectedPath - Path that should be in the URL
     */
    verifyUrlContains(expectedPath) {
        cy.url().should('include', expectedPath)
    }

    /**
     * Data-driven navigation test across multiple links
     * Iterates through fixture data to test multiple navigation paths
     * @param {Array} linksData - Array of link objects from fixture
     */
    verifyNavigationLinks(linksData) {
        linksData.forEach(link => {
            cy.log(`Testing navigation to: ${link.name}`)

            // Navigate to the link
            this.clickNavigationLink(link.linkKey)

            // Verify URL changed correctly
            this.verifyUrlContains(link.expectedUrl)
        })
    }

    /**
     * Verify all documentation links on the page redirect correctly
     * Uses loop with re-query pattern to avoid stale element references
     * Tests that multiple links with same href all function properly
     */
    verifyAllDocsLinksWork() {
        // Get initial count of all documentation links
        this.elements.allDocsLinks().should('have.length.at.least', 3).then($links => {
            const linkCount = $links.length

            // Test each link individually by index
            for (let i = 0; i < linkCount; i++) {
                // Re-query on each iteration to get fresh element reference
                cy.get('a[href="/docs/v2"]').eq(i).click()
                cy.url().should('include', '/docs/v2')
                cy.go('back')

                // Wait for page reload to complete before next iteration
                cy.url().should('include', 'pokeapi.co')
            }
        })
    }

    // ========== DOCUMENTATION VALIDATION METHODS ==========

    /**
     * Verify documentation page structure and critical sections
     * Uses data-driven approach with fixture for section validation
     * Confirms presence of technical content (code blocks, headers, navigation)
     */
    verifyDocumentationSectionsVisible() {
        // Confirm we're on the documentation page
        cy.url().should('include', '/docs/v2')

        // Verify critical sections exist using fixture data
        cy.fixture('expectedDocSections').then(data => {
            cy.log(`Verifying ${data.criticalSections.length} critical sections`)

            data.criticalSections.forEach(section => {
                cy.contains(section).should('be.visible')
            })
        })

        // Verify overall documentation structure
        cy.get('h2').should('have.length.at.least', 10)  // Multiple section headers
        cy.get('a[href^="#"]').should('have.length.at.least', 15)  // Anchor navigation links
        cy.get('code, pre').should('exist')  // Technical code examples present

        cy.log('✅ All documentation sections verified')
    }
    // ========== DOCUMENTATION SECTION NAVIGATION ==========

    /**
     * Navigate to a specific documentation section using anchor link
     * Uses direct URL navigation to avoid hidden TOC issues
     * @param {string} anchor - Anchor identifier (e.g., '#pokemon')
     */
    navigateToDocSection(anchor) {
        // Navigate directly to the section via URL
        cy.visit(`https://pokeapi.co/docs/v2${anchor}`)
    }

    /**
     * Verify that a specific section is displayed after navigation
     * @param {string} anchor - Anchor identifier to verify in URL
     * @param {string} expectedContent - Content that should be visible in section
     */
    verifySectionDisplayed(anchor, expectedContent) {
        // Verify URL contains the anchor
        cy.url().should('include', anchor)

        // Verify section content is visible
        cy.contains(expectedContent).should('be.visible')
    }

    /**
     * Test navigation to critical documentation sections using fixture data
     * Data-driven approach for testing key API sections
     * @param {Array} anchorsData - Array of anchor objects from fixture
     */
    verifyNavigationToCriticalSections(anchorsData) {
        anchorsData.forEach(section => {
            cy.log(`Testing navigation to: ${section.name}`)

            // Click on the section anchor link
            this.navigateToDocSection(section.anchor)

            // Verify section loaded correctly
            this.verifySectionDisplayed(section.anchor, section.expectedContent)
        })
    }

    /**
     * Verify all anchor links exist on documentation page
     * Does not click each one, only validates their presence
     * Efficient way to ensure documentation structure is complete
     */
    verifyAllAnchorLinksExist() {
        // Get all anchor links on the page
        cy.get('a[href^="#"]').then($links => {
            const anchors = []

            // Extract unique anchors
            $links.each((index, link) => {
                const href = link.getAttribute('href')
                if (href && href !== '#' && !anchors.includes(href)) {
                    anchors.push(href)
                }
            })

            cy.log(`Found ${anchors.length} unique anchor links`)

            // Verify each anchor has a corresponding section
            anchors.forEach(anchor => {
                cy.get(anchor).should('exist')
            })
        })
    }
}

export default NavigationPage