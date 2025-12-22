import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../shared/admin.service';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  FILE_BASE = 'http://44.198.84.209:8085';

  constructor(private adminService: AdminService) {}

  // =========================
  // MASTER + VIEW DATA
  // =========================
  requests: any[] = [];          // MASTER DATA (never filtered)
  filteredRequests: any[] = [];  // after status filter
  pagedRequests: any[] = [];     // after pagination

  // =========================
  // PAGINATION
  // =========================
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  // =========================
  // STATE
  // =========================
  selectedRequestId: string | null = null;
  selectedStatus: string = 'ALL';

  showModal = false;
  showDetails = false;

  showApprovePopup = false;
  showRejectPopup = false;

  approveComments = '';
  rejectReason = '';

  details: any = null;
  actionResult: any = null;

  // =========================
  // CREATE
  // =========================
  newRide = {
    userName: '',
    fromLocation: '',
    toLocation: '',
    goodsDescription: '',
    fare: 0,
    comments: '',
    goodsPhoto1Url: '',
    goodsPhoto2Url: '',
    status: 'PENDING'
  };

  statusButtons = [
    { key: 'ALL', label: 'All', class: 'btn btn-outline-primary' },
    { key: 'PENDING', label: 'Pending', class: 'btn btn-outline-warning' },
    { key: 'APPROVED', label: 'Approved', class: 'btn btn-outline-success' },
    { key: 'REJECTED', label: 'Rejected', class: 'btn btn-outline-danger' },
    { key: 'CANCELLED', label: 'Cancelled', class: 'btn btn-outline-secondary' }
  ];

  // =========================
  // INIT
  // =========================
  ngOnInit() {
    this.loadRequests();
  }

  // =========================
  // LOAD REQUESTS (ONCE)
  // =========================
  loadRequests() {
    this.adminService.getAllRequests().subscribe(res => {
      this.requests = res.data.content.map((r: any) => ({
        ...r,
        goodsPhoto1Url: r.goodsPhoto1Url ? this.fixImageUrl(r.goodsPhoto1Url) : null,
        goodsPhoto2Url: r.goodsPhoto2Url ? this.fixImageUrl(r.goodsPhoto2Url) : null
      }));

      this.applyFilter('ALL');
    });
  }

  fixImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return this.FILE_BASE + url;
  }

  // =========================
  // FILTER (CLIENT SIDE ONLY)
  // =========================
  filterByStatus(status: string) {
    this.applyFilter(status);
  }

  applyFilter(status: string) {
    this.selectedStatus = status;
    this.currentPage = 1;

    if (status === 'ALL') {
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(
        r => r.status === status
      );
    }

    this.applyPagination();
  }

  // =========================
  // PAGINATION
  // =========================
  applyPagination() {
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredRequests.length / this.pageSize)
    );

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedRequests = this.filteredRequests.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyPagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyPagination();
    }
  }

  // =========================
  // COUNTS (ALWAYS MASTER)
  // =========================
  getCount(status: string): number {
    if (status === 'ALL') return this.requests.length;
    return this.requests.filter(r => r.status === status).length;
  }

  // =========================
  // SELECTION
  // =========================
  toggleSelection(id: string) {
    this.selectedRequestId = this.selectedRequestId === id ? null : id;
  }

  // =========================
  // CREATE
  // =========================
  openCreateRideModal() { this.showModal = true; }
  closeCreateRideModal() { this.showModal = false; }

  createRide() {
    this.adminService.createRequest(this.newRide).subscribe(() => {
      this.showModal = false;
      this.loadRequests();
    });
  }

  // =========================
  // APPROVE
  // =========================
  approve(id: string) {
    this.selectedRequestId = id;
    this.showApprovePopup = true;
  }

  submitApprove() {
    const adminId = localStorage.getItem('adminId')!;
    const adminName = localStorage.getItem('adminName')!;
    const adminPhone = localStorage.getItem('adminPhone')!;

    this.adminService.approve(
      this.selectedRequestId!,
      adminId,
      adminName,
      adminPhone,
      this.approveComments
    ).subscribe(res => {
      this.actionResult = res;
      this.showApprovePopup = false;
      this.loadRequests();
    });
  }

  // =========================
  // REJECT
  // =========================
  reject(id: string) {
    this.selectedRequestId = id;
    this.rejectReason = '';
    this.showRejectPopup = true;
  }

  submitReject() {
    const adminName = localStorage.getItem('adminName')!;
    const adminPhone = localStorage.getItem('adminPhone')!;

    this.adminService.reject(
      this.selectedRequestId!,
      adminName,
      adminPhone,
      this.rejectReason
    ).subscribe(res => {

      this.actionResult = { ...res, comments: this.rejectReason };

      const index = this.requests.findIndex(
        r => r.requestId === this.selectedRequestId
      );

      if (index !== -1) {
        this.requests[index].status = 'REJECTED';
        this.requests[index].comments = this.rejectReason;
      }

      this.applyFilter(this.selectedStatus);
      this.showRejectPopup = false;
    });
  }

  // =========================
  // CANCEL
  // =========================
  cancel(id: string) {
    this.adminService.cancel(id).subscribe(() => this.loadRequests());
  }

  // =========================
  // DETAILS
  // =========================
  openDetails() {
    if (!this.selectedRequestId) return;

    this.adminService.getRequestById(this.selectedRequestId).subscribe(res => {
      const data = res.data;

      data.comments =
        data.comments ||
        this.actionResult?.comments ||
        null;

      data.goodsPhoto1Url = data.goodsPhoto1Url ? this.fixImageUrl(data.goodsPhoto1Url) : null;
      data.goodsPhoto2Url = data.goodsPhoto2Url ? this.fixImageUrl(data.goodsPhoto2Url) : null;

      this.details = data;
      this.showDetails = true;
    });
  }

  closeDetails() { this.showDetails = false; }
  closeActionCard() { this.actionResult = null; }
}
