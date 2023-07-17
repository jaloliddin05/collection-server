import { IItemsSearchBody } from '.';

interface IItemsSearchResult {
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _source: IItemsSearchBody;
    }>;
  };
}

export default IItemsSearchResult;
