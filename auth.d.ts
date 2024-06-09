declare module "#auth-utils" {
  interface User {
    id: string;
  }

  interface UserSession {
    user: {
      id: string;
    };
  }
}

export {};
