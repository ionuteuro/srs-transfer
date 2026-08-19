export function luhnOk(num) {
  const digits = String(num).replace(/\s/g, '')
  if (!/^\d{16}$/.test(digits)) return false
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return sum % 10 === 0
}

export function expiryOk(val) {
  const m = /^(\d{2})\/(\d{2})$/.exec(String(val))
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  const exp = new Date(year, month, 0, 23, 59, 59)
  return exp >= new Date()
}

export function phoneOk(val) {
  return /^0\d{8,9}$/.test(String(val).replace(/\s/g, ''))
}
