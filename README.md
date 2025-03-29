# Riot Take-Home Technical Challenge

This project implements an HTTP API with 4 endpoints for encryption, decryption, signing, and signature verification. The app is built using **Node.js**, **TypeScript**, and **Fastify**.

## ✨ Endpoints

### 1. `/encrypt` (POST)
Encrypts all top-level properties of a JSON payload using **Base64**.

**Example Input**
```json
{
  "name": "John Doe",
  "age": 30,
  "contact": {
    "email": "john@example.com",
    "phone": "123-456-7890"
  }
}
```

**Example Output**
```json
{
  "name": "Sm9obiBEb2U=",
  "age": "MzA=",
  "contact": "eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9"
}
```

---

### 2. `/decrypt` (POST)
Decrypts Base64 values in a JSON payload. Unencrypted properties remain unchanged.

---

### 3. `/sign` (POST)
Adds an HMAC-based `signature` to the payload. Signature is **order-independent**.

---

### 4. `/verify` (POST)
Validates a payload's `signature`.  
Returns:
- **204 No Content** if valid
- **400 Bad Request** if invalid

---

## 🛠️ Tech Stack

- Node.js
- TypeScript
- Fastify
- HMAC (crypto)
- Base64 encoding
- pnpm (for package management)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/UnArtisant/take-home.git
cd take-home
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Build the project

```bash
pnpm build
```

### 4. Start the server

```bash
pnpm start
```

Server will run on `http://localhost:3000` by default.

---

## 👨‍💻 Development Mode

```bash
pnpm dev
```

---

## ✅ Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm start` | Start the server (built output) |
| `pnpm dev` | Start with watch mode (auto-reload) |
| `pnpm build` | Compile TypeScript |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm format` | Check formatting with Prettier |
| `pnpm format:fix` | Auto-format code |
| `pnpm lint-and-format` | Run lint and format checks |
| `pnpm test` | Run unit tests with `tap` |

---

## 📌 Notes

- All cryptographic functions are **abstracted**, allowing easy swap of Base64 or HMAC with more secure algorithms if needed.
- Ensure **/encrypt ➜ /decrypt** restores the original payload.
- Ensure **/sign ➜ /verify** works regardless of JSON property order.

---

## 🧪 Code Coverage

> Generated from unit tests

| File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
|------------------------------|---------|----------|---------|---------|-------------------|
| All files                    | 99.28   | 97.67    | 100     | 99.28   |                   |

🔍 99.28% of the code is covered.