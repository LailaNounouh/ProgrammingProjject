import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    };

    fetchData();
  }, []);

  const addUser = async () => {
    await addDoc(collection(db, "users"), {
      name: "Nieuwe Gebruiker",
      age: 25
    });
  };

  return (
    <div>
      <h1>Gebruikers</h1>
      <button onClick={addUser}>Voeg gebruiker toe</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} ({user.age})</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
