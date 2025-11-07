export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  taskId: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface CommentsResponse {
  items: Comment[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
