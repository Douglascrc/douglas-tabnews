import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  orchestrator.waitAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();
    await email.send({
      from: "Douglas <douglascampos@hotmail.com>",
      to: "<douglasc@gmail.com>",
      subject: "Teste de email",
      text: "Hello World!",
    });

    await email.send({
      from: "Douglas <douglascamdev@hotmail.com>",
      to: "<douglas.campos@gmail.com>",
      subject: "Último email enviado",
      text: "Corpo do último email",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<douglascamdev@hotmail.com>");
    expect(lastEmail.recipients[0]).toBe("<douglas.campos@gmail.com>");
    expect(lastEmail.subject).toBe("Último email enviado");
    expect(lastEmail.text).toBe("Corpo do último email\r\n");
  });
});
