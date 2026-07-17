import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  User,
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../../services/firebase";

type UserProfile = {
  uid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  photoURL: string;
};

type UserContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
};

const UserContext =
  createContext<UserContextType>({
    user: null,
    profile: null,
    loading: true,
  });

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let unsubscribeProfile:
      | (() => void)
      | undefined;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {
          setUser(firebaseUser);

          if (unsubscribeProfile) {
            unsubscribeProfile();
            unsubscribeProfile =
              undefined;
          }

          if (firebaseUser) {
            unsubscribeProfile =
              onSnapshot(
                doc(
                  db,
                  "users",
                  firebaseUser.uid
                ),
                (snapshot) => {
                  if (snapshot.exists()) {
                    setProfile(
                      snapshot.data() as UserProfile
                    );
                  } else {
                    setProfile(null);
                  }

                  setLoading(false);
                }
              );
          } else {
            setProfile(null);
            setLoading(false);
          }
        }
      );

    return () => {
      unsubscribeAuth();

      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}