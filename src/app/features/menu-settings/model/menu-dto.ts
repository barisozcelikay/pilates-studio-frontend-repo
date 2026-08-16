import { BaseDto } from '../../../shared/model/base-dto';

export interface MenuDto extends BaseDto {
  code: string;
  name: string;
  icon: string | null;
  route: string | null;
  parentId: number | null;
  sortOrder: number;
  active: boolean;
  children: MenuDto[];
  profileIds: number[];
}

