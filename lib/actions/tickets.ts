'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Ticket, TicketStatus, Priority, Comment, User } from '@/types/ticket';
import { getTickets, users, labels } from '@/lib/data/tickets';

// In-memory storage for tickets (same as in lib/data/tickets.ts for now)
// Note: In Phase 3, this will be replaced with proper API calls
let tickets: Ticket[] = [];

// Initialize tickets on first load
async function initializeTickets() {
  if (tickets.length === 0) {
    tickets = await getTickets();
  }
}

// Get assignee by ID
function getAssigneeById(assigneeId: string | null): User | null {
  if (!assigneeId) return null;
  return users.find(u => u.id === assigneeId) || null;
}

// Get labels from form data
function getLabelsFromFormData(formData: FormData) {
  const selectedLabelIds: string[] = [];
  labels.forEach(label => {
    if (formData.get(`label-${label.id}`)) {
      selectedLabelIds.push(label.id);
    }
  });
  return labels.filter(l => selectedLabelIds.includes(l.id));
}

export async function createTicket(formData: FormData) {
  await initializeTickets();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string;
  const assigneeId = (formData.get('assigneeId') as string) || null;
  const dueDateString = formData.get('dueDate') as string;
  const dueDate = dueDateString ? new Date(dueDateString) : null;

  // Basic validation
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }

  if (!description || description.length < 10) {
    return { error: 'Description must be at least 10 characters' };
  }

  const selectedLabels = getLabelsFromFormData(formData);

  const newTicket: Ticket = {
    id: Date.now().toString(),
    title,
    description,
    status: 'OPEN',
    priority: (priority as Priority) || 'MEDIUM',
    labels: selectedLabels,
    assigneeId: assigneeId || null,
    assignee: getAssigneeById(assigneeId),
    dueDate,
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tickets.push(newTicket);

  revalidatePath('/tickets');
  revalidatePath('/');
  redirect(`/tickets/${newTicket.id}`);
}

export async function updateTicket(id: string, formData: FormData) {
  await initializeTickets();

  const ticketIndex = tickets.findIndex((t) => t.id === id);
  if (ticketIndex === -1) {
    return { error: 'Ticket not found' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string;
  const assigneeId = (formData.get('assigneeId') as string) || null;
  const dueDateString = formData.get('dueDate') as string;
  const dueDate = dueDateString ? new Date(dueDateString) : null;

  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }

  if (!description || description.length < 10) {
    return { error: 'Description must be at least 10 characters' };
  }

  const selectedLabels = getLabelsFromFormData(formData);

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    title,
    description,
    priority: (priority as Priority) || 'MEDIUM',
    labels: selectedLabels,
    assigneeId: assigneeId || null,
    assignee: getAssigneeById(assigneeId),
    dueDate,
    updatedAt: new Date(),
  };

  revalidatePath(`/tickets/${id}`);
  revalidatePath('/tickets');
  revalidatePath('/');
  redirect(`/tickets/${id}`);
}

export async function updateTicketStatus(id: string, status: TicketStatus) {
  await initializeTickets();

  const ticketIndex = tickets.findIndex((t) => t.id === id);
  if (ticketIndex === -1) {
    return { error: 'Ticket not found' };
  }

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    status,
    updatedAt: new Date(),
  };

  revalidatePath(`/tickets/${id}`);
  revalidatePath('/tickets');
  revalidatePath('/');

  return { success: true };
}

export async function deleteTicket(id: string) {
  await initializeTickets();

  const ticketIndex = tickets.findIndex((t) => t.id === id);
  if (ticketIndex === -1) {
    return { error: 'Ticket not found' };
  }

  tickets.splice(ticketIndex, 1);

  revalidatePath('/tickets');
  revalidatePath('/');
  redirect('/tickets');
}

// Comment actions
export async function addComment(ticketId: string, content: string) {
  await initializeTickets();

  const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
  if (ticketIndex === -1) {
    return { error: 'Ticket not found' };
  }

  if (!content || content.trim().length === 0) {
    return { error: 'Comment cannot be empty' };
  }

  if (content.length < 2) {
    return { error: 'Comment must be at least 2 characters' };
  }

  // Default user for comments (in real app, would use authenticated user)
  const currentUser: User = {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const newComment: Comment = {
    id: Date.now().toString(),
    content,
    authorId: currentUser.id,
    author: currentUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tickets[ticketIndex].comments.push(newComment);
  tickets[ticketIndex].updatedAt = new Date();

  revalidatePath(`/tickets/${ticketId}`);

  return { success: true, comment: newComment };
}

export async function deleteComment(ticketId: string, commentId: string) {
  await initializeTickets();

  const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
  if (ticketIndex === -1) {
    return { error: 'Ticket not found' };
  }

  const commentIndex = tickets[ticketIndex].comments.findIndex(
    (c) => c.id === commentId
  );
  if (commentIndex === -1) {
    return { error: 'Comment not found' };
  }

  tickets[ticketIndex].comments.splice(commentIndex, 1);
  tickets[ticketIndex].updatedAt = new Date();

  revalidatePath(`/tickets/${ticketId}`);

  return { success: true };
}
