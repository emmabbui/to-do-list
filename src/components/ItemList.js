import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import DeleteItem from "./DeleteItem";
import EditItem from "./EditItem";
import AddItem from "./AddItem"; // import AddItem to add new items

const ItemList = ({ refreshItems, onRefresh }) => {
  const [lists, setLists] = useState([]);

  // fetch all lists and their respective items
  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "lists"));
      const listsArray = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const itemsSnapshot = await getDocs(
            collection(db, `lists/${doc.id}/items`)
          );
          const itemsArray = itemsSnapshot.docs.map((itemDoc) => ({
            ...itemDoc.data(),
            id: itemDoc.id,
          }));
          return { ...doc.data(), id: doc.id, items: itemsArray }; // include items in the list
        })
      );
      setLists(listsArray);
    } catch (e) {
      console.error("Error fetching items: ", e);
    }
  };

  // completion status of an item
  const handleToggleComplete = async (listId, itemId, isCompleted) => {
    const itemDoc = doc(db, `lists/${listId}/items`, itemId);
    try {
      await updateDoc(itemDoc, { completed: !isCompleted });
      onRefresh(); // refreshes to get an updated item
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [refreshItems]);

  return (
    <div className="item-list">
      {lists.map((list) => (
        <div key={list.id} className="list-container">
          <h3>{list.name}</h3>
          <AddItem listId={list.id} onAdd={onRefresh} /> {/* add items */}
          <EditItem listId={list.id} listName={list.name} onEditComplete={onRefresh} />
          <DeleteItem id={list.id} isList={true} onDeleteComplete={onRefresh} /> {/* Delete list */}
          <ul>
            {list.items.map((item) => (
              <li key={item.id} className={item.completed ? "completed" : ""}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.completed || false} // ensure it defaults to false if not set
                    onChange={() => handleToggleComplete(list.id, item.id, item.completed)}
                  />
                  {item.name} (x{item.quantity})
                </label>
                <EditItem
                  listId={list.id}
                  itemId={item.id}
                  itemName={item.name}
                  onEditComplete={onRefresh}
                />
                <DeleteItem id={item.id} listId={list.id} isList={false} onDeleteComplete={onRefresh} /> {/* Delete item */}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
