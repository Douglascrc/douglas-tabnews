import retry from "async-retry";

async function waitAllServices() {
  await waitWebServer();

  async function waitWebServer() {
    retry(fetchStatusPage),
      {
        retries: 100,
        maxTimeout: 1000,
        onRetry: (error, attempt) => {
          console.log(
            `Attempt${attempt} - Failed to fetch status page: ${error.message}`,
          );
        },
      };
  }

  async function fetchStatusPage() {
    const response = await fetch(`${process.env.WEB_SERVER}/api/v1/status`);

    if (response.status != 200) {
      throw new Error();
    }
  }
}

export default {
  waitAllServices,
};
