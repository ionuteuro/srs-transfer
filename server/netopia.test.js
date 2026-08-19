import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import forge from 'node-forge'
import { encryptRequest, decryptResponse, isConfigured } from './netopia.js'

function makeCert() {
  const keys = forge.pki.rsa.generateKeyPair(2048)
  const cert = forge.pki.createCertificate()
  cert.publicKey = keys.publicKey
  cert.privateKey = keys.privateKey
  cert.serialNumber = '01'
  const now = new Date()
  cert.validity.notBefore = now
  cert.validity.notAfter = new Date(now.getTime() + 86400000)
  const attrs = [{ name: 'commonName', value: 'test' }]
  cert.setSubject(attrs)
  cert.setIssuer(attrs)
  cert.sign(keys.privateKey, forge.md.sha256.create())
  return {
    cert: forge.pki.certificateToPem(cert),
    key: forge.pki.privateKeyToPem(keys.privateKey),
  }
}

describe('netopia crypto (clasic mobilPay)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'np-'))
  const certPath = path.join(dir, 'cert.pem')
  const keyPath = path.join(dir, 'key.pem')
  const { cert, key } = makeCert()
  fs.writeFileSync(certPath, cert)
  fs.writeFileSync(keyPath, key)
  process.env.NETOPIA_SIGNATURE = 'TEST'
  process.env.NETOPIA_CERT = certPath
  process.env.NETOPIA_KEY = keyPath

  it('isConfigured devine true cu certificat', () => {
    expect(isConfigured()).toBe(true)
  })

  it('encrypt → decrypt reconstruiește XML-ul', () => {
    const order = {
      orderId: 'SRS-1',
      signature: 'TEST',
      amount: '159.00',
      clientName: 'Ion Popescu',
      clientPhone: '0700000000',
      clientEmail: '',
      details: 'Transfer Otopeni',
      returnUrl: 'http://localhost:5173/?status=success',
      confirmUrl: 'http://localhost:5173/api/ipn',
    }
    const { redirect, fields } = encryptRequest(order)
    expect(redirect).toContain('mobilpay.ro')
    expect(fields.env_key).toBeTruthy()
    expect(fields.data).toBeTruthy()

    const xml = decryptResponse(fields.env_key, fields.data)
    expect(xml).toContain('SRS-1')
    expect(xml).toContain('159.00')
    expect(xml).toContain('Ion Popescu')
  })
})
