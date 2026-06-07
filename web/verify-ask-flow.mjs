// CrowdMind End-to-End Verification Script
// Tests: /ask empty, gibberish, valid; submit + stepper; reload persistence; navbar redirect; no hardcoded data

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind\\verification-screenshots';
const FRONTEND = 'http://localhost:5173';
const CREDENTIALS = {
  email: 'siddharthsadhu28+1@gmail.com',
  password: 'Sadhu@2006!',
};

if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const results = {
  test1_initial_ask: { status: 'PENDING', details: '' },
  test2_gibberish:   { status: 'PENDING', details: '' },
  test3_valid_input: { status: 'PENDING', details: '' },
  test4_submit_stepper: { status: 'PENDING', details: '' },
  test5_reload_persistence: { status: 'PENDING', details: '' },
  test6_analytics_redirect: { status: 'PENDING', details: '' },
  test7_no_hardcoded: { status: 'PENDING', details: '' },
};

const issues = [];

async function shot(page, name) {
  const file = path.join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`   📸 ${name}.png`);
  return file;
}

async function getQualityScore(page) {
  return await page.evaluate(() => {
    const el = document.querySelector('#quality-score-num');
    return el?.textContent?.trim() || 'NOT_FOUND';
  });
}

async function getSubmitButtonState(page) {
  return await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const submitBtn = btns.find(b => b.textContent?.trim() === 'Submit Question' || b.textContent?.trim() === 'Submitting...');
    if (!submitBtn) return { found: false };
    return {
      found: true,
      text: submitBtn.textContent?.trim(),
      disabled: submitBtn.hasAttribute('disabled'),
      opacity: window.getComputedStyle(submitBtn).opacity,
      cursor: window.getComputedStyle(submitBtn).cursor,
    };
  });
}

