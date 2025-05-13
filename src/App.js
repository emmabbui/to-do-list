import React, { useState } from "react";
import ItemList from "./components/ItemList";
import AddList from "./components/AddList"; // import the AddList component
import './styles.css'; // stylesheet

function App() {
  const [refreshItems, setRefreshItems] = useState(false);

  const handleRefresh = () => setRefreshItems(!refreshItems);

  return (
    <div className="app-container">
      <h1>To-Do / Checklist</h1>
      <AddList onAdd={handleRefresh} />
      <ItemList refreshItems={refreshItems} onRefresh={handleRefresh} />
    </div>
  );
}

export default App;
