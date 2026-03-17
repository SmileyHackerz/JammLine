import { ReactNode } from "react";

// On dit à TypeScript de ne pas s'inquiéter, ces éléments existent bien !
declare module "@monprojet/shared" {
  // Les Constantes
  export const NOTIFICATION_CATEGORIES: any;

  // Les Contextes (Hooks)
  export function useApp(): any;
  export function useAuth(): any;

  // Les Providers (Composants)
  export function AppProvider(props: { children: ReactNode }): JSX.Element;
  export function AuthProvider(props: {
    children: ReactNode;
    storage?: any;
  }): JSX.Element;
}
