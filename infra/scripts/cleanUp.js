const { spawn } = require("node:child_process");

function runDev() {
  const dev = spawn("npm", ["run", "dev-core"], {
    stdio: "inherit",
    shell: true,
  });

  dev.on("exit", (code, signal) => {
    console.log(
      `Processo dev finalizado (código: ${code}, sinal: ${signal}). Iniciando cleanup...`,
    );
    runCleanup();
  });

  process.on("SIGINT", () => {
    console.log("Recebeu SIGINT. Encerrando processo dev...");
    dev.kill("SIGINT");
  });
}

function runCleanup() {
  const stop = spawn("npm", ["run", "services:stop"], {
    stdio: "inherit",
    shell: true,
  });
  stop.on("exit", (code, signal) => {
    console.log(`Cleanup finalizado código: ${code} e sinal: ${signal}.`);
    process.exit(code);
  });
}

runDev();
