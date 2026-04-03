import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxRetryTime: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if(!response.ok){ // response.ok responde true se a resposta estiver entre 200 e 299
        throw new Error(`Unexpected response status: ${response.status}`); 
      }

    }
  }
}

export default {
  waitForAllServices,
};
