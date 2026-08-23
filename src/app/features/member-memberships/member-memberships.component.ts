import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { DrawerComponent } from '../../shared/component/drawer/drawer.component';
import { MemberService } from '../members/service/member-service';
import { MemberDto } from '../members/model/member-dto';
import { MembershipDto, MembershipService } from '../members/service/membership-service';
import { StudioPackageDto } from '../studio-packages/model/studio-package-dto';
import { StudioPackageService } from '../studio-packages/service/studio-package-service';

@Component({ selector: 'app-member-memberships', standalone: true, imports: [RouterLink, DatePipe, NgFor, NgIf, FormsModule, Select, Tabs, TabList, Tab, TabPanels, TabPanel, DrawerComponent], templateUrl: './member-memberships.component.html', styleUrl: './member-memberships.component.scss' })
export class MemberMembershipsComponent implements OnInit {
  member: MemberDto | null = null; memberships: MembershipDto[] = []; packages: StudioPackageDto[] = []; selectedPackageId: number | null = null; assigning = false; packageDrawerVisible = false;
  private memberId = 0;
  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly memberService: MemberService, private readonly membershipService: MembershipService, private readonly packageService: StudioPackageService, private readonly cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.memberId = Number(this.route.snapshot.paramMap.get('id')); this.member = (this.router.getCurrentNavigation()?.extras.state?.['member'] ?? history.state?.member ?? null) as MemberDto | null; this.memberService.findById(this.memberId).subscribe({next: value => this.member = value}); this.load(); }
  onTabChange(tab: string | number | undefined): void { if (tab === 'memberships') this.load(); }
  openPackageDrawer(): void { this.packageDrawerVisible = true; if (!this.packages.length) this.packageService.findAll().subscribe({next: values => this.packages = values.filter(value => value.active)}); }
  assign(): void { if (!this.selectedPackageId) return; this.assigning = true; this.membershipService.create(this.memberId, this.selectedPackageId).subscribe({next: () => { this.selectedPackageId = null; this.assigning = false; this.packageDrawerVisible = false; this.load(); }, error: () => this.assigning = false}); }
  private load(): void { this.membershipService.findAll(this.memberId).subscribe({next: values => { this.memberships = [...values]; this.cdr.detectChanges(); }}); }
}
