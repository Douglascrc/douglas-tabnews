import useSWR from "swr";
import styles from "./status.module.css";
import "app/global.css";

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
    <div className={styles.status}>
      <h1>Status</h1>
      {!isLoading ? (
        <>
          <span>
            {data &&
            data.dependencies.database_info.database_status === "healthy" ? (
              <div className={styles.icons}>
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

          <div className={styles.updated}>
            <h2>
              Última atualização:
              {new Date(data.updated_at).toLocaleString("pt-BR")}
            </h2>
          </div>

          <section className={styles.databaseInfo}>
            <div>
              <h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-database"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                  <path d="M3 12A9 3 0 0 0 21 12" />
                </svg>
                Database Version
              </h2>

              <h3>{data.dependencies.database_info.version}</h3>
              <h4>PostgreSQL</h4>
            </div>

            <div>
              <h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-network"
                >
                  <rect x="16" y="16" width="6" height="6" rx="1" />
                  <rect x="2" y="16" width="6" height="6" rx="1" />
                  <rect x="9" y="2" width="6" height="6" rx="1" />
                  <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                  <path d="M12 12V8" />
                </svg>
                Max Connections
              </h2>
              <h3>{data.dependencies.database_info.max_connections}</h3>
              <h4>Maximum allowed</h4>
            </div>

            <div>
              <h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-users"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Open Connections
              </h2>
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