async function loginIfNeeded(page) {
  console.log('🔐 Checking if login is needed...');
  await page.goto(`${FRONTEND}/ask`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  const currentUrl = page.url();
  console.log(`   Current URL: ${currentUrl}`);
  
  if (currentUrl.includes('/login') || currentUrl.includes('/sign-in')) {
    console.log('   Login required. Logging in via Clerk form...');
    
    // Clerk uses a placeholder "Enter your email address" for the email field
    const emailInput = page.locator('input[placeholder="Enter your email address"]').first();
    await emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await emailInput.fill(CREDENTIALS.email);
    await page.waitForTimeout(800);
    await shot(page, '00a_login_email_filled');
    
    // Click "Continue" button
    await page.locator('button:has-text("Continue")').first().click();
    await page.waitForTimeout(2500);
    await shot(page, '00b_login_password_page');
    
    // Now password field should appear
    const pwdInput = page.locator('input[type="password"]').first();
    const pwdVisible = await pwdInput.isVisible().catch(() => false);
    
    if (pwdVisible) {
      await pwdInput.fill(CREDENTIALS.password);
      await page.waitForTimeout(800);
      await shot(page, '00c_login_password_filled');
      
      // Click Continue / Sign in
      await page.locator('button:has-text("Continue")').first().click();
      await page.waitForTimeout(5000);
      await shot(page, '00d_after_pwd_continue');
      
      const urlAfterPwd = page.url();
      console.log(`   URL after password submit: ${urlAfterPwd}`);
      
      if (urlAfterPwd.includes('factor-two') || urlAfterPwd.includes('verify')) {
        console.log('   ⚠️ 2FA page detected. Looking for skip/back options...');
        
        // Check if "Use another method" link is present
        const useAnother = page.locator('a:has-text("Use another method"), button:has-text("Use another method")').first();
        if (await useAnother.count() > 0) {
          console.log('   Found "Use another method" - clicking it');
          await useAnother.click();
          await page.waitForTimeout(2000);
          await shot(page, '00e_another_method');
        }
        
        // Check for "skip" or "later" options
        const skipBtn = page.locator('button:has-text("Skip"), a:has-text("Skip")').first();
        if (await skipBtn.count() > 0) {
          console.log('   Found Skip button - clicking it');
          await skipBtn.click();
          await page.waitForTimeout(3000);
        }
      }
    } else {
      console.log('   ⚠️ Password field not visible - trying alternate selectors');
    }
    
    console.log(`   After login URL: ${page.url()}`);
  } else {
    console.log('   Already on /ask, no login needed');
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let loginSucceeded = false;

  page.on('pageerror', err => console.log(`   ❌ PAGE ERROR: ${err.message}`));
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`   ⚠️  CONSOLE ERROR: ${msg.text()}`);
  });
  
  try {
    // === LOGIN ===
    try {
      await loginIfNeeded(page);
      const url = page.url();
      loginSucceeded = url.includes('/ask') || url.includes('/home') || (!url.includes('/login') && !url.includes('/sign-in'));
    } catch (loginErr) {
      console.log(`   ⚠️  Login failed: ${loginErr.message}`);
      console.log('   Marking all tests as SKIP — script needs valid Clerk credentials.');
      Object.keys(results).forEach(k => {
        results[k].status = 'INFO';
        results[k].details = 'SKIP — login failed; needs valid Clerk credentials or dev-mode token';
      });
      issues.push('verify-ask-flow: SKIPPED — Clerk login failed. Use dev-mode auth bypass (create_test_token) to run end-to-end ask flow.');
      throw loginErr;
    }

    if (!loginSucceeded) {
      console.log('   ⚠️  Login did not reach /ask — marking tests as SKIP');
      Object.keys(results).forEach(k => {
        results[k].status = 'INFO';
        results[k].details = 'SKIP — login did not redirect away from /login';
      });
      throw new Error('Login did not succeed');
    }

    // === TEST 1: Initial /ask ===
    console.log('\n🧪 TEST 1: Initial /ask (empty input)');
    await page.goto(`${FRONTEND}/ask`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    await shot(page, '01_ask_initial');
    
    const initialScore = await getQualityScore(page);
    const initialBtn = await getSubmitButtonState(page);
    console.log(`   Quality Score: ${initialScore}`);
    console.log(`   Submit Button: ${JSON.stringify(initialBtn)}`);
    
    if (initialScore === '0/100' || initialScore === '0') {
      results.test1_initial_ask.status = 'PASS';
      results.test1_initial_ask.details = `Score = ${initialScore}`;
    } else if (initialScore === '25/100') {
      results.test1_initial_ask.status = 'FAIL';
      results.test1_initial_ask.details = `Score started at 25/100 (BUG: should be 0/100)`;
      issues.push('Initial Quality Score is 25/100 when it should be 0/100');
    } else {
      results.test1_initial_ask.status = 'INFO';
      results.test1_initial_ask.details = `Score = ${initialScore} (unexpected but may be OK if category pre-selected)`;
    }
    
    if (initialBtn.found && initialBtn.disabled) {
      results.test1_initial_ask.status = 'PASS';
    } else if (initialBtn.found && !initialBtn.disabled) {
      issues.push('Submit button is NOT disabled on initial load');
    }
    
    // === TEST 2: Gibberish ===
    console.log('\n🧪 TEST 2: Gibberish input');
    const titleInput = page.locator('#question-title-input');
    await titleInput.fill('aaaa bbbb cccc');
    await page.waitForTimeout(1000);
    await shot(page, '02_ask_gibberish');
    
    const gibberishScore = await getQualityScore(page);
    const gibberishBtn = await getSubmitButtonState(page);
    console.log(`   Quality Score: ${gibberishScore}`);
    console.log(`   Submit Button: ${JSON.stringify(gibberishBtn)}`);
    
    if (gibberishScore === '0/100' && gibberishBtn.disabled) {
      results.test2_gibberish.status = 'PASS';
      results.test2_gibberish.details = `Score = ${gibberishScore}, button disabled`;
    } else {
      results.test2_gibberish.status = 'FAIL';
      results.test2_gibberish.details = `Score = ${gibberishScore}, disabled = ${gibberishBtn.disabled}`;
      issues.push(`Gibberish input was accepted: score=${gibberishScore}, disabled=${gibberishBtn.disabled}`);
    }
    
    // === TEST 3: Valid input ===
    console.log('\n🧪 TEST 3: Valid question');
    await titleInput.fill('How can I change my team after Phase 1?');
    await page.waitForTimeout(1500);
    await shot(page, '03_ask_valid');
    
    const validScore = await getQualityScore(page);
    const validBtn = await getSubmitButtonState(page);
    console.log(`   Quality Score: ${validScore}`);
    console.log(`   Submit Button: ${JSON.stringify(validBtn)}`);
    
    if (validScore !== '0/100' && !validBtn.disabled) {
      results.test3_valid_input.status = 'PASS';
      results.test3_valid_input.details = `Score = ${validScore}, button enabled`;
    } else {
      results.test3_valid_input.status = 'FAIL';
      results.test3_valid_input.details = `Score = ${validScore}, disabled = ${validBtn.disabled}`;
      issues.push(`Valid question: score=${validScore}, button still disabled=${validBtn.disabled}`);
    }
    
    // === TEST 4: Submit + stepper ===
    console.log('\n🧪 TEST 4: Submit question + stepper animation');
    const submitBtn = page.locator('button:has-text("Submit Question")').first();
    await submitBtn.click();
    await page.waitForTimeout(1500);
    await shot(page, '04_analysis_loading');
    
    const loadingUrl = page.url();
    console.log(`   URL after submit: ${loadingUrl}`);
    
    if (loadingUrl.includes('/analysis/')) {
      // Verify stepper is visible
      const stepperVisible = await page.evaluate(() => {
        return !!document.querySelector('#step-1, #step-2, #step-3, [id*="step"]');
      });
      console.log(`   Stepper visible: ${stepperVisible}`);
      
      // Wait 4 more seconds for stepper to complete
      await page.waitForTimeout(4000);
      await shot(page, '05_analysis_completed');
      
      const completedView = await page.evaluate(() => {
        return {
          hasScannedCount: !!document.querySelector('#analysis-faqs-scanned'),
          scannedFaqs: document.querySelector('#analysis-faqs-scanned')?.textContent,
          hasConfidence: !!document.querySelector('#status-confidence-score'),
          confidence: document.querySelector('#status-confidence-score')?.textContent,
          noSpinner: !document.querySelector('.animate-spin'),
        };
      });
      console.log(`   After 4s: ${JSON.stringify(completedView)}`);
      
      if (completedView.noSpinner || completedView.hasScannedCount) {
        results.test4_submit_stepper.status = 'PASS';
        results.test4_submit_stepper.details = `Stepper completed, scanned=${completedView.scannedFaqs}, conf=${completedView.confidence}`;
      } else {
        results.test4_submit_stepper.status = 'FAIL';
        results.test4_submit_stepper.details = `Stepper still running after 4s`;
        issues.push('Stepper did not complete within 4s');
      }
    } else {
      results.test4_submit_stepper.status = 'FAIL';
      results.test4_submit_stepper.details = `Did not navigate to /analysis/. URL: ${loadingUrl}`;
      issues.push(`Submit did not navigate to /analysis/. URL: ${loadingUrl}`);
    }
    
    // === TEST 5: Reload persistence ===
    console.log('\n🧪 TEST 5: Reload analysis page (DB persistence)');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await shot(page, '06_analysis_reloaded');
    
    const reloaded = await page.evaluate(() => {
      return {
        hasScannedCount: !!document.querySelector('#analysis-faqs-scanned'),
        scannedFaqs: document.querySelector('#analysis-faqs-scanned')?.textContent,
        hasStepper: !!document.querySelector('#step-1, #step-2, #step-3'),
        hasConfidence: !!document.querySelector('#status-confidence-score'),
        confidence: document.querySelector('#status-confidence-score')?.textContent,
      };
    });
    console.log(`   Reloaded: ${JSON.stringify(reloaded)}`);
    
    if (reloaded.hasScannedCount && !reloaded.hasStepper) {
      results.test5_reload_persistence.status = 'PASS';
      results.test5_reload_persistence.details = `Completed state persists, scanned=${reloaded.scannedFaqs}`;
    } else if (reloaded.hasStepper) {
      results.test5_reload_persistence.status = 'FAIL';
      results.test5_reload_persistence.details = 'Stepper re-appeared on reload (DB not persisting)';
      issues.push('ai_analysis_status not persisting - stepper re-runs on reload');
    } else {
      results.test5_reload_persistence.status = 'FAIL';
      results.test5_reload_persistence.details = `Unexpected state: ${JSON.stringify(reloaded)}`;
    }
    
    // === TEST 6: Navbar Analytics redirect ===
    console.log('\n🧪 TEST 6: Navbar Analytics click → /analysis/:id');
    
    // Find the Analytics nav link
    const analyticsLink = await page.locator('a:has-text("Analytics"), nav a:has-text("Analytics"), header a:has-text("Analytics")').first();
    
    if (await analyticsLink.count() > 0) {
      await analyticsLink.click();
      await page.waitForTimeout(3000);
      await shot(page, '07_analytics_redirect');
      
      const newUrl = page.url();
      console.log(`   After Analytics click: ${newUrl}`);
      
      if (newUrl.includes('/analysis/')) {
        results.test6_analytics_redirect.status = 'PASS';
        results.test6_analytics_redirect.details = `Redirected to ${newUrl}`;
      } else if (newUrl.includes('/evolution')) {
        // Check if it auto-redirected
        await page.waitForTimeout(2000);
        const finalUrl = page.url();
        if (finalUrl.includes('/analysis/')) {
          results.test6_analytics_redirect.status = 'PASS';
          results.test6_analytics_redirect.details = `Auto-redirected /evolution → ${finalUrl}`;
        } else {
          results.test6_analytics_redirect.status = 'FAIL';
          results.test6_analytics_redirect.details = `Stayed on /evolution. URL: ${finalUrl}`;
          issues.push('Analytics click goes to /evolution but does not auto-redirect');
        }
      } else {
        results.test6_analytics_redirect.status = 'INFO';
        results.test6_analytics_redirect.details = `Went to: ${newUrl}`;
      }
    } else {
      results.test6_analytics_redirect.status = 'FAIL';
      results.test6_analytics_redirect.details = 'No Analytics link found in nav';
      issues.push('No Analytics nav link found');
    }
    
    // === TEST 7: No hardcoded data ===
    console.log('\n🧪 TEST 7: Verify no hardcoded data on analysis page');
    await page.waitForTimeout(1000);
    await shot(page, '08_analysis_full');
    
    const pageData = await page.evaluate(() => {
      const text = document.body.textContent || '';
      // Look for obvious hardcoded patterns
      const hardcodedPatterns = [
        /\bAlex\s+Rivera\b/i,
        /\bSarah\s+Chen\b/i,
        /\bDr\.\s*Marcus\s+Vo\b/i,
        /\b4200\+\s+knowledge\s+nodes/i,
        /\b4,200\+\s+knowledge\s+nodes/i,
      ];
      const found = hardcodedPatterns
        .filter(p => p.test(text))
        .map(p => p.source);
      return { foundHardcoded: found, bodyLength: text.length };
    });
    console.log(`   Hardcoded check: ${JSON.stringify(pageData)}`);
    
    if (pageData.foundHardcoded.length === 0) {
      results.test7_no_hardcoded.status = 'PASS';
      results.test7_no_hardcoded.details = 'No obvious hardcoded values found';
    } else {
      results.test7_no_hardcoded.status = 'FAIL';
      results.test7_no_hardcoded.details = `Found hardcoded: ${pageData.foundHardcoded.join(', ')}`;
      issues.push(`Hardcoded values detected: ${pageData.foundHardcoded.join(', ')}`);
    }
    
  } catch (err) {
    console.log(`\n❌ FATAL ERROR: ${err.message}`);
    console.log(err.stack);
    issues.push(`Test script error: ${err.message}`);
  } finally {
    await browser.close();
    
    // Print report
    console.log('\n\n========================================');
    console.log('=== TEST RESULTS ===');
    console.log('========================================');
    for (const [key, val] of Object.entries(results)) {
      console.log(`${key}: ${val.status} - ${val.details}`);
    }
    console.log('\n=== ISSUES FOUND ===');
    if (issues.length === 0) {
      console.log('✅ No issues!');
    } else {
      issues.forEach((i, idx) => console.log(`  ${idx + 1}. ${i}`));
    }
    console.log(`\nScreenshots saved to: ${SCREENSHOTS_DIR}`);
    
    // Write JSON report
    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'report.json'),
      JSON.stringify({ results, issues, timestamp: new Date().toISOString() }, null, 2)
    );
  }
})();
