import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TreeTableModule } from 'primeng/treetable';
import { MultiSelectModule } from 'primeng/multiselect';

import { TreeNode } from 'primeng/api';

import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { ToastService } from '../../shared/service/toast-service';
import { MenuDto } from './model/menu-dto';
import { MenuService } from './service/menu-service';
import { ProfileService } from '../profiles/service/profile-service';
import { ProfileDto } from '../../core/auth/model/profile-dto';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';

interface PrimeIcon {
  name: string;
  camelName: string;
  as: string;
  from: string;
  tags: string[];
}

interface PrimeIconMetadata {
  framework: string;
  version: string;
  totalIcons: number;
  icons: PrimeIcon[];
}

@Component({
  selector: 'app-menu-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeTableModule,
    MultiSelectModule,
    DrawerComponent,
    Checkbox,
  ],
  templateUrl: './menu-settings.component.html',
  styleUrl: './menu-settings.component.scss',
})
export class MenuSettingsComponent implements OnInit {
  nodes: TreeNode<MenuDto>[] = [];

  profiles: ProfileDto[] = [];

  loading = false;
  saving = false;

  drawerVisible = false;

  selectedMenu: MenuDto | null = null;

  selectedProfileIds: number[] = [];

  selectedMenuName = '';
  selectedMenuIcon = '';
  selectedMenuSortOrder = 0;
  iconOptions = [];

  constructor(
    private readonly menuService: MenuService,
    private readonly profileService: ProfileService,
    private readonly toastService: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMenus();
    this.loadProfiles();
    this.loadIconOptions();
  }

  private loadMenus(): void {
    this.loading = true;

    this.menuService.getAllMenus().subscribe({
      next: (menus) => {
        this.nodes = menus.map((menu) => this.toTreeNode(menu));

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loading = false;

        this.toastService.error(error?.error?.message ?? 'Menüler yüklenirken bir hata oluştu.');

        this.cdr.markForCheck();
      },
    });
  }

  private loadProfiles(): void {
    this.profileService.findAll().subscribe({
      next: (profiles) => {
        this.profiles = profiles.filter((profile) => profile.active);

        this.cdr.markForCheck();
      },
      error: (error) => {
        this.toastService.error(error?.error?.message ?? 'Profiller yüklenirken bir hata oluştu.');
      },
    });
  }

  private loadIconOptions(): void {}

  private toTreeNode(menu: MenuDto): TreeNode<MenuDto> {
    return {
      key: String(menu.id),
      data: menu,
      children: menu.children?.map((child) => this.toTreeNode(child)),
    };
  }

  openEdit(menu: MenuDto): void {
    this.selectedMenu = menu;

    this.selectedMenuName = menu.name;
    this.selectedMenuIcon = menu.icon ?? '';
    this.selectedMenuSortOrder = menu.sortOrder;

    this.selectedProfileIds = [...(menu.profileIds ?? [])];

    this.drawerVisible = true;
  }

  closeDrawer(): void {
    if (this.saving) {
      return;
    }

    this.drawerVisible = false;
    this.selectedMenu = null;
    this.selectedProfileIds = [];
  }

  save(): void {
    if (!this.selectedMenu) return;

    this.saving = true;

    const request: MenuDto = {
      ...this.selectedMenu,
      name: this.selectedMenuName,
      icon: this.selectedMenuIcon,
      sortOrder: this.selectedMenuSortOrder,
      profileIds: [...this.selectedProfileIds],
    };

    this.menuService.update(request).subscribe({
      next: () => {
        this.saving = false;
        this.drawerVisible = false;
        this.selectedMenu = null;

        this.toastService.success('Menü başarıyla güncellendi.');

        this.loadMenus();
      },
      error: (error) => {
        this.saving = false;

        this.toastService.error(error?.error?.message ?? 'Menü güncellenirken bir hata oluştu.');

        this.cdr.markForCheck();
      },
    });
  }

  getProfileNames(menu: MenuDto): string {
    if (!menu.profileIds?.length) {
      return '—';
    }

    return menu.profileIds
      .map((id) => {
        const profile = this.profiles.find((item) => item.id === id);

        return profile?.name;
      })
      .filter(Boolean)
      .join(', ');
  }
}
