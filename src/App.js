import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { Text, View } from "react-native";
import './App.css';
import { db } from "./firebase/firebaseConfig";
import logo from './logo.svg';
console.log("Firebase connected:", db);

export default function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} =>`, doc.data());
        });
        console.log("✅ Firestore connection successful!");
      } catch (error) {
        console.error("❌ Error connecting to Firestore:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Testing Firestore connection...</Text>
    </View>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
