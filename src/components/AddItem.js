import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";  // using firebase as path

const AddItem = ({ listId, onAdd }) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddItem = async () => {
    if (itemName.trim() === "" || !listId) return;

    // adds item to the specific list
    const itemData = { name: itemName, quantity };
    await addDoc(collection(db, `lists/${listId}/items`), itemData);

    setItemName(""); // reset item name input, quantity
    setQuantity(1); 
    onAdd();        
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Item name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
      />
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
};

export default AddItem;
