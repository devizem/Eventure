// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Events {
  export enum IndexField {
    CATEGORY = 'category',
    PUBLISHED_AT = 'publishedAt',
    CREATED_AT = 'createdAt',
    TAG = 'tags',
  }

  export const COLLECTION = 'events';
}

export class Eventure {
  id: string;
  name: string;
  description?: string;
  picture?: string;
  category: string;
  tags: string;
  startDate: string = null; // 2018-10-09T16:18:45Z
  endDate: string = null; // 2018-10-09T16:18:45Z
  createdAt: string = null; // 2018-10-09T16:18:45Z
  modifiedAt: string = null; // 2018-10-09T16:18:45Z
  publishedAt: string = null; // 2018-10-09T16:18:45Z

  constructor(props: any) {
    Object.entries(props).forEach(([key, value]) => (this[key] = value));
  }
}
