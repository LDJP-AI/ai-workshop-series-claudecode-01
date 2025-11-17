export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketLabel {
  id: number;
  ticketId: number;
  labelId: number;
  label: Label;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  labels: TicketLabel[];
  assigneeId: number | null;
  assignee: User | null;
  dueDate: Date | null;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
