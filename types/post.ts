export type Tag = {
  id: number;
  x: number;
  y: number;
  username: string;
  imageIndex: number;
};

export type Post = {
  id: string;
  imageUrls: string[];
  caption: string;
  tags: Tag[];
  user: {
    id: string | undefined;
    username: string | null;
  };
  fileCount: number | undefined;
  createdAt: number;
  likeCount: number;
  commentCount: number;
};
