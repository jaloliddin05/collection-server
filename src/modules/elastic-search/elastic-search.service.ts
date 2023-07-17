import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Item } from '../item/item.entity';
import {
  IItemsCountResult,
  IItemsSearchBody,
  IItemsSearchResult,
} from '../../infra/shared/interface';

@Injectable()
export class SearchService {
  fields = [
    'name',
    'collection.title',
    'collection.user.name',
    'comments',
    'fields',
  ];

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async ElasticIndex(data: any, index: string) {
    return await this.elasticsearchService.index({
      index,
      id: data.id,
      body: data,
    });
  }

  async ElasticCount(index: string) {
    const body = await this.elasticsearchService.count({
      index,
    });
    return body['count'];
  }

  async deleteAll(index: string) {
    await this.elasticsearchService.deleteByQuery({
      index,
      body: {
        query: {
          match_all: {},
        },
      },
      refresh: true,
    });
  }

  async ElasticSearch(text: string, index: string) {
    const { body } = await this.elasticsearchService.search<IItemsSearchBody>({
      index,
      body: {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: `*${text}*`,
                  fields: this.fields,
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
      },
    });

    const count = body['hits'].total;
    const hits = body['hits'].hits;
    const results = hits.map((item) => item._source);

    return {
      count: count['value'],
      results,
    };
  }

  async ElasticRemove(id: string, index: string) {
    this.elasticsearchService.deleteByQuery({
      index,
      body: {
        query: {
          match: {
            id,
          },
        },
      },
    });
  }

  async ElasticUpdate(data: any, index: string) {
    const newBody: IItemsSearchBody = data;
    return this.elasticsearchService.update({
      index,
      id: data.id,
      body: {
        doc: newBody,
      },
    });
  }
}
