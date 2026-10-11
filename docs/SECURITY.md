# SECURITY
MVP local: sem segredos no client; debug apenas via ?debug=1 (dev).
Online (§86/§92/§93): RLS, server-authoritative, rate limits, validação de inputs,
transações atômicas anti-duplicação, sanitização de chat. Secrets só em env server (`.env.local`).
