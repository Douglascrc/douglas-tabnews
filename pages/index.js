import BuildAnimation from "./interface/components/buildAnimation.js";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <BuildAnimation />
    </div>
  );
}

export default Home;
