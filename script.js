
const fs = require('fs');


function decodeToBigInt(str, base) {
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
  let val = 0n;
  for (let char of str.toLowerCase()) {
    const d = digits.indexOf(char);
    if (d === -1 || d >= base) throw new Error(`Invalid digit '${char}' for base ${base}`);
    val = val * BigInt(base) + BigInt(d);
  }
  return val;
}


function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}


class Rational {
  constructor(num, den = 1n) {
    num = BigInt(num);
    den = BigInt(den);
    let g = gcd(num < 0n ? -num : num, den < 0n ? -den : den);
    this.num = num / g;
    this.den = den / g;
    if (this.den < 0n) {
      this.num = -this.num;
      this.den = -this.den;
    }
  }

  add(other) {
    const newNum = this.num * other.den + other.num * this.den;
    const newDen = this.den * other.den;
    return new Rational(newNum, newDen);
  }

  mul(other) {
    const newNum = this.num * other.num;
    const newDen = this.den * other.den;
    return new Rational(newNum, newDen);
  }

  sub(other) {
    return this.add(new Rational(-other.num, other.den));
  }

  div(other) {
    return this.mul(new Rational(other.den, other.num));
  }

  isInteger() {
    return this.den === 1n;
  }

  getInteger() {
    if (!this.isInteger()) throw new Error('Not an integer');
    return this.num;
  }
}


function interpolateAtZero(points) {
  const n = points.length;
  let result = new Rational(0n);
  for (let i = 0; i < n; i++) {
    const xi = points[i].x;
    let term = new Rational(points[i].y);
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const xj = points[j].x;
      if (xi === xj) throw new Error('Duplicate x values');
      const num = new Rational(0n).sub(new Rational(xj));
      const den = new Rational(xi).sub(new Rational(xj));
      const factor = num.div(den);
      term = term.mul(factor);
    }
    result = result.add(term);
  }
  return result;
}


function processTestcase(testcase) {
  const n = testcase.keys.n;
  const k = testcase.keys.k;
  const shares = [];

  for (const key in testcase) {
    if (key !== 'keys') {
      const x = BigInt(key);
      const point = testcase[key];
      const base = parseInt(point.base, 10);
      const value = point.value;
      const y = decodeToBigInt(value, base);
      shares.push({ x, y });
    }
  }

  if (shares.length !== n) {
    throw new Error(`Expected ${n} shares, found ${shares.length}`);
  }

 
  const selected = shares.slice(0, k);
  try {
    const rat = interpolateAtZero(selected);
    if (rat.isInteger()) {
      const sec = rat.getInteger();
      
      if (sec >= 0n) {
        return sec.toString();
      } else {
        throw new Error('Negative secret found');
      }
    } else {
      throw new Error('Non-integer secret');
    }
  } catch (e) {
    throw new Error(`Interpolation failed: ${e.message}`);
  }
}


function main() {
  const filename = process.argv[2];
  if (!filename) {
    console.error('Usage: node script.js <input.json>');
    process.exit(1);
  }
  const input = JSON.parse(fs.readFileSync(filename, 'utf8'));

  try {
    const secret1 = processTestcase(input.testcase1);
    const secret2 = processTestcase(input.testcase2);
    console.log(`Testcase1 secret: ${secret1}`);
    console.log(`Testcase2 secret: ${secret2}`);
  } catch (e) {
    console.error('Processing failed:', e.message);
  }
}

main();
