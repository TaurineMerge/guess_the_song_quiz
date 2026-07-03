import { RoomLobby } from "./rooms/components/room-lobby/room-lobby";
import styles from "./App.module.css";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/rooms/:roomId",
    element: <RoomLobby />,
  },
]);

export function App() {
  return (
    <div className={styles.page}>
      <RouterProvider router={router} />
    </div>
  );
}
