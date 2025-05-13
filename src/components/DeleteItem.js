import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // ensures path to firebase

const DeleteItem = ({ id, listId, isList, onDeleteComplete }) => {
  const handleDelete = async () => {
    if (!id) return;

    try {
      if (isList) {
        // if deleting a list, delete all its items first and then altogether
        const itemsCollection = collection(db, `lists/${id}/items`);
        const itemsSnapshot = await getDocs(itemsCollection);
        const deletePromises = itemsSnapshot.docs.map((itemDoc) =>
          deleteDoc(itemDoc.ref)
        );
        await Promise.all(deletePromises);

        // deletes the list itself
        await deleteDoc(doc(db, "lists", id));
      } else {
        // deletes an item individually
        await deleteDoc(doc(db, `lists/${listId}/items`, id));
      }

      onDeleteComplete();
    } catch (e) {
      console.error("Error deleting item: ", e);
    }
  };

  return (
    <button onClick={handleDelete}>
      Delete
    </button>
  );
};

export default DeleteItem;
