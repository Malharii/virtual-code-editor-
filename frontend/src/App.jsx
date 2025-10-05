import usePing from "./hooks/apis/queries/usePings.js";

function App() {
  const { isLoading, data } = usePing();
  if (isLoading) return <>loading</>;
  return <>helllo {data.message}</>;
}

export default App;
