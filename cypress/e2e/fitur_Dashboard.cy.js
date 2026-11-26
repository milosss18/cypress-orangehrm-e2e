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


// SCENARIO 1: MAIN DASHBOARD PAGE
describe('Dashboard', () => {
  beforeEach(() => {
    login()
    cy.visit(`${BASE_URL}`)
  })

  it('Verifies Dashboard header and title', 
    () => {
      cy.title().should('eq', 'OrangeHRM')
      cy.get('.oxd-topbar-header-breadcrumb')
        .should('be.visible')
        .and('contain.text', 'Dashboard')
      cy.screenshot('fitur_Dashboard.cy.js/Dashboard_Page/Dashboard header and title', {capture: 'viewport'})
    }
  )
  it('Verifies Search Menu', ()=>{
    cy.get('.oxd-main-menu-search').should('be.visible')
      cy.get('.oxd-input').type('Time')
      cy.get('.oxd-sidepanel-body').screenshot('fitur_Dashboard.cy.js/Dashboard_Page/input teks', {capture:'viewport'})
      cy.get('.oxd-input').clear()
      cy.get('.oxd-input').type('Time{selectAll}')
      cy.get('.oxd-sidepanel-body').screenshot('fitur_Dashboard.cy.js/Dashboard_Page/select all teks', {capture:'viewport'})
      cy.get('.oxd-input').clear()
      cy.get('.oxd-input').type('Time', {delay:300}).type('{Backspace}')
      cy.get('.oxd-sidepanel-body').screenshot('fitur_Dashboard.cy.js/Dashboard_Page/delete teks', {capture:'viewport'})
      cy.get('.oxd-input').clear()
    cy.get('.oxd-main-menu-search > .oxd-icon-button').should('be.visible')
    cy.screenshot('fitur_Dashboard.cy.js/Dashboard_Page/open sidebar', {capture: 'viewport'})
    cy.get('.oxd-main-menu-search > .oxd-icon-button').click()
    cy.wait(1000)
    cy.screenshot('fitur_Dashboard.cy.js/Dashboard_Page/sidebar closed', {capture: 'viewport'})
    cy.get('.oxd-main-menu-search > .oxd-icon-button').click()
  })
  it('Verifies Sidebar Menu Dashboard', () => {
    const menu =[ 'Admin', 'PIM', 'Leave', 'Time', 'Recruitment',
                'My Info', 'Performance', 'Dashboard', 'Directory', 'Maintenance',
                'Claim', 'Buzz']
    cy.get('.oxd-main-menu').should('be.visible')
    menu.forEach((item) => {
      cy.contains('.oxd-main-menu', item, {matchCase: true}).should('be.visible')
    })
    cy.get('.oxd-sidepanel-body').screenshot('fitur_Dashboard.cy.js/Dashboard_Page/sidebar menu')
  })

  it('Verifies Dashboard widgets are visible', () => {
    const widgets = ['Time at Work', 'My Actions', 'Quick Launch', 
                    'Buzz Latest Posts','Employees on Leave Today', 
                    'Employee Distribution by Sub Unit', 'Employee Distribution by Location']
      cy.get('.oxd-loading-spinner', {timeout: 10000}).should('not.exist')
      cy.get('.oxd-sheet').should('exist')
    widgets.forEach((widget) => {
      cy.contains('.oxd-sheet', widget, {timeout: 15000})
      .scrollIntoView({ offset: { top: -120, left: 0 } })
      .should('be.visible')
      .and('contain.text', widget)
      .as('currentWidget')
        if(widget.includes('Distribution')){
          cy.get('@currentWidget').should('be.visible')
          cy.wait(2000)
        } else{
          cy.get('@currentWidget').find('.oxd-loading-spinner').should('not.exist')
        }
      cy.screenshot(`fitur_Dashboard.cy.js/Dashboard_Page/${widget.replace(/\s+/g, '_')}`, {capture: 'viewport'}, { overwrite: true })
    })
  })
})

