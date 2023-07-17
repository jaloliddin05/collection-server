interface IItem {
  id: string;
  name: string;
  likesCount: number;
  collection: ICollection;
  tags: ITag[];
  fields: IField[];
  likedUsers: IUser[];
  comments: IComment[];
}

interface ICollection {
  id: string;
  title: string;
  likesCount: number;
  itemsCount: number;
  items: IItem[];
  user: IUser;
  likedUsers: IUser[];
}

interface IUser {
  id: string;
  password: string;
  name: string;
  email: string;
  role: number;
  status: boolean;
  createdAt: string;
  collections: ICollection[];
  likedCollections: ICollection[];
  likedItems: IItem[];
  comments: IComment[];
}

interface ITag {
  id: string;
  title: string;
  items: IItem[];
}

interface IField {
  id: string;
  type: string;
  key: string;
  value: string;
  item: IItem;
}

interface IComment {
  id: string;
  text: string;
  date: string;
  updatedDate: string;
  user: IUser;
  item: IItem;
}

interface IItemsSearchBody extends IItem {}

export default IItemsSearchBody;
