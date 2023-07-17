import { Module } from '@nestjs/common';

import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './elastic-search.service';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
      auth: {
        username: 'jaloliddin',
        password: 'jaloliddin_0205',
      },
    }),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class ElasticSearchModule {}
