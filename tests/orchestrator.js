import retry from "async-retry";

async function waitAllServices() {
  await waitWebServer();

  async function waitWebServer() {
    retry(fetchStatusPage);
  }

  async function fetchStatusPage() {
    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/status`);
    await response.json();
  }
}

export default {
  waitAllServices,
};
