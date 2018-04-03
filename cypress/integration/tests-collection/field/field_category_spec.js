context('create category-type fields tests', function(){
  beforeEach(() => {
    cy.loginByUI()
  })

  it('clear DB', function(){
    cy.clearDB()
  })

  it('create collection for create fields', function(){
    cy.visit('/wp-admin/admin.php?page=tainacan_admin#/collections')
    cy.get('h1').should('contain', 'Collections Page')
    cy.contains('New Collection').click()
    cy.get('#tainacan-text-name').type('Book Fields')
    cy.get('#tainacan-text-description').type('Descrição book Fields')
    cy.get('#tainacan-select-status').select('Publish').should('have.value', 'publish')
    cy.get('#button-submit-collection-creation').click()
    cy.get('#primary-menu > .menu > .menu-header > .menu-list > li > .router-link-active > .icon > .mdi').click()
    cy.get('.b-table').should('contain', 'Book Fields')
  })

  it('create taxonomies for create relationship', function(){
    cy.visit('/wp-admin/admin.php?page=tainacan_admin#/collections')
    cy.get('h1').should('contain', 'Collections Page')
    cy.get(':nth-child(8) > a > .menu-text').click()
    cy.get('.button').click()
    cy.get('#tainacan-text-name').type('Cat 1')
    cy.get('#tainacan-text-description').type('description cat 1')
    cy.get('#tainacan-select-status').select('Publish').should('have.value', 'publish')
    cy.get('#button-submit-category-creation').click()
    cy.get('.page-container').should('contain', 'Cat 1')
    cy.get('.button').click()
    cy.get('#tainacan-text-name').type('Cat 2')
    cy.get('#tainacan-text-description').type('description cat 2')
    cy.get('#tainacan-select-status').select('Publish').should('have.value', 'publish')
    cy.get('#button-submit-category-creation').click()
    cy.get('.page-container').should('contain', 'Cat 2')
    cy.get('.button').click()
    cy.get('#tainacan-text-name').type('Cat 3')
    cy.get('#tainacan-text-description').type('description cat 3')
    cy.get('#tainacan-select-status').select('Publish').should('have.value', 'publish')
    cy.get('#button-submit-category-creation').click()
    cy.get('.page-container').should('contain', 'Cat 3')
    cy.get('.button').click()
    cy.get('#tainacan-text-name').type('Cat 4')
    cy.get('#tainacan-text-description').type('description cat 4')
    cy.get('#tainacan-select-status').select('Publish').should('have.value', 'publish')
    cy.get('#button-submit-category-creation').click()
    cy.get('.page-container').should('contain', 'Cat 4')
    cy.get('.button').click()
    cy.get('#tainacan-text-name').type('Cat 5')
    cy.get('#tainacan-text-description').type('description cat 5')
    cy.get('#tainacan-select-status').select('Publish').should('have.value', 'publish')
    cy.get('#button-submit-category-creation').click()
    cy.get('.page-container').should('contain', 'Cat 5')
    cy.get('#tainacan-text-name').type('Cat 6')
    cy.get('#tainacan-text-description').type('description cat 6')
    cy.get('#tainacan-select-status').select('Publish').should('have.value', 'publish')
    cy.get('#button-submit-category-creation').click()
    cy.get('.page-container').should('contain', 'Cat 6')
  })

  it('canceled create category-type field public', function(){
    cy.visit('/wp-admin/admin.php?page=tainacan_admin#/collections')
    cy.get('h1').should('contain', 'Collections Page')
    cy.get('[data-label="Name"] > :nth-child(1) > .clickable-row').click()
    cy.get(':nth-child(4) > .router-link-active').should('contain', 'Items')
    cy.get('.menu > :nth-child(2) > :nth-child(5) > a').click()
    cy.get('h1').should('contain', 'Collection Fields Edition Page')
    cy.get('.field > :nth-child(2) > :nth-child(7)').click()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').clear()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').type('category name canceled')
    cy.get('.textarea').type('name book canceled description')
    cy.get('#tainacan-select-status-publish > .check').click()
    cy.get(':nth-child(1) > .button').click()
    cy.get('.active-fields-area >').should('not.contain', 'category name canceled')
  })

  it('create category-type field public - input type = radio', function(){
    cy.visit('/wp-admin/admin.php?page=tainacan_admin#/collections')
    cy.get('h1').should('contain', 'Collections Page')
    cy.get('[data-label="Name"] > :nth-child(1) > .clickable-row').click()
    cy.get(':nth-child(4) > .router-link-active').should('contain', 'Items')
    cy.get('.menu > :nth-child(2) > :nth-child(5) > a').click()
    cy.get('h1').should('contain', 'Collection Fields Edition Page')
    cy.get('.field > :nth-child(2) > :nth-child(7)').click()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').clear()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').type('category name public')
    cy.get('.textarea').type('name book description')
    cy.get('#tainacan-select-status-publish > .check').click()
    cy.get(':nth-child(1) > .control > .select > select').select('Cat 1')
    cy.get(':nth-child(2) > .control > .select > select').select('Radio').should('have.value', 'tainacan-category-radio')
    cy.get(':nth-child(2) > .button').click()
    cy.get('.active-fields-area >').should('contain', 'category name public')
  })

  it('create category-type field public - input type = selectbox', function(){
    cy.visit('/wp-admin/admin.php?page=tainacan_admin#/collections')
    cy.get('h1').should('contain', 'Collections Page')
    cy.get('[data-label="Name"] > :nth-child(1) > .clickable-row').click()
    cy.get(':nth-child(4) > .router-link-active').should('contain', 'Items')
    cy.get('.menu > :nth-child(2) > :nth-child(5) > a').click()
    cy.get('h1').should('contain', 'Collection Fields Edition Page')
    cy.get('.field > :nth-child(2) > :nth-child(7)').click()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').clear()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').type('category name public')
    cy.get('.textarea').type('name book description')
    cy.get('#tainacan-select-status-publish > .check').click()
    cy.get(':nth-child(1) > .control > .select > select').select('Cat 1')
    cy.get(':nth-child(2) > .control > .select > select').select('Selectbox').should('have.value', 'tainacan-category-selectbox')
    cy.get(':nth-child(2) > .button').click()
    cy.get('.active-fields-area >').should('contain', 'category name public')
  })

  it('create category-type field private', function(){
    cy.visit('/wp-admin/admin.php?page=tainacan_admin#/collections')
    cy.get('h1').should('contain', 'Collections Page')
    cy.get('[data-label="Name"] > :nth-child(1) > .clickable-row').click()
    cy.get(':nth-child(4) > .router-link-active').should('contain', 'Items')
    cy.get('.menu > :nth-child(2) > :nth-child(5) > a').click()
    cy.get('h1').should('contain', 'Collection Fields Edition Page')
    cy.get('.field > :nth-child(2) > :nth-child(7)').click()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').clear()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').type('category name private')
    cy.get('.textarea').type('name book description')
    cy.get('#tainacan-select-status-private > .check').click()
    cy.get(':nth-child(1) > .control > .select > select').select('Cat 2')
    cy.get(':nth-child(2) > .control > .select > select').select('Radio').should('have.value', 'tainacan-category-radio')
    cy.get(':nth-child(2) > .button').click()
    cy.get('.active-fields-area >').should('contain', 'category name private')
  })

  it('create category-type field public required', function(){
    cy.visit('/wp-admin/admin.php?page=tainacan_admin#/collections')
    cy.get('h1').should('contain', 'Collections Page')
    cy.get('[data-label="Name"] > :nth-child(1) > .clickable-row').click()
    cy.get(':nth-child(4) > .router-link-active').should('contain', 'Items')
    cy.get('.menu > :nth-child(2) > :nth-child(5) > a').click()
    cy.get('h1').should('contain', 'Collection Fields Edition Page')
    cy.get('.field > :nth-child(2) > :nth-child(7)').click()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').clear()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').type('category name public required')
    cy.get('.textarea').type('name book description required')
    cy.get('#tainacan-select-status-publish > .check').click()
    cy.get(':nth-child(1) > .control > .select > select').select('Cat 3')
    cy.get(':nth-child(2) > .control > .select > select').select('Radio').should('have.value', 'tainacan-category-radio')
    cy.get(':nth-child(2) > .button').click()
    cy.get('.active-fields-area >').should('contain', 'category name public required')
  })

  it('create category-type field public multiple values', function(){
    cy.visit('/wp-admin/admin.php?page=tainacan_admin#/collections')
    cy.get('h1').should('contain', 'Collections Page')
    cy.get('[data-label="Name"] > :nth-child(1) > .clickable-row').click()
    cy.get(':nth-child(4) > .router-link-active').should('contain', 'Items')
    cy.get('.menu > :nth-child(2) > :nth-child(5) > a').click()
    cy.get('h1').should('contain', 'Collection Fields Edition Page')
    cy.get('.field > :nth-child(2) > :nth-child(7)').click()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').clear()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').type('category name public multiple values')
    cy.get('.textarea').type('name book description multiple values')
    cy.get('#tainacan-select-status-publish > .check').click()
    cy.get(':nth-child(1) > .control > .select > select').select('Cat 4')
    cy.get(':nth-child(2) > .control > .select > select').select('Radio').should('have.value', 'tainacan-category-radio')
    cy.get(':nth-child(2) > .button').click()
    cy.get('.active-fields-area >').should('contain', 'category name public multiple values')
  })

  it('create category-type field public unique values', function(){
    cy.visit('/wp-admin/admin.php?page=tainacan_admin#/collections')
    cy.get('h1').should('contain', 'Collections Page')
    cy.get('[data-label="Name"] > :nth-child(1) > .clickable-row').click()
    cy.get(':nth-child(4) > .router-link-active').should('contain', 'Items')
    cy.get('.menu > :nth-child(2) > :nth-child(5) > a').click()
    cy.get('h1').should('contain', 'Collection Fields Edition Page')
    cy.get('.field > :nth-child(2) > :nth-child(7)').click()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').clear()
    cy.get('#fieldEditForm > :nth-child(1) > .control > .input').type('category name public unique values')
    cy.get('.textarea').type('name book description multiple values')
    cy.get('#tainacan-select-status-publish > .check').click()
    cy.get(':nth-child(1) > .control > .select > select').select('Cat 5')
    cy.get(':nth-child(2) > .control > .select > select').select('Radio').should('have.value', 'tainacan-category-radio')
    cy.get(':nth-child(2) > .button').click()
    cy.get('.active-fields-area >').should('contain', 'category name public unique values')
  })

  it('check if fields are updated to page', function(){
    cy.visit('/wp-admin/admin.php?page=tainacan_admin#/collections')
    cy.get('h1').should('contain', 'Collections Page')
    cy.get('[data-label="Name"] > :nth-child(1) > .clickable-row').click()
    cy.get(':nth-child(4) > .router-link-active').should('contain', 'Items')
    cy.get('.menu > :nth-child(2) > :nth-child(7) > a').click()
    cy.get('h1').should('contain', 'Collection Fields Edition Page')
    cy.get('.active-fields-area >').should('not.contain', 'category name canceled')
    cy.get('.active-fields-area >').should('contain', 'category name public')
    cy.get('.active-fields-area >').should('contain', 'category name private')
    cy.get('.active-fields-area >').should('contain', 'category name public required')
    cy.get('.active-fields-area >').should('contain', 'category name public multiple values')
    cy.get('.active-fields-area >').should('contain', 'category name public unique values')
  })
})