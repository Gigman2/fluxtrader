import { IUser } from "@/interfaces/account.interface";
import { pick } from "lodash";
import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

interface IAuthStore {
  isLoggedIn: boolean;
  isReady: boolean;
  authToken: string | null;
  user: IUser | null;
  setSession: (token: string, user?: IUser) => void;
  logout: () => void;
  setIsReady: (isReady: boolean) => void;
}

export const authStore = create(
  persist<IAuthStore>(
    (set) => ({
      isReady: false,
      authToken: null,
      isLoggedIn: false,
      user: null,
      setSession: (token: string, user?: IUser) => {
        set({
          authToken: token,
          isLoggedIn: token !== null,
          user,
        });
      },
      logout: () => {
        set({
          authToken: null,
          isLoggedIn: false,
          user: null,
        });
      },
      setIsReady: (isReady: boolean) => set({ isReady }),
    }),
    {
      name: "upsl-safe", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

const useAuth = (selector: Array<keyof IAuthStore>) => {
  const memo = useMemo(() => selector, [selector]);
  return authStore(useShallow((state) => pick(state, memo)));
};
export default useAuth;
