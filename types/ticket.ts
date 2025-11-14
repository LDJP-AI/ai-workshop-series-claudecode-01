export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  labels: Label[];
  assigneeId: string | null;
  assignee: User | null;
  dueDate: Date | null;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}
