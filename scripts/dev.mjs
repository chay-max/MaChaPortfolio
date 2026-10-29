import { spawn } from "node:child_process";
const args = process.argv.slice(2).filter((x) => x !== "--strictPort");
const i = args.indexOf("--host");
if (i >= 0) args[i] = "--hostname";
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", ...args],
  { stdio: "inherit" },
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));
