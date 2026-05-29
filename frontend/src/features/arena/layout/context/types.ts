export type PanelType = 'term' | 'ticket';

export interface PanelProps {
  dark: boolean;
  vmHost?: string;
  onDragStart: (e: React.DragEvent, type: PanelType) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, target: PanelType) => void;
  isDraggedOver: boolean;
}

export interface TicketData {
  id: string;
  title: string;
  description: string;
  reporter: string;
  duration: string;
  server: string;
  os: string;
  severity: 'Critique' | 'Moyen' | 'Mineur';
  objectives: { text: string; done: boolean; active: boolean }[];
}

export interface UserProfile {
  name: string;
  initials: string;
  /** Rôle métier de l'utilisateur connecté (ex. parcours apprenant). */
  role: string;
  /** Organisation / espace de formation affiché en en-tête de sidebar. */
  organization?: string;
}
