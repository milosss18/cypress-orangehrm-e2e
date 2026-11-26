const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php'

const LOGIN_URL = `${BASE_URL}/auth/login`
const DASHBOARD_URL = `${BASE_URL}/dashboard/index`

//MEMBANGUNKAN SERVER TERLEBIH DAHULU
const warmUp=(attempt = 1) =>{
  cy.request({
    url: LOGIN_URL,
    failOnStatusCode: false,
    timeout: 60000
  }) .then ((res)=> {
    if(res.status !== 200 && attempt < 5){
      cy.wait(5000)
      warmUp(attempt +1)
    }
  })
}
const login = () => {
  cy.session(
    'admin-session',
    () => {
      cy.visit(LOGIN_URL, { timeout: 120000 })
      cy.get('[name="username"]', { timeout: 30000 }).type('Admin')
      cy.get('[name="password"]').type('admin123', { log: false })
      cy.get('button[type="submit"]').click()
      cy.url({ timeout: 60000 }).should('include', '/dashboard')
      cy.get('.oxd-topbar-header-breadcrumb', { timeout: 60000 })
        .should('contain.text', 'Dashboard')
    },
    {
      validate() {
        cy.request({
          url: `${BASE_URL}/api/v2/dashboard/employees/action-summary`, // path API web
          failOnStatusCode: false,
          timeout: 60000
        }).its('status').should('eq', 200)
      }
    }
  )
}
// Ini bagian yang menggantikan cy.visit(DASHBOARD_URL) yang lama.
// cy.request = mengirim satu pertanyaan singkat ke server, 
// tanpa membuka halaman. Seperti menelepon satpam: “Kartu ini masih berlaku?”
// failOnStatusCode: false = kalau server menjawab “tidak” (misalnya kode 401), Cypress tidak langsung error. 
// Jawabannya tetap dicek di baris berikutnya.
// .its('status').should('eq', 200) = ambil kode jawaban server, pastikan 200 (artinya “ya, valid”).
// timeout: 60000 = boleh menunggu jawaban sampai 60 detik.
// Kenapa lebih baik dari cy.visit? Membuka halaman dashboard itu seperti masuk 
// dan berkeliling gedung hanya untuk mengecek kartu. Sedangkan cy.request cukup menempelkan kartu ke pintu. 
// Lebih cepat, lebih kecil kemungkinan timeout.

// Menu Halaman Admin CRUD
describe('Admin', ()=>{
  beforeEach(() => {
    login()
    cy.visit(`${BASE_URL}`)
    cy.get(':nth-child(1) > .oxd-main-menu-item').click()
  })
  it('User Management', ()=>{
    cy.wait(4000)
    cy.scrollTo('top')
    cy.get('.oxd-table-filter-header-options').click().wait(500).click()
    cy.get(':nth-child(2) > .oxd-input').type('ikmal', {delay:600})
    cy.contains('.oxd-input-group', 'User Role').find('.oxd-select-text').click()
    cy.contains('.oxd-select-option', 'Admin').click()
    cy.get('.oxd-autocomplete-text-input > input').type('mal', {delay: 600})
    cy.contains('.oxd-select-text--after', 'Enabled').click()
    // cy.scrollTo('top')
    // cy.screenshot('admin', { capture: 'viewport' })
  })
})