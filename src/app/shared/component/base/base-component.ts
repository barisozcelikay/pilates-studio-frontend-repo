import { ChangeDetectorRef, Directive, inject, OnInit } from '@angular/core';
import { BaseDto } from '../../model/base-dto';
import { BaseService } from '../../service/base-service';
import { ToastService } from '../../service/toast-service';

@Directive()
export abstract class BaseComponent<T extends BaseDto> implements OnInit {
  items: T[] = [];
  form: T;

  loading = false;
  saving = false;

  drawerVisible = false;
  editing = false;

  confirmVisible = false;
  itemToDelete: T | null = null;

  protected readonly toastService = inject(ToastService);

  protected constructor(
    protected readonly service: BaseService<T>,
    protected readonly cdr: ChangeDetectorRef,
    protected readonly dtoType: new () => T,
  ) {
    this.form = new dtoType();
  }

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.startLoading();

    this.service.findAll().subscribe({
      next: (items) => {
        this.items = items;
        this.stopLoading();
      },
      error: (error) => {
        this.toastService.error(error?.error?.message ?? 'Kayıtlar yüklenirken bir hata oluştu.');
        this.stopLoading();
      },
    });
  }

  public openCreateForm(): void {
    this.editing = false;
    this.form = new this.dtoType();
    this.drawerVisible = true;
  }

  protected openEditForm(item: T): void {
    this.editing = true;
    this.form = { ...item };
    this.drawerVisible = true;
  }

  protected save(): void {
    if (this.editing) {
      this.update(this.form);
      return;
    }

    this.create(this.form);
  }

  protected create(request: T): void {
    this.startSaving();

    this.service.create(request).subscribe({
      next: () => {
        this.stopSaving();
        this.toastService.success('Kayıt başarıyla oluşturuldu.');
        this.drawerVisible = false;
        this.load();
      },
      error: (error) => {
        this.stopSaving();

        this.toastService.error(error?.error?.message ?? 'Kayıt oluşturulurken bir hata oluştu.');
      },
    });
  }

  protected update(request: T): void {
    this.startSaving();

    this.service.update(request).subscribe({
      next: () => {
        this.stopSaving();
        this.toastService.success('Kayıt başarıyla güncellendi.');
        this.drawerVisible = false;
        this.load();
      },
      error: (error) => {
        this.stopSaving();

        this.toastService.error(error?.error?.message ?? 'Kayıt güncellenirken bir hata oluştu.');
      },
    });
  }

  protected confirmDelete(item: T): void {
    this.itemToDelete = item;
    this.confirmVisible = true;
  }

  protected delete(): void {
    if (!this.itemToDelete?.id) {
      return;
    }

    const id = this.itemToDelete.id;

    this.startLoading();

    this.service.delete(id).subscribe({
      next: () => {
        this.toastService.success('Kayıt başarıyla silindi.');
        this.itemToDelete = null;
        this.confirmVisible = false;
        this.load();
      },
      error: (error) => {
        this.toastService.error(error?.error?.message ?? 'Kayıt silinirken bir hata oluştu.');
        this.itemToDelete = null;
        this.confirmVisible = false;
        this.stopLoading();
      },
    });
  }

  protected startLoading(): void {
    this.loading = true;
    this.cdr.markForCheck();
  }

  protected stopLoading(): void {
    this.loading = false;
    this.cdr.markForCheck();
  }

  protected startSaving(): void {
    this.saving = true;
    this.cdr.markForCheck();
  }

  protected stopSaving(): void {
    this.saving = false;
    this.cdr.markForCheck();
  }
}
