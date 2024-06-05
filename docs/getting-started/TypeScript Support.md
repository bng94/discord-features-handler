# TypeScript Support

discord-features-handler support typescript natively allowing you to code your discord.js bot in typescript.

## Setup

``` 
npm install --save-dev typescript tsx ts-node @types/node tsup
```

then add `tsconfig.json` in your project root folder

```javascript title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "typeRoots": ["./src/types"],
    "removeComments": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "strictNullChecks": true,
    "skipLibCheck": true
  }
}
```

then update `package.json` with the following:

```javascript title="package.json"
  "main": "src/index.ts",
  "type": "commonjs",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "build": "tsup src/ --minify",
    "prod": "pm2 start dist/index.js"
  },

```

## Starting the bot

First compile the code: 
```
npm run build
```
now you can start up the bot using the following:
```
npm run dev
```