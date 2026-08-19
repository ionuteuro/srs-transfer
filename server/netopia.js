import crypto from 'node:crypto'
import fs from 'node:fs'
import forge from 'node-forge'

const NETOPIA_LIVE = 'https://secure.mobilpay.ro/pay.php'
const NETOPIA_SANDBOX = 'https://sandboxsecure.mobilpay.ro/pay.php'

function loadCert() {
  const path = process.env.NETOPIA_CERT
  if (!path || !fs.existsSync(path)) return null
  return fs.readFileSync(path, 'utf8')
}

function loadKey() {
  const path = process.env.NETOPIA_KEY
  if (!path || !fs.existsSync(path)) return null
  return fs.readFileSync(path, 'utf8')
}

export function isConfigured() {
  return Boolean(process.env.NETOPIA_SIGNATURE && loadCert())
}

export function paymentUrl() {
  return process.env.NETOPIA_SANDBOX === 'true' ? NETOPIA_SANDBOX : NETOPIA_LIVE
}

function buildXml(order) {
  const ts = Math.floor(Date.now() / 1000)
  return `<?xml version="1.0" encoding="utf-8"?>
<order type="card" id="${order.orderId}" timestamp="${ts}">
  <signature>${order.signature}</signature>
  <service name="srs-transfer"/>
  <price currency="RON" value="${order.amount}">${order.amount}</price>
  <parts value="1"/>
  <delivery>
    <receiver name="${order.clientName}" phone="${order.clientPhone}" email="${order.clientEmail || ''}"/>
    <address street="" city="" state="" country="RO" postal_code=""/>
  </delivery>
  <payment>
    <interval months="0"/>
  </payment>
  <notify url="${order.confirmUrl}"/>
  <redirect url="${order.returnUrl}"/>
  <details>${order.details}</details>
</order>`
}

export function encryptRequest(order) {
  const cert = loadCert()
  const xml = buildXml(order)
  const sessionKey = crypto.randomBytes(24)
  const iv = sessionKey.subarray(0, 8)

  const cipher = crypto.createCipheriv('des-ede3-cbc', sessionKey, iv)
  const encrypted = Buffer.concat([cipher.update(xml, 'utf8'), cipher.final()])
  const data = encrypted.toString('base64')

  const publicKey = forge.pki.certificateFromPem(cert).publicKey
  const envKey = publicKey.encrypt(sessionKey.toString('binary'), 'RSAES-PKCS1-V1_5')
  const envKeyB64 = Buffer.from(envKey, 'binary').toString('base64')

  return {
    redirect: paymentUrl(),
    fields: {
      signature: order.signature,
      env_key: envKeyB64,
      data,
    },
  }
}

export function decryptResponse(envKeyB64, dataB64) {
  const key = loadKey()
  if (!key) throw new Error('NETOPIA_KEY lipsă')
  const privateKey = forge.pki.privateKeyFromPem(key)
  const sessionKey = privateKey.decrypt(
    Buffer.from(envKeyB64, 'base64').toString('binary'),
    'RSAES-PKCS1-V1_5'
  )
  const sk = Buffer.from(sessionKey, 'binary')
  const iv = sk.subarray(0, 8)
  const decipher = crypto.createDecipheriv('des-ede3-cbc', sk, iv)
  const xml = Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64')),
    decipher.final(),
  ]).toString('utf8')
  return xml
}
