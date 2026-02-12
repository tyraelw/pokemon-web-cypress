/// <reference types="cypress" />

/**
 * PokéAPI Responsive Design Test Suite
 * 
 * Test Coverage:
 * - Mobile viewport compatibility (375px width)
 * - Tablet viewport compatibility (768px width)
 * - Content overflow prevention
 * - Navigation accessibility across devices
 * 
 * Viewports Tested:
 * - Mobile: 375x667 (iPhone SE, common mobile size)
 * - Tablet: 768x1024 (iPad, common tablet size)
 * 
 * Features:
 * - Viewport configuration with cy.viewport()
 * - Horizontal scroll detection
 * - Responsive navigation validation
 * - Layout stability verification
 */
describe('PokéAPI - Responsive Design', { baseUrl: 'https://pokeapi.co' }, () => {

    beforeEach(() => {
        // Visit homepage with extended timeout for slower connections
        cy.visit('/', { timeout: 15000 })
        cy.url().should('include', 'pokeapi.co')
    })

    // Define viewport configurations
    const viewports = [
        { name: 'mobile', width: 375, height: 667 },
        { name: 'tablet', width: 768, height: 1024 }
    ]

    // ========== VIEWPORT COMPATIBILITY TESTS ==========

    /**
     * Test: Layout and overflow prevention on different viewports
     * 
     * Validates for each viewport:
     * - Main content loads and is visible
     * - Primary branding elements display correctly
     * - No horizontal overflow (scrollWidth <= viewport width)
     * 
     * Technical details:
     * - Sets viewport size before loading page
     * - Allows layout stabilization time (400ms)
     * - Checks document scrollWidth against window innerWidth
     * - Allows 10px tolerance for sub-pixel rendering
     */
    viewports.forEach(vp => {
        it(`should display correctly without overflow on ${vp.name} (${vp.width}px)`, () => {
            // Set viewport size
            cy.viewport(vp.width, vp.height)
            cy.wait(400) // Allow layout to stabilize

            // Verify primary branding is visible
            cy.contains('PokéAPI').should('be.visible')

            // Verify subtitle/tagline is visible
            cy.contains('The RESTful Pokémon API').should('be.visible')

            // Verify no horizontal overflow
            cy.window().then(win => {
                const doc = win.document.documentElement
                expect(doc.scrollWidth, 'No horizontal overflow should exist')
                    .to.be.lte(win.innerWidth + 10)  // 10px tolerance for sub-pixel rendering
            })
        })
    })

    // ========== NAVIGATION ACCESSIBILITY TEST ==========

    /**
     * Test: Important navigation links visible on mobile
     * 
     * Validates:
     * - Primary call-to-action button visible ("Try it now")
     * - Documentation version link visible ("v2")
     * - External links accessible (GitHub)
     * 
     * Note: Tests actual links present on PokéAPI homepage
     * Adjust link text if site content changes
     */
    it('should display important navigation links on mobile (375px)', () => {
        // Set mobile viewport
        cy.viewport(375, 667)

        // Verify primary action button
        cy.contains('Try it now').should('be.visible')
        
        // Verify documentation version link
        cy.contains('v2').should('be.visible')
        
        // Verify external repository link
        cy.get('a[href*="github.com"]').should('be.visible')
    })

})