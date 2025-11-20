import prisma from '@/lib/prisma';

export const resolvers = {
  Query: {
    async tickets(
      _parent: any,
      args: {
        filter?: {
          status?: string;
          search?: string;
          sortBy?: string;
        };
      }
    ) {
      const { filter } = args;

      let where: any = {};
      let orderBy: any = { createdAt: 'desc' };

      if (filter?.status) {
        where.status = filter.status;
      }

      if (filter?.search) {
        where.OR = [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      if (filter?.sortBy === 'priority') {
        orderBy = { priority: 'desc' };
      } else if (filter?.sortBy === 'updated') {
        orderBy = { updatedAt: 'desc' };
      }

      return prisma.ticket.findMany({
        where,
        orderBy,
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
    },

    async ticket(_parent: any, args: { id: string }) {
      return prisma.ticket.findUnique({
        where: { id: parseInt(args.id, 10) },
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
    },

    async users() {
      return prisma.user.findMany();
    },

    async labels() {
      return prisma.label.findMany();
    },
  },

  Mutation: {
    async createTicket(
      _parent: any,
      args: {
        input: {
          title: string;
          description: string;
          priority?: string;
          assigneeId?: string;
          dueDate?: string;
          labelIds?: string[];
        };
      }
    ) {
      const { input } = args;

      const ticket = await prisma.ticket.create({
        data: {
          title: input.title,
          description: input.description,
          priority: (input.priority || 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH',
          assigneeId: input.assigneeId ? parseInt(input.assigneeId, 10) : null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          labels: {
            create: (input.labelIds || []).map((labelId) => ({
              labelId: parseInt(labelId, 10),
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

      return ticket;
    },

    async updateTicket(
      _parent: any,
      args: {
        id: string;
        input: {
          title?: string;
          description?: string;
          status?: string;
          priority?: string;
          assigneeId?: string;
          dueDate?: string;
          labelIds?: string[];
        };
      }
    ) {
      const { id, input } = args;
      const numericId = parseInt(id, 10);

      // Update label relationships if provided
      if (input.labelIds) {
        // Delete existing labels
        await prisma.ticketLabel.deleteMany({
          where: { ticketId: numericId },
        });

        // Create new labels
        await prisma.ticketLabel.createMany({
          data: input.labelIds.map((labelId) => ({
            ticketId: numericId,
            labelId: parseInt(labelId, 10),
          })),
        });
      }

      const ticket = await prisma.ticket.update({
        where: { id: numericId },
        data: {
          ...(input.title && { title: input.title }),
          ...(input.description && { description: input.description }),
          ...(input.status && { status: input.status as 'OPEN' | 'IN_PROGRESS' | 'DONE' }),
          ...(input.priority && { priority: input.priority as 'LOW' | 'MEDIUM' | 'HIGH' }),
          ...(input.assigneeId !== undefined && {
            assigneeId: input.assigneeId ? parseInt(input.assigneeId, 10) : null,
          }),
          ...(input.dueDate !== undefined && {
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
          }),
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

      return ticket;
    },

    async deleteTicket(_parent: any, args: { id: string }) {
      await prisma.ticket.delete({
        where: { id: parseInt(args.id, 10) },
      });
      return true;
    },

    async addComment(
      _parent: any,
      args: {
        ticketId: string;
        content: string;
        userId?: string;
      }
    ) {
      const numericTicketId = parseInt(args.ticketId, 10);

      // Get the first user as default if userId not provided
      let userId: number;
      if (args.userId) {
        userId = parseInt(args.userId, 10);
      } else {
        let user = await prisma.user.findFirst();
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: 'System User',
              email: 'system@example.com',
            },
          });
        }
        userId = user.id;
      }

      const comment = await prisma.comment.create({
        data: {
          content: args.content,
          ticketId: numericTicketId,
          userId,
        },
        include: {
          user: true,
        },
      });

      return comment;
    },

    async deleteComment(_parent: any, args: { id: string }) {
      await prisma.comment.delete({
        where: { id: parseInt(args.id, 10) },
      });
      return true;
    },
  },
};
