const { spawn } = require("node:child_process");

function runDev() {
  const dev = spawn("npm", ["run", "dev-core"], {
    stdio: "inherit",
    shell: true,
  });

  // Caso o processo de dev seja encerrado, executa o cleanup
  dev.on("exit", (code, signal) => {
    console.log(
      `Processo dev finalizado (código: ${code}, sinal: ${signal}). Iniciando cleanup...`,
    );
    runCleanup();
  });

  // Captura Ctrl+C e envia sinal para o processo filho
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
    console.log(`Cleanup finalizado (código: ${code}).`);
    process.exit(code);
  });
}

runDev();
