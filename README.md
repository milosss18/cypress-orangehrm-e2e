# Cypress OrangeHRM E2E

Proyek latihan end-to-end testing dengan Cypress. Spec OrangeHRM menguji situs demo publik [OrangeHRM](https://opensource-demo.orangehrmlive.com); spec contoh Cypress menggunakan situs contoh Cypress. Tujuannya adalah mempelajari cara menulis, menjalankan, dan mengevaluasi test, bukan menyediakan test suite yang dijamin selalu lulus.

## Tujuan belajar

Setelah menyelesaikan latihan, kamu diharapkan dapat:

- Menulis struktur test dengan `describe` dan `it`.
- Mengunjungi halaman dan mencari elemen dengan `cy.visit()`, `cy.get()`, dan `cy.contains()`.
- Melakukan aksi seperti mengetik dan klik, lalu memeriksa hasilnya dengan assertion.
- Menggunakan hook, alias, fixture, dan custom command.
- Memahami isolation antar-test, session login, retry Cypress, serta kapan memakai `cy.request()` atau `cy.intercept()`.
- Menjalankan satu spec maupun seluruh suite dan membaca hasilnya.

## Persiapan

Persyaratan: Node.js dan npm yang kompatibel dengan Cypress 16, browser yang didukung Cypress, serta koneksi internet. Test OrangeHRM membutuhkan situs demo tetap tersedia; test contoh Cypress juga mengakses situs eksternal.

```sh
npm ci
```

Jalankan Cypress Test Runner interaktif:

```sh
npm run test:open
```

Atau jalankan semua spec secara headless:

```sh
npm test
```

`npm test` menjalankan Cypress dalam run mode. Sebagian test berinteraksi dengan layanan demo publik sehingga bisa gagal atau menjadi flaky ketika layanan lambat, sedang tidak tersedia, atau UI berubah. Screenshot lama di `cypress/screenshots` adalah bukti run sebelumnya, bukan jaminan bahwa test saat ini lulus.

## Jalur latihan

Kerjakan berurutan. Sebelum mengubah test, jalankan spec terkait satu kali agar kamu punya hasil pembanding.

### 1. Memahami struktur test dan runner

Mulai dari `cypress/e2e/1-getting-started/todo.cy.js`. Telusuri satu test dari `describe` dan hook hingga command Cypress dan assertion-nya. Jalankan hanya spec tersebut:

```sh
npx cypress run --spec "cypress/e2e/1-getting-started/todo.cy.js"
```

**Latihan:** tambahkan satu assertion yang memeriksa jumlah atau isi item Todo sebelum dan sesudah aksi.

**Validasi:** spec Todo lulus di Test Runner dan hasil assertion dapat dilihat di Command Log.

### 2. Selektor, aksi, dan assertion

Pelajari `cypress/e2e/2-advanced-examples/querying.cy.js`, `actions.cy.js`, dan `assertions.cy.js`. Contoh-contoh ini membuka `https://example.cypress.io`, bukan OrangeHRM.

**Latihan:** tambahkan test kecil yang mencari elemen berdasarkan teks, melakukan aksi, lalu memeriksa hasilnya. Pilih selektor yang stabil dan hindari menunggu dengan jeda tetap bila assertion retry sudah cukup.

**Validasi:** jalankan spec yang kamu ubah satu per satu dengan `npx cypress run --spec "cypress/e2e/2-advanced-examples/<nama-file>.cy.js"`.

### 3. Skenario login OrangeHRM

Baca `cypress/e2e/Login.cy.js`. File ini mencakup login berhasil, kredensial salah, dan input kosong.

**Latihan:** tambahkan satu kasus validasi login yang belum ada. Gunakan setup halaman yang konsisten, masukkan input melalui elemen form, lalu assert pesan atau URL yang menunjukkan hasil.

**Validasi:** jalankan spec login:

```sh
npx cypress run --spec "cypress/e2e/Login.cy.js"
```

Pastikan hasilnya menunjukkan kasus mana yang lulus atau gagal; jangan menganggap screenshot lama sebagai hasil validasi.

### 4. Dashboard, navigasi, dan session

Pelajari `cypress/e2e/fitur_Dashboard.cy.js` dan `cypress/e2e/Sidebar_menu.cy.js`. Perhatikan helper login, `cy.session()`, pengecekan URL, visibilitas widget, serta perbedaan antara membuka halaman di browser dan memeriksa endpoint dengan `cy.request()`.

**Latihan:** tambahkan assertion untuk satu menu atau widget yang ada di demo. Pertimbangkan apakah login perlu dilakukan ulang di setiap test atau dapat digunakan bersama melalui session. Hindari mengubah data akun demo.

**Validasi:** jalankan spec yang diubah secara terpisah, periksa Command Log dan screenshot terbaru, lalu jalankan suite penuh jika layanan demo tersedia.

### 5. Tantangan lanjutan

Gunakan spec di `cypress/e2e/2-advanced-examples` sebagai referensi, lalu pilih satu topik untuk dipraktikkan:

- `aliasing.cy.js`: gunakan alias untuk elemen atau route.
- `files.cy.js`: baca fixture dan gunakan datanya dalam test.
- `network_requests.cy.js`: amati atau stub request menggunakan `cy.intercept()`.
- `spies_stubs_clocks.cy.js`: periksa pemanggilan fungsi atau kendalikan waktu.
- `cookies.cy.js` atau `storage.cy.js`: validasi state browser.

Tambahkan satu test mandiri di spec yang sesuai dan tuliskan apa yang divalidasi. Jalankan spec itu sebelum suite penuh.

## Checklist validasi

Sebelum menganggap latihan selesai:

1. Perubahan mencakup satu perilaku yang jelas dan nama test menjelaskan skenarionya.
2. Test lulus saat dijalankan sendiri dengan `npx cypress run --spec "<path-spec>"`.
3. Assertion memeriksa hasil yang bermakna, bukan hanya keberhasilan klik.
4. Test tidak bergantung pada urutan test lain atau jeda tetap yang tidak diperlukan.
5. Catat hasilnya: spec yang dijalankan, jumlah lulus/gagal, dan kegagalan eksternal jika situs demo tidak tersedia.

Untuk pemeriksaan terakhir, jalankan `npm test`. Jika gagal, baca nama spec dan pesan assertion. Bedakan kegagalan karena perubahan test dari layanan demo atau situs contoh yang sedang tidak dapat diakses.

## Perintah berguna

Jalankan satu spec:

```sh
npx cypress run --spec "cypress/e2e/Login.cy.js"
```

Jalankan semua spec:

```sh
npm test
```

Buka runner interaktif:

```sh
npm run test:open
```

## Struktur proyek

```text
cypress/
  e2e/          Spec Cypress dan contoh
  fixtures/     Data fixture
  screenshots/  Screenshot hasil run sebelumnya
  support/      Setup dan custom commands
cypress.config.js
package.json
package-lock.json
```

Folder `cypress/e2e/2-advanced-examples` berisi contoh API Cypress yang sebagian besar menguji situs contoh Cypress. Folder `cypress/e2e` juga mencakup spec OrangeHRM buatan proyek ini.
