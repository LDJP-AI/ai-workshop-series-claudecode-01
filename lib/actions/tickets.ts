'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getLabels, getUsers } from '@/lib/data/tickets';

export async function createTicket(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = (formData.get('priority') as string) || 'MEDIUM';
  const assigneeIdStr = formData.get('assigneeId') as string;
  const assigneeId = assigneeIdStr ? parseInt(assigneeIdStr, 10) : null;
  const dueDateString = formData.get('dueDate') as string;
  const dueDate = dueDateString ? new Date(dueDateString) : null;

  // Basic validation
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }

  if (!description || description.length < 10) {
    return { error: 'Description must be at least 10 characters' };
  }

  // Get selected labels from form data
  const allLabels = await getLabels();
  const selectedLabelIds: number[] = [];
  allLabels.forEach((label) => {
    if (formData.get(`label-${label.id}`)) {
      selectedLabelIds.push(label.id);
    }
  });

  const newTicket = await prisma.ticket.create({
    data: {
      title,
      description,
      status: 'OPEN',
      priority: priority as 'LOW' | 'MEDIUM' | 'HIGH',
      assigneeId,
      dueDate,
      labels: {
        create: selectedLabelIds.map((labelId) => ({
          labelId,
        })),
      },
    },
    include: {
      assignee: true,
      labels: {
        include: {
          label: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
  });

  revalidatePath('/tickets');
  revalidatePath('/');
  redirect(`/tickets/${newTicket.id}`);
}

export async function updateTicket(id: string, formData: FormData) {
  const numericId = parseInt(id, 10);
  
  const ticketExists = await prisma.ticket.findUnique({
    where: { id: numericId },
  });

  if (!ticketExists) {
    return { error: 'Ticket not found' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const priority = (formData.get('priority') as string) || 'MEDIUM';
  const assigneeIdStr = formData.get('assigneeId') as string;
  const assigneeId = assigneeIdStr ? parseInt(assigneeIdStr, 10) : null;
  const dueDateString = formData.get('dueDate') as string;
  const dueDate = dueDateString ? new Date(dueDateString) : null;

  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }

  if (!description || description.length < 10) {
    return { error: 'Description must be at least 10 characters' };
  }

  // Get selected labels from form data
  const allLabels = await getLabels();
  const selectedLabelIds: number[] = [];
  allLabels.forEach((label) => {
    if (formData.get(`label-${label.id}`)) {
      selectedLabelIds.push(label.id);
    }
  });

  // Delete existing labels and create new ones
  await prisma.ticketLabel.deleteMany({
    where: { ticketId: numericId },
  });

  const updatedTicket = await prisma.ticket.update({
    where: { id: numericId },
    data: {
      title,
      description,
      priority: priority as 'LOW' | 'MEDIUM' | 'HIGH',
      assigneeId,
      dueDate,
      labels: {
        create: selectedLabelIds.map((labelId) => ({
          labelId,
        })),
      },
    },
    include: {
      assignee: true,
      labels: {
        include: {
          label: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
  });

  revalidatePath(`/tickets/${id}`);
  revalidatePath('/tickets');
  revalidatePath('/');
  redirect(`/tickets/${id}`);
}

export async function updateTicketStatus(id: string, status: string) {
  const numericId = parseInt(id, 10);
  
  const ticketExists = await prisma.ticket.findUnique({
    where: { id: numericId },
  });

  if (!ticketExists) {
    return { error: 'Ticket not found' };
  }

  await prisma.ticket.update({
    where: { id: numericId },
    data: { status: status as 'OPEN' | 'IN_PROGRESS' | 'DONE' },
  });

  revalidatePath(`/tickets/${id}`);
  revalidatePath('/tickets');
  revalidatePath('/');

  return { success: true };
}

export async function deleteTicket(id: string) {
  const numericId = parseInt(id, 10);
  
  const ticketExists = await prisma.ticket.findUnique({
    where: { id: numericId },
  });

  if (!ticketExists) {
    return { error: 'Ticket not found' };
  }

  await prisma.ticket.delete({
    where: { id: numericId },
  });

  revalidatePath('/tickets');
  revalidatePath('/');
  redirect('/tickets');
}

// Comment actions
export async function addComment(ticketId: string, content: string) {
  const numericTicketId = parseInt(ticketId, 10);
  
  const ticketExists = await prisma.ticket.findUnique({
    where: { id: numericTicketId },
  });

  if (!ticketExists) {
    return { error: 'Ticket not found' };
  }

  if (!content || content.trim().length === 0) {
    return { error: 'Comment cannot be empty' };
  }

  if (content.length < 2) {
    return { error: 'Comment must be at least 2 characters' };
  }

  // Get the first user as default (or create one if none exists)
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'System User',
        email: 'system@example.com',
      },
    });
  }

  const newComment = await prisma.comment.create({
    data: {
      content,
      ticketId: numericTicketId,
      userId: user.id,
    },
    include: {
      user: true,
    },
  });

  revalidatePath(`/tickets/${ticketId}`);

  return { success: true, comment: newComment };
}

export async function deleteComment(ticketId: string, commentId: string) {
  const numericTicketId = parseInt(ticketId, 10);
  const numericCommentId = parseInt(commentId, 10);
  
  const ticketExists = await prisma.ticket.findUnique({
    where: { id: numericTicketId },
  });

  if (!ticketExists) {
    return { error: 'Ticket not found' };
  }

  const commentExists = await prisma.comment.findUnique({
    where: { id: numericCommentId },
  });

  if (!commentExists) {
    return { error: 'Comment not found' };
  }

  await prisma.comment.delete({
    where: { id: numericCommentId },
  });

  revalidatePath(`/tickets/${ticketId}`);

  return { success: true };
}
