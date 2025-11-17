import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLField,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLBoolean,
} from "graphql";
import { resolvers } from "./resolvers";

// Enums
const StatusEnum = new GraphQLEnumType({
  name: "Status",
  values: {
    OPEN: { value: "OPEN" },
    IN_PROGRESS: { value: "IN_PROGRESS" },
    DONE: { value: "DONE" },
  },
});

const PriorityEnum = new GraphQLEnumType({
  name: "Priority",
  values: {
    LOW: { value: "LOW" },
    MEDIUM: { value: "MEDIUM" },
    HIGH: { value: "HIGH" },
  },
});

// Types
export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    tickets: { type: new GraphQLList(TicketType) },
    comments: { type: new GraphQLList(CommentType) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const LabelType = new GraphQLObjectType({
  name: "Label",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    color: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    ticketId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
    user: { type: UserType },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const TicketType = new GraphQLObjectType({
  name: "Ticket",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(StatusEnum) },
    priority: { type: new GraphQLNonNull(PriorityEnum) },
    assigneeId: { type: GraphQLID },
    assignee: { type: UserType },
    labels: { type: new GraphQLList(LabelType) },
    comments: { type: new GraphQLList(CommentType) },
    dueDate: { type: GraphQLString },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// Input types
const TicketFilterInput = new GraphQLInputObjectType({
  name: "TicketFilterInput",
  fields: {
    status: { type: StatusEnum },
    search: { type: GraphQLString },
    sortBy: { type: GraphQLString },
  },
});

const CreateTicketInput = new GraphQLInputObjectType({
  name: "CreateTicketInput",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    priority: { type: PriorityEnum, defaultValue: "MEDIUM" },
    assigneeId: { type: GraphQLID },
    dueDate: { type: GraphQLString },
    labelIds: { type: new GraphQLList(GraphQLID) },
  },
});

const UpdateTicketInput = new GraphQLInputObjectType({
  name: "UpdateTicketInput",
  fields: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: StatusEnum },
    priority: { type: PriorityEnum },
    assigneeId: { type: GraphQLID },
    dueDate: { type: GraphQLString },
    labelIds: { type: new GraphQLList(GraphQLID) },
  },
});

// Root Query
const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    tickets: {
      type: new GraphQLList(TicketType),
      args: {
        filter: { type: TicketFilterInput },
      },
      resolve: resolvers.Query.tickets,
    },
    ticket: {
      type: TicketType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: resolvers.Query.ticket,
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: resolvers.Query.users,
    },
    labels: {
      type: new GraphQLList(LabelType),
      resolve: resolvers.Query.labels,
    },
  },
});

// Root Mutation
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createTicket: {
      type: TicketType,
      args: {
        input: { type: new GraphQLNonNull(CreateTicketInput) },
      },
      resolve: resolvers.Mutation.createTicket,
    },
    updateTicket: {
      type: TicketType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(UpdateTicketInput) },
      },
      resolve: resolvers.Mutation.updateTicket,
    },
    deleteTicket: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: resolvers.Mutation.deleteTicket,
    },
    addComment: {
      type: CommentType,
      args: {
        ticketId: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: resolvers.Mutation.addComment,
    },
    deleteComment: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: resolvers.Mutation.deleteComment,
    },
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
