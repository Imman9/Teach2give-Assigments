// 1. Password Authentication:
// ○ Why is it important to store passwords in a hashed format? What security
// Storing passwords in a hashed format is critical for security.
//  Hashing transforms a password into an irreversible string of characters using
//   cryptographic algorithms (e.g., SHA-256, bcrypt, Argon2).
//  Unlike encryption, hashing cannot be reversed, making it secure against data leaks.
import bcrypt from "bcrypt";

d;
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

(async () => {
  const password = "securepassword123";
  const hashed = await hashPassword(password);
  console.log("Hashed Password:", hashed);

  const isMatch = await verifyPassword(password, hashed);
  console.log("Password Match:", isMatch);
})();

// 2. Multi-Factor Authentication (MFA):
// ○ How does implementing MFA enhance the security of the transaction process?
// MFA requires users to provide multiple forms of authentication before granting access. This typically includes:

// 1.Something you know (password, PIN).
// 2.Something you have (OTP, security key).
// 3.Something you are (biometrics, face recognition).
// What types of attacks does it help prevent?
// Credential Stuffing & Brute Force: Even if an attacker guesses the password, they still need another factor.
// Phishing Attacks: Users need more than just a password, reducing the impact of stolen credentials.
// Session Hijacking & Man-in-the-Middle (MITM): Attackers cannot bypass authentication without access to multiple factors.

const speakeasy = require("speakeasy");

// Generate a secret key for a user
const secret = speakeasy.generateSecret({ length: 20 });
console.log("Secret Key:", secret.base32);

// Generate a time-based OTP
const otp = speakeasy.totp({
  secret: secret.base32,
  encoding: "base32",
});
console.log("Generated OTP:", otp);

// Verify the OTP
const isValid = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: "base32",
  token: otp,
  window: 1, // Allows slight time deviation
});
console.log("Is OTP Valid?", isValid); // Should print true

// 3. Balance Verification:
// ○ Why is it necessary to check the account balance before allowing a withdrawal?
// Ensuring sufficient funds before processing a withdrawal prevents financial and operational issues.
// What risks are involved if this step is skipped?
// Overdraft & Negative Balances: Without verification, users might withdraw more than they have.
// Fraudulent Transactions: Attackers could exploit system flaws to withdraw excess funds.
// Bankruptcy Risks: Financial institutions might suffer significant losses if they allow excessive withdrawals.
// Legal & Compliance Issues: Many regulatory bodies require balance checks to prevent financial fraud.
function checkBalance(account, amount) {
  if (account.balance >= amount) {
    account.balance -= amount;
    console.log(`Withdrawal successful. New balance: ${account.balance}`);
  } else {
    console.log("Insufficient funds.");
  }
}

// Example usage
const userAccount = { balance: 500 };
checkBalance(userAccount, 300); // Successful
checkBalance(userAccount, 300); // Fails due to insufficient funds

// 4. Daily Transaction Limit:
// ○ What purpose does the daily transaction limit serve?
// A daily transaction limit restricts the total amount a user can withdraw or transfer in a day
// How does it help in preventing fraudulent or excessive withdrawals?
// Preventing Fraudulent Withdrawals: Even if credentials are stolen, attackers cannot drain an account in a single transaction.
// Reducing Damage from Phishing Attacks: Limits minimize financial losses if an account is compromised.
// Encouraging Responsible Spending: Prevents excessive withdrawals by customers.
// Compliance with Regulations: Many financial institutions have mandatory withdrawal caps.
const dailyLimit = 1000;
let dailyWithdrawn = 0;

function withdraw(amount) {
  if (dailyWithdrawn + amount > dailyLimit) {
    console.log("Daily transaction limit exceeded.");
    return;
  }

  dailyWithdrawn += amount;
  console.log(
    `Withdrawal successful. Today's total withdrawals: ${dailyWithdrawn}`
  );
}

// Example usage
withdraw(500); // Successful
withdraw(400); // Successful
withdraw(200); // Fails due to exceeding the daily limit

// 5. Improvement:
// ○ If you were to add extra features, such as fraud detection (e.g., detecting
// abnormal withdrawal patterns), how would you go about doing this? What
// additional data would you track to detect fraud?
// Additional Data to Track:
// 1.Transaction History: Monitor previous withdrawals for unusual spikes.
// 2.Time & Frequency: Track if a user is withdrawing money at odd hours or too frequently.
// 3.IP Address & Geolocation: Flag transactions from unusual locations.
// 4.Device Fingerprinting: Detect if a new/unrecognized device is being used.
// 5.Machine Learning Models: Train an AI model to classify normal vs. suspicious transactions.
// 6.Velocity Checks: Detect rapid, consecutive withdrawals.
// 7.Behavioral Analysis: Identify anomalies like a user suddenly withdrawing large sums.
// Implementation Strategy:
// Step 1: Collect transaction logs and label them as legitimate or suspicious.
// Step 2: Use machine learning models (Random Forest, Neural Networks, etc.) to detect abnormal patterns.
// Step 3: Set thresholds for alerting and introduce risk scores for flagged transactions.
// Step 4: Implement real-time alerts & transaction approval for high-risk withdrawals.
// Step 5: Integrate with MFA for high-risk transactions to add extra security.

function detectFraud(transactions, newTransaction) {
  const avg =
    transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length;
  const threshold = avg * 2; // If withdrawal is 2x the average, flag as suspicious

  if (newTransaction.amount > threshold) {
    console.log("⚠️ Fraud Alert! Unusual withdrawal detected.");
  } else {
    console.log("Withdrawal processed normally.");
  }
}

// Example usage
const transactions = [
  { amount: 100 },
  { amount: 120 },
  { amount: 110 },
  { amount: 150 },
];

detectFraud(transactions, { amount: 400 }); // Suspicious
detectFraud(transactions, { amount: 130 }); // Normal
