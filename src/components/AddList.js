import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase"; // path to firebase

const AddList = ({ onAdd }) => {
  const [listName, setListName] = useState("");

  const handleAddList = async () => {
    if (!listName.trim()) return;

    // new list to cloud firestore
    try {
      await addDoc(collection(db, "lists"), {
        name: listName,
      });

      setListName("");  // reset input after adding
      onAdd();          // trigger refresh of the list
    } catch (error) {
      console.error("Error adding list: ", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="New list name"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
      <button onClick={handleAddList}>Add List</button>
    </div>
  );
};

export default AddList;
