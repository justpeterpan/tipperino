declare module "#auth-utils" {
  interface User {
    id: string;
    name?: string;
  }

  interface UserSession {
    user: {
      id: string;
      name?: string;
    };
  }
}

export {};
