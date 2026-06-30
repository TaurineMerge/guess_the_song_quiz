import { RoomLobby } from "./rooms/components/room-lobby/room-lobby";
import styles from "./App.module.css";

export function App() {
  return (
    <div className={styles.page}>
      <RoomLobby />
    </div>
  );
}
