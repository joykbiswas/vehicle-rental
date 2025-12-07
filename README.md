## Project Name: Vehicle Rental

### Live Link: https://vehicle-rental-eight.vercel.app/

### Technology Stack

1. Node.js
2. TypeScript,
3. Express.js.
4. PostgreSQL
5. bcrypt .
6. jsonwebtoken (JWT authentication).

### Setup & Usage Instructions.

1. Create Project Folder

```ts
 cd vehicle-rental.
```

2. Initialize Project

```ts
npm init -y
```

3. Install

```ts
npm install express typescript.
```

4. Dev dependencies

```ts
 npm install -D typescript ts-node nodemon @types/node @types/express
```

5. Update tsconfig.json:

```ts
 Set "rootDir": "./src" and "outDir": "./dist"
```

6. Add Scripts in package.json

```ts
"scripts": {
    "dev": "ts-node-dev --respawn --transpile-only ./src/server.ts",
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "tsc"
  },
```

6. Run Development Server:

```ts
 npm run dev
```
