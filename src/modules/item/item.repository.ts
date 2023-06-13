import { Repository } from 'typeorm';

import { Item } from './item.entity';

export class ItemRepository extends Repository<Item> {}
