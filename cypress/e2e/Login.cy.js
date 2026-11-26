const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php'

describe('Login test', () => {
  beforeEach(() => {
    cy.visit(`${BASE_URL}/auth/login`)
  })
  it('berhasil login', ()=>{
    cy.get('[name="username"]').type("Admin")
    cy.get('[name="password"]').type("admin123")
    cy.get('.oxd-button').click()

    cy.url().should('include','/dashboard', {timeout:6000})
    cy.get('.oxd-topbar-header-breadcrumb h6')
      .should('have.text', 'Dashboard')
    cy.get('oxd-loading-spinner', {timeout:6000})
      .should('not.exist')
    const widgets = ['Time at Work', 'My Actions', 'Quick Launch', 
                    'Buzz Latest Posts','Employees on Leave Today', 
                    'Employee Distribution by Sub Unit', 'Employee Distribution by Location']
        widgets.forEach((widget)=>{
          cy.contains('.oxd-sheet', widget, {timeout:10000}).should('be.visible')
        })
    cy.get('.oxd-pie-chart', {timeout:6000}).should('have.length.at.least', 2).and('be.visible')
    cy.screenshot('Login.cy.js/login berhasil', {capture: 'viewport'})
  })

  it('login gagal username salah', ()=>{
    cy.get('[name="username"]').type("dmin")
    cy.get('[name="password"]').type("admin123")
    cy.get('.oxd-button').click()

    cy.get('.oxd-alert-content-text')
      .should('contain', 'Invalid credentials')
    cy.screenshot('Login.cy.js/login gagal username salah', {capture: 'viewport'})
  })

  it('login gagal password salah', ()=>{
    cy.get('[name="username"]').type("Admin")
    cy.get('[name="password"]').type("admin126", {log: 'false'})
    cy.get('.oxd-button').click()

    cy.get('.oxd-alert-content-text')
      .should('contain', 'Invalid credentials')
    cy.screenshot('Login.cy.js/login gagal password salah', {capture: 'viewport'})
  })

  it('login tes Password kosong', ()=>{
    cy.get('[name="username"]').type("Admin")
    cy.get('.oxd-button').click()
    cy.get('.oxd-input-field-error-message')
      .should('have.length',1)
    cy.get('.oxd-input-field-error-message')
      .first()
      .should('contain','Required')
    cy.screenshot('Login.cy.js/login test Password kosong', {capture: 'viewport'})
  })

  it('login test Username kosong', ()=>{
    cy.get('[name="password"]').type("admin123", {log: 'false'})
    cy.get('.oxd-button').click()
    cy.get('.oxd-input-field-error-message')
      .should('have.length',1)
    cy.get('.oxd-input-field-error-message')
      .first()
      .should('contain','Required')
    cy.screenshot('Login.cy.js/login test Username kosong', {capture: 'viewport'})
  })

  it('login tes kosong', ()=>{
    cy.get('.oxd-button').click()
    cy.get('.oxd-input-field-error-message')
      .should('have.length',2)
    cy.get('.oxd-input-field-error-message')
      .first()
      .should('contain','Required')
    cy.screenshot('Login.cy.js/login test kosong', {capture: 'viewport'})
  })
  afterEach(()=>{
    cy.log('selesai')
  })
})

