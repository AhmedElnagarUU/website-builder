
 ✓ Ready in 17.4s
 ○ Compiling /api/auth/[...all] ...
 ✓ Compiled /api/auth/[...all] in 24.8s (1227 modules)
 GET /api/auth/get-session 200 in 32230ms
 ○ Compiling /[locale]/pricing ...
 ✓ Compiled /[locale]/pricing in 17.1s (1808 modules)
 GET /api/auth/get-session 200 in 23746ms
im invoked from getSubscriptionForUser
im invoked from createPaymentRecord
im invoked from createPayment
im invoked from createPaymobIntention
Response {
  status: 404,
  statusText: 'Not Found',
  headers: Headers {
    date: 'Fri, 18 Sep 2026 18:59:14 GMT',
    'content-type': 'application/json',
    'content-length': '182',
    connection: 'keep-alive',
    server: 'nginx',
    allow: 'POST, OPTIONS',
    vary: 'Accept-Language, Cookie, Origin',
    'content-language': 'en',
    'x-frame-options': 'ALLOWALL',
    'x-paymob-id': 'Root=1-6aad8a02-61c30b3d629161b63f0b12e7'
  },
  body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
  bodyUsed: false,
  ok: false,
  redirected: false,
  type: 'basic',
  url: 'https://accept.paymob.com/v1/intention/'
}
 POST /api/checkout 502 in 25430ms
im invoked from getSubscriptionForUser
im invoked from getSubscriptionForUser
 GET /en/pricing 200 in 34564ms
 GET /api/auth/get-session 200 in 91ms