//SCENARIO 2: PROFILE OPTIONS
describe('Profile Options Page', () => {
  beforeEach(() => {
    login()
    cy.visit(`${BASE_URL}/dashboard/index`)
    cy.get('.oxd-userdropdown-tab').click()
    cy.wait(1000)

  })
  it('Dropdown profile', ()=>{
    cy.screenshot('fitur_Dashboard.cy.js/Profile_Options/Dropdown Profile', {capture: 'viewport'})
    cy.get('.oxd-userdropdown-tab').click()
  })

  it('About', () => {
    cy.contains('.oxd-userdropdown-link', 'About').click()
    cy.get('.oxd-dialog-container-default')
      .should('be.visible')
      .and('contain.text', 'About')
    cy.wait(3000)
    cy.screenshot('fitur_Dashboard.cy.js/Profile_Options/About', {capture: 'viewport'})
    cy.get('.oxd-dialog-close-button').click()
    cy.get('.oxd-dialog-container-default').should('not.exist')
  })

  it('Support', () => {
    cy.contains('.oxd-userdropdown-link', 'Support').click()
    cy.get(':nth-child(2) > .oxd-userdropdown-link').should('be.visible')
    cy.wait(3000)
    cy.screenshot('fitur_Dashboard.cy.js/Profile_Options/Support', {capture: 'viewport'})
    cy.get(':nth-child(8) > .oxd-main-menu-item').click()
  })
  it('Change Password', () => {
    cy.contains('.oxd-userdropdown-link', 'Change Password').click()
    cy.wait(3000)
    cy.screenshot('fitur_Dashboard.cy.js/Profile_Options/Change Password', {capture: 'viewport'})
    cy.get(':nth-child(8) > .oxd-main-menu-item').click()
  })
  it('Logout', ()=>{
    cy.contains('Logout').click()
    cy.wait(3000)
    cy.screenshot('fitur_Dashboard.cy.js/Profile_Options/Logout(back to login)', {capture: 'viewport'})
    cy.visit(`${BASE_URL}`)
    login()
    cy.visit(`${DASHBOARD_URL}`)
  })
})
//SCENARIO 3 HALAMAN WIDGET
describe('Widget', () => {
  beforeEach(() => {
    login()
    cy.visit(`${BASE_URL}/dashboard/index`)
  })
  it('Verifies Time Navigation', ()=>{
    cy.get('.orangehrm-attendance-card-bar > .oxd-icon-button > .oxd-icon').click()
    cy.wait(5000)
    cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/ Time', {capture: 'viewport'})
    cy.get(':nth-child(8) > .oxd-main-menu-item').click()
    cy.contains('.oxd-sheet', 'My Actions').scrollIntoView().should('be.visible')
  })
  it('Verifies My Actions Navigation', ()=>{
    cy.contains('(1) Pending Self Review').should('be.visible').click()
      cy.wait(5000)
      cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/ My Actions(pending self review)', {capture: 'viewport'})
      cy.get(':nth-child(8) > .oxd-main-menu-item').click()
    cy.contains('.oxd-sheet', 'Quick Launch').scrollIntoView().should('be.visible')
  })
it('Verifies Quick Launch Navigation', ()=>{
  cy.get('.oxd-grid-3 >:nth-child(1)>.oxd-icon-button>.oxd-icon').should('be.visible').click()
  cy.wait(5000)
  cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/Assign Leave', {capture: 'viewport'})
  cy.get(':nth-child(8) > .oxd-main-menu-item').click()
  cy.get('.oxd-grid-3 >:nth-child(2)>.oxd-icon-button>.oxd-icon').should('be.visible').click()
  cy.wait(5000)
  cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/Leave List', {capture: 'viewport'})
  cy.get(':nth-child(8) > .oxd-main-menu-item').click()
  cy.get('.oxd-grid-3 >:nth-child(3)>.oxd-icon-button>.oxd-icon').should('be.visible').click()
  cy.wait(5000)
  cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/Timesheets', {capture: 'viewport'})
  cy.get(':nth-child(8) > .oxd-main-menu-item').click()
  cy.get('.oxd-grid-3 >:nth-child(4)>.oxd-icon-button>.oxd-icon').should('be.visible').click()
  cy.wait(5000)
  cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/Apply Leave', {capture: 'viewport'})
  cy.get(':nth-child(8) > .oxd-main-menu-item').click()
  cy.get('.oxd-grid-3 >:nth-child(5)>.oxd-icon-button>.oxd-icon').should('be.visible').click()
  cy.wait(5000)
  cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/My Leave', {capture: 'viewport'})
  cy.get(':nth-child(8) > .oxd-main-menu-item').click()
  cy.get('.oxd-grid-3 >:nth-child(6)>.oxd-icon-button>.oxd-icon').should('be.visible').click()
  cy.wait(5000)
  cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/My Timesheet', {capture: 'viewport'})
  cy.get(':nth-child(8) > .oxd-main-menu-item').click()
  cy.contains('.oxd-sheet', 'Employees on Leave Today').scrollIntoView().should('be.visible')
})
  it('Verifies Buzz Latest Navigation', ()=>{
    cy.contains('Sania Shaheen').scrollIntoView().should('be.visible').click()
      cy.wait(5000)
      cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/Anuj Akhil Kandalkar', {capture: 'viewport'})
      cy.get(':nth-child(8) > .oxd-main-menu-item').click()
    cy.contains('Rebecca Harmony').scrollIntoView().should('be.visible').click()
      cy.wait(5000)
      cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/Anuj Akhil Kandalkar', {capture: 'viewport'})
      cy.get(':nth-child(8) > .oxd-main-menu-item').click()
    cy.contains('Russel Hamilton').scrollIntoView().should('be.visible').click()
      cy.wait(5000)
      cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/Anuj Akhil Kandalkar', {capture: 'viewport'})
      cy.get(':nth-child(8) > .oxd-main-menu-item').click()
  })

  it('Verifies Employees on Leave Today Navigation', ()=>{
    cy.get('.bi-gear-fill').click().wait(4000)
      cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/Employees on Leave Today pop up', {capture: 'viewport'})
    cy.get('.oxd-button--secondary').click().wait(500)
    cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/save', {capture: 'viewport'})
    cy.wait(5000)
    cy.get('.bi-gear-fill').should('be.visible').click()
    cy.get('.oxd-button--ghost').click().wait(600)
    cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/cancel', {capture: 'viewport'})
    cy.get('.bi-gear-fill').should('be.visible').click()
    cy.get('.oxd-dialog-close-button').click().wait(600)
    cy.screenshot('fitur_Dashboard.cy.js/Widget_Page/close pop up', {capture: 'viewport'})
  })

it('Verifies Employee Distribution by Sub Unit Tooltip', ()=>{
    // ===== Helper pie chart =====
    const hoverAtAngle = ($canvas, deg, ratio = 0.7) => {
      const { width, height } = $canvas[0].getBoundingClientRect()
      const radius = Math.min(width, height) / 2
      const rad = (deg * Math.PI) / 180
      const x = width / 2 + radius * ratio * Math.sin(rad)
      const y = height / 2 - radius * ratio * Math.cos(rad)
      cy.wrap($canvas)
        .trigger('mouseover', x, y, { force: true })
        .trigger('mousemove', x, y, { force: true })
    }
    // Daftar percobaan: tiap ratio, putar 0°-358° step 2°
    const buildAttempts = () => {
      const list = []
      ;[0.7, 0.5, 0.85].forEach((ratio) => {
        for (let deg = 0; deg < 360; deg += 2) {
          list.push({ deg, ratio })
        }
      })
      return list
    }
    // Scan sampai tooltip berisi `text`, lalu jalankan onFound(deg, ratio)
    const findSlice = ($canvas, text, onFound, attempts = buildAttempts(), i = 0, seen = []) => {
      if (i >= attempts.length) {
        const unik = [...new Set(seen)].join(' | ') || '(tidak ada tooltip yang terbaca)'
        throw new Error(`Slice "${text}" tidak ketemu. Tooltip yang terbaca: ${unik}`)
      }
      const { deg, ratio } = attempts[i]
      hoverAtAngle($canvas, deg, ratio)
      cy.wait(150) // beri waktu chart memperbarui tooltip
      cy.get('body').then(($body) => {
        const tip = $body.find('#oxd-pie-chart-tooltip').text().trim()
        if (tip) seen.push(tip)
        if (tip.includes(text)) {
          onFound(deg, ratio)
        } else {
          findSlice($canvas, text, onFound, attempts, i + 1, seen)
        }
      })
    }
    const getPieCanvas = () =>
      cy.contains('.oxd-sheet', 'Employee Distribution by Sub Unit', { timeout: 10000 })
        .scrollIntoView()
        .find('.oxd-pie-chart canvas', { timeout: 10000 })
        .should('be.visible')
        .should(($c) => {
          expect($c[0].getBoundingClientRect().width).to.be.greaterThan(0)
        })
    // ===== Daftar slice yang dites (samakan dengan legend) =====
    const slices = [
      'Engineering',
      'Human Resources',
      'Administration',
      'Services',
      'Unassigned',
    ]
    // ===== Eksekusi =====
    getPieCanvas().then(($canvas) => {
      slices.forEach((name) => {
        // reset tooltip dari slice sebelumnya
        cy.wrap($canvas).trigger('mouseout', { force: true })
        findSlice($canvas, name, (deg, ratio) => {
          cy.log(`${name} ketemu di ${deg}° (ratio ${ratio})`)
          cy.get('#oxd-pie-chart-tooltip', { timeout: 10000 })
            .should('be.visible')
            .and('contain.text', name)
          cy.screenshot(`fitur_Dashboard.cy.js/Widget_Page/tooltip-${name.replace(/\s+/g, '_')}`, {
            capture: 'viewport',
            overwrite: true,
            disableTimersAndAnimations: false,
          })
        })
      })
    })
  })


  it('Verifies Employee Distribution by Location Tooltip', () => {
  // ===== HELPER PIE CHART =====
  // Fungsi hover ke satu titik di pie chart, berdasarkan derajat (deg) dan jarak dari pusat (ratio, default 0.7)
  const hoverAtAngle = ($canvas, deg, ratio = 0.7) => {
    // Ambil lebar dan tinggi canvas
    const { width, height } = $canvas[0].getBoundingClientRect()
    // Jari-jari lingkaran = sisi terpendek dibagi 2
    const radius = Math.min(width, height) / 2
    // Ubah derajat (deg) menjadi radian (rad) agar dipahami sin dan cos
    const rad = (deg * Math.PI) / 180
    const x = width / 2 + radius * ratio * Math.sin(rad)
    const y = height / 2 - radius * ratio * Math.cos(rad)
    // Kirim event mouse ke titik (x, y):
    // - mouseover memberi tahu chart bahwa mouse masuk
    // - mousemove membuat chart menghitung irisan di bawah kursor
    // - force: true melewati pengecekan "elemen tertutup"
    cy.wrap($canvas)
      .trigger('mouseover', x, y, { force: true })
      .trigger('mousemove', x, y, { force: true })
  }

  // === DAFTAR PERCOBAAN: TIAP RATIO, PUTAR 0°-358° STEP 2° ===
  const buildAttempts = () => {
    const list = [] // Daftar kosong untuk menampung percobaan
    // Tanda ; di depan mencegah JavaScript salah menggabungkan dengan baris sebelumnya
    ;[0.7, 0.5, 0.85].forEach((ratio) => {
      // Untuk tiap jarak (70%, 50%, 85% dari pusat ke tepi)
      // Putar dari 0° sampai 358°, loncat 2° tiap kali,
      // lalu simpan pasangan {sudut, jarak} ke daftar
      // Hasil akhirnya: 180 sudut × 3 jarak = 540 percobaan
      for (let deg = 0; deg < 360; deg += 2) {
        list.push({ deg, ratio })
      }
    })
    return list // Kembalikan daftar ke yang memanggil
  }

  // === SCAN SAMPAI TOOLTIP BERISI `text`, LALU JALANKAN onFound(deg, ratio) ===
  // findSlice: mencari irisan sampai ketemu
  // Parameter:
  // - text: nama slice yang dicari
  // - onFound: fungsi yang dijalankan setelah ketemu
  // - attempts: daftar percobaan dari buildAttempts
  // - i: percobaan ke berapa (mulai 0)
  // - seen: catatan semua tooltip yang pernah terbaca
  const findSlice = ($canvas, text, onFound, attempts = buildAttempts(), i = 0, seen = []) => {
    // Pengaman: kalau semua percobaan habis dan belum ketemu, hentikan tes dengan pesan error
    // new Set(seen) membuang duplikat, jadi error hanya menampilkan tooltip yang berbeda-beda
    // Ini alat diagnosis: kamu bisa lihat apakah hover sebenarnya bekerja
    if (i >= attempts.length) {
      const unik = [...new Set(seen)].join(' | ') || '(tidak ada tooltip yang terbaca)'
      throw new Error(`Slice "${text}" tidak ditemukan. Tooltip yang terbaca: ${unik}`)
    }

    // Ambil percobaan ke-i, lalu hover di sudut dan jarak itu
    const { deg, ratio } = attempts[i]
    hoverAtAngle($canvas, deg, ratio)

    cy.wait(150) // Beri waktu chart memperbarui tooltip
    cy.get('body').then(($body) => {
      const tip = $body.find('#oxd-pie-chart-tooltip').text().trim()
      if (tip) seen.push(tip) // Kalau ada teks tooltip, simpan ke catatan seen

      // Tooltip mengandung nama yang dicari -> jalankan onFound dan berhenti
      // Belum -> panggil dirinya sendiri untuk percobaan berikutnya (i + 1)
      // Ini disebut rekursi: fungsi memanggil dirinya sendiri, "ulangi sampai berhasil"
      if (tip.includes(text)) {
        onFound(deg, ratio)
      } else {
        findSlice($canvas, text, onFound, attempts, i + 1, seen)
      }
    })
  }

  // === AMBIL CANVAS PIE CHART ===
  // Pastikan canvas terlihat dan sudah punya lebar lebih dari 0
  // Cypress mengulang pengecekan ini sampai lolos, jadi ini pengganti .wait(4000) yang menunggu buta
  const getPieCanvas = () =>
    cy.contains('.oxd-sheet', 'Employee Distribution by Location', { timeout: 10000 })
      .scrollIntoView()
      .find('.oxd-pie-chart canvas', { timeout: 10000 })
      .should('be.visible')
      .should(($c) => {
        expect($c[0].getBoundingClientRect().width).to.be.greaterThan(0)
      })

  // ===== DAFTAR SLICE YANG DITES (SAMAKAN DENGAN LEGEND) =====
  const slice = ['Texas R&D', 'New York Sales Office', 'Unassigned']

  // ===== EKSEKUSI =====
  // Ambil canvas yang sudah siap, lalu jalankan isi blok dengan $canvas sebagai canvasnya
  getPieCanvas().then(($canvas) => {
    // Ulangi untuk setiap nama slice. name berisi nama saat ini
    slice.forEach((name) => {
      // Mouse "keluar" dari chart supaya tooltip slice sebelumnya hilang
      // Ini mencegah tooltip lama terbaca sebagai tooltip baru
      cy.wrap($canvas).trigger('mouseout', { force: true })

      // Cari slice `name`. Fungsi di dalam kurung adalah onFound, dijalankan saat ketemu
      findSlice($canvas, name, (deg, ratio) => {
        // Tulis catatan di Command Log, misalnya "Texas R&D ketemu di 9° (ratio 0.85)"
        // Berguna supaya kamu tahu posisi pastinya
        cy.log(`${name} ketemu di ${deg}° (ratio ${ratio})`)

        // Pastikan tooltip tampil dan berisi nama slice
        cy.get('#oxd-pie-chart-tooltip', { timeout: 10000 })
          .should('be.visible')
          .and('contain.text', name)

        // Ambil screenshot sebagai bukti visual:
        // - name.replace(/[^\w-]+/g, '_') mengganti spasi dan simbol (mis. &) jadi _ agar nama file aman
        // - capture: 'viewport' mengambil area yang terlihat saja
        // - overwrite: true menimpa file lama
        // - disableTimersAndAnimations: false membiarkan animasi jalan agar tooltip tetap tampil
        cy.screenshot(
          `fitur_Dashboard.cy.js/Widget_Page/tooltip-${name.replace(/[^\w-]+/g, '_')}`,
          {
            capture: 'viewport',
            overwrite: true,
            disableTimersAndAnimations: false,
          }
        )
      })
    })
  })
})
})