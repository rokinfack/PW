import { defineConfig, devices } from '@playwright/test';



export default defineConfig({
  reporter: [
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }]
  ],
  
  testDir: './',
  use:{
    trace: 'retain-on-failure',
    baseURL: 'https://www.saucedemo.com',
  },
 
  projects: [
    // Projet de setup : s’authentifie et génère le fichier user.json
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
   

    // Projet Chromium avec état d’auth
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
    
      dependencies: ['setup'],
    },

    // Projet Firefox avec état d’auth
    {
      name: 'firefox',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
