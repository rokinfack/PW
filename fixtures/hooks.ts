import { expect, test } from "./fixtures";

// == BEFORE ALL ==
test.beforeAll(async () => {
  console.log('🚀 [GLOBAL beforeAll] Initialisation avant toute la suite de tests');
});

// == BEFORE EACH ==
test.beforeEach(async ({ page }, testInfo) => {
  console.log(`🔄 [beforeEach] Avant "${testInfo.title}"`);
  await page.goto('https://demo.playwright.dev/todomvc');
});

// == AFTER EACH ==
test.afterEach(async ({ page }, testInfo) => {
  const screenshotName = testInfo.title.replace(/\s+/g, '_');

  // Gestion des cas d'échec
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log('❌ Test échoué, capture d\'écran...');
    const screenshotPath = `screenshots/${screenshotName}_failure.png`;

    await page.screenshot({ path: screenshotPath, fullPage: true });

    await testInfo.attach('screenshot-on-failure', {
      path: screenshotPath,
      contentType: 'image/png',
    });

    return; // Ne pas faire de comparaison visuelle si le test a échoué
  }

  // Comparaison visuelle si test réussi
  try {
    console.log('✅ Test réussi, vérification visuelle...');
    await expect(page).toHaveScreenshot(`${screenshotName}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  } catch (error) {
    console.error(`❌ Screenshot mismatch ou snapshot manquant : ${screenshotName}.png`);

    // Suggestion si en mode DEV
    if (!testInfo.config.updateSnapshots && process.env.DEV === 'true') {
      console.warn(`⚠️ Snapshot manquant ou incorrect — exécute :
        npx playwright test --update-snapshots`);
    }

    throw error;
  }

  // Vérifie si la page a été redirigée vers /login
  const pageUrl = page.url();
  if (pageUrl.includes('/login')) {
    console.error('🚨 ATTENTION : Redirection détectée vers /login');
    const loginErrorScreenshot = `screenshots/${screenshotName}_login_error.png`;

    await page.screenshot({ path: loginErrorScreenshot, fullPage: true });

    await testInfo.attach('screenshot-on-login-error', {
      path: loginErrorScreenshot,
      contentType: 'image/png',
    });

    throw new Error('Erreur critique: Session utilisateur perdue (retour login)');
  }
});

// == AFTER ALL ==
test.afterAll(async () => {
  console.log('🏁 [GLOBAL afterAll] Fin de la suite de tests');
});
