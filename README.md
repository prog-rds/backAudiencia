# To install dependencies

```sh
bun install
```

To build and run temporarily:

```sh
bun build src/index.js --outdir=out --target=bun --minify
bun out/index.js
```

To run as daemon:

```sh
pm2 start --interpreter bun out/index.js
```

To run in dev:

```sh
bun run dev
```
