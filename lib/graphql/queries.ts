import { gql } from '@apollo/client';

export const GET_TICKETS = gql`
  query GetTickets($filter: TicketFilterInput) {
    tickets(filter: $filter) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
      assignee {
        id
        name
        email
      }
      labels {
        label {
          id
          name
          color
        }
      }
      comments {
        id
        content
        createdAt
        user {
          id
          name
          email
        }
      }
    }
  }
`;

export const GET_TICKET = gql`
  query GetTicket($id: String!) {
    ticket(id: $id) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
      assignee {
        id
        name
        email
      }
      labels {
        label {
          id
          name
          color
        }
      }
      comments {
        id
        content
        createdAt
        user {
          id
          name
          email
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export const GET_LABELS = gql`
  query GetLabels {
    labels {
      id
      name
      color
    }
  }
`;

export const CREATE_TICKET = gql`
  mutation CreateTicket($input: CreateTicketInput!) {
    createTicket(input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
      assignee {
        id
        name
        email
      }
      labels {
        label {
          id
          name
          color
        }
      }
      comments {
        id
        content
        createdAt
        user {
          id
          name
          email
        }
      }
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($id: String!, $input: UpdateTicketInput!) {
    updateTicket(id: $id, input: $input) {
      id
      title
      description
      status
      priority
      dueDate
      createdAt
      updatedAt
      assignee {
        id
        name
        email
      }
      labels {
        label {
          id
          name
          color
        }
      }
      comments {
        id
        content
        createdAt
        user {
          id
          name
          email
        }
      }
    }
  }
`;

export const DELETE_TICKET = gql`
  mutation DeleteTicket($id: String!) {
    deleteTicket(id: $id)
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($ticketId: String!, $content: String!, $userId: String!) {
    addComment(ticketId: $ticketId, content: $content, userId: $userId) {
      id
      content
      createdAt
      user {
        id
        name
        email
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id)
  }
`;
