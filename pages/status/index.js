import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = response.json();
  return responseBody;
}

export default function StatusPage() {
  const { data, error, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 10000,
  });

  return (
    <div className="status">
      <h1>Status</h1>
      {!isLoading ? (
        <>
          <span>
            {data &&
            data.dependencies.database_info.database_status === "healthy" ? (
              <div className="icons">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10B981"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-heart-pulse"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                </svg>
                <p>Healthy</p>
              </div>
            ) : data &&
              data.dependencies.database_info.database_status ===
                "unhealthy" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F43F5E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-unplug"
                >
                  <path d="m19 5 3-3" />
                  <path d="m2 22 3-3" />
                  <path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" />
                  <path d="M7.5 13.5 10 11" />
                  <path d="M10.5 16.5 13 14" />
                  <path d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z" />
                </svg>
                <p>Degraded</p>
              </>
            ) : (
              <span>Error: {error.message}</span>
            )}
          </span>

          <div className="updated">
            <h2>
              Última atualização:
              {new Date(data.updated_at).toLocaleString("pt-BR")}
            </h2>
          </div>

          <section className="database-info">
            <div>
              <h3>Database Version</h3>
              <h3>{data.dependencies.database_info.version}</h3>
              <h4>PostgreSQL</h4>
            </div>

            <div>
              <h3>Max Connections</h3>
              <h3>{data.dependencies.database_info.max_connections}</h3>
              <h4>Maximum allowed</h4>
            </div>

            <div>
              <h3>Open Connections</h3>
              <h3>{data.dependencies.database_info.opened_connections}</h3>
              <h4>Connection</h4>
            </div>
          </section>
        </>
      ) : (
        "Carregando..."
      )}
    </div>
  );
}
