import { RoomLobby } from "./rooms/components/room-lobby/room-lobby";
import styles from "./App.module.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { SignIn } from "./auth/components/sign_in/sign-in";
import { SignUp } from "./auth/components/sign_up/sign-up";
import { useEffect } from "react";
import { useSessionStore } from "./auth/store/session-store";

const router = createBrowserRouter([
  {
    path: "/rooms/:roomId",
    element: <RoomLobby />,
  },
  {
    path: "/login",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);

useEffect(() => {
  useSessionStore.getState().initFromStorage();
}, []);

export function App() {
  return (
    <div className={styles.page}>
      <RouterProvider router={router} />
    </div>
  );
}
