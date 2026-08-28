import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authenticateStudent, getStudentByStudentNo } from "../services/projectService";

/**
 * AuthContext
 * ------------------------------------------------------------------
 * Holds ONLY the authenticated student's studentNo (plus a cached copy
 * of their public profile for convenience). Every "my data" query in the
 * app must derive from this context — never from the URL or from
 * whichever project happens to be on screen. That's what keeps Patrick
 * from ever being able to see Walter's requirement progress.
 *
 * This is intentionally a thin, swappable layer: when real auth arrives
 * (Google Apps Script verifying the student server-side), only the
 * `login` function body needs to change.
 * ------------------------------------------------------------------
 */

const AuthContext = createContext(undefined);

const STORAGE_KEY = "technopreneurship_auth_student_no";

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // True only while we're checking sessionStorage for an existing session
  // on first load — lets ProtectedRoute avoid a flash-redirect to /login
  // before we've had a chance to restore the session.
  const [isRestoring, setIsRestoring] = useState(true);

  // On mount, restore the session if the browser tab still has a
  // remembered studentNo (e.g. after a page refresh). We re-fetch the
  // student's public profile rather than trusting stored data, so this
  // mirrors how a real server-side session check would behave later.
  useEffect(() => {
    const storedStudentNo = sessionStorage.getItem(STORAGE_KEY);
    if (!storedStudentNo) {
      setIsRestoring(false);
      return;
    }

    let isCurrent = true;
    getStudentByStudentNo(storedStudentNo).then((found) => {
      if (!isCurrent) return;
      if (found) {
        setStudent(found);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      setIsRestoring(false);
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  const login = useCallback(async (studentNo, pin) => {
    setIsLoading(true);
    try {
      const matched = await authenticateStudent(studentNo, pin);
      if (matched) {
        setStudent(matched);
        sessionStorage.setItem(STORAGE_KEY, matched.studentNo);
        return { success: true };
      }
      return { success: false, message: "Student number or PIN is incorrect." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setStudent(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    student, // { studentNo, name, section, groupCode } | null
    isAuthenticated: Boolean(student),
    isLoading,
    isRestoring,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
