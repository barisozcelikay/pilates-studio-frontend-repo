export interface MenuDto {
  id: number;
  code: string;
  name: string;
  icon: string | null;
  route: string | null;
  parentId: number | null;
  sortOrder: number;
  active: boolean;
  children: MenuDto[];
}
