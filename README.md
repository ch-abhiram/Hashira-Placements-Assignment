This Node.js script implements a simplified version of Shamir's Secret Sharing algorithm to recover the secret (constant term 'c' of a polynomial) from encoded shares provided in a JSON file. It decodes y-values from specified bases, uses Lagrange interpolation for reconstruction, and processes multiple test cases simultaneously. The script assumes no wrong shares and uses the first k shares for each test case. It handles large integers with BigInt and enforces positive results per assignment constraints.

Features
Parses a combined JSON with "testcase1" and "testcase2".

Decodes y-values from bases 2-36 to BigInt.

Computes the secret via Lagrange interpolation at x=0.

Outputs secrets for both test cases in one run.

Requirements
Node.js (v10.4+ for BigInt support).

Installation
Clone the repository:
```bash
git clone https://github.com/ch-abhiram/Hashira-Placements-Assignment.git
```
Ensure Node.js is installed (verify with node -v).

Usage
Prepare input.json with the combined test cases.

Run the script:

```bash
node script.js input.json

```