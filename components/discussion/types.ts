export interface Profile {
  full_name: string | null;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string;
  status: string;
  created_at: string;
  profiles: Profile;
  reply_count: number;
  upvotes: number;
  downvotes: number;
  myVote: number;
}

export interface Reply {
  id: string;
  user_id: string;
  post_id: string;
  parent_reply_id: string | null;
  content: string;
  created_at: string;
  profiles: Profile;
  replies?: Reply[]; // for nested replies
}
