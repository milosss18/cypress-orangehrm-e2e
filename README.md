# Cypress OrangeHRM E2E

Kumpulan end-to-end test menggunakan Cypress untuk aplikasi demo OrangeHRM di `https://opensource-demo.orangehrmlive.com`.

## Cakupan test

- Login berhasil dan gagal.
- Dashboard, widget, dan opsi profil.
- Navigasi menu sidebar.
- Contoh test bawaan Cypress di `cypress/e2e/1-getting-started` dan `cypress/e2e/2-advanced-examples`.

Test OrangeHRM bergantung pada ketersediaan situs demo dan dapat gagal jika aplikasi atau elemen UI-nya berubah.

## Persyaratan

- Node.js dan npm yang kompatibel dengan Cypress 16.
- Browser yang didukung Cypress.
- Koneksi internet untuk mengakses situs demo OrangeHRM.

## Menjalankan test

Pasang dependensi dari root repository:

```sh
npm ci
```

Jalankan semua spec dalam mode headless:

```sh
npm test
```

Buka Cypress Test Runner:

```sh
npm run test:open
```

Screenshot yang sudah disertakan berada di `cypress/screenshots`. Cypress juga dapat membuat screenshot baru ketika test berjalan.

## Struktur

```text
cypress/
  e2e/          Spec Cypress dan contoh
  fixtures/     Data fixture
  screenshots/  Screenshot hasil test
  support/      Setup dan custom commands
cypress.config.js
package.json
package-lock.json
```
