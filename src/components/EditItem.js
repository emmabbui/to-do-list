import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // path to firebase
import { useState } from "react";

const EditItem = ({ listId, itemId, listName, itemName, onEditComplete }) => {
  const [name, setName] = useState(listName || itemName);  // handle both list & item names
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  const handleEdit = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    // determines whether to edit a list or an item
    const docRef = itemId
      ? doc(db, `lists/${listId}/items`, itemId)
      : doc(db, "lists", listId);

    setIsEditing(true);

    try {
      await updateDoc(docRef, { name });
      setIsEditing(false);
      setError(null);
      onEditComplete();
    } catch (e) {
      setIsEditing(false);
      setError("Error updating name.");
      console.error("Error updating name: ", e);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleEdit} disabled={isEditing}>
        {isEditing ? "Updating..." : "Update"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default EditItem;
