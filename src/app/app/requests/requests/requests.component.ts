import { Component } from '@angular/core';
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
export class RequestsComponent {

  // 🔥 FIX 1: FILE BASE FOR IMAGES
  FILE_BASE = 'http://44.198.84.209:8085';

  constructor(private adminService: AdminService) {}

  requests: any[] = [];
  filteredRequests: any[] = [];

  selectedRequestId: string | null = null;
  selectedStatus: string = 'ALL';

  showModal = false;
  showDetails = false;

  details: any = null;

  showApprovePopup = false;
  showRejectPopup = false;

  approveComments = '';
  rejectReason = '';

  actionResult: any = null;

  // New Ride form
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

  ngOnInit() {
    this.loadRequests();
  }

  // -------------------------------------------------------
  // LOAD REQUESTS + FIX IMAGE URLS HERE
  // -------------------------------------------------------
  loadRequests() {
    this.adminService.getAllRequests().subscribe(res => {

      // 🔥 FIX 2: Convert backend image path to full path
      this.requests = res.data.content.map((r: any) => ({
        ...r,
        goodsPhoto1Url: r.goodsPhoto1Url
          ? this.fixImageUrl(r.goodsPhoto1Url)
          : null,

        goodsPhoto2Url: r.goodsPhoto2Url
          ? this.fixImageUrl(r.goodsPhoto2Url)
          : null
      }));

      this.filteredRequests = [...this.requests];
    });
  }

  // 🔥 FIX 3: Method to fix image URL properly
  fixImageUrl(url: string): string {
    if (!url) return '';

    // If backend already returns full URL → use as it is
    if (url.startsWith('http')) return url;

    // Otherwise append base URL
    return this.FILE_BASE + url;
  }


  toggleSelection(id: string) {
    this.selectedRequestId = this.selectedRequestId === id ? null : id;
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;

    if (status === 'ALL') {
      this.filteredRequests = [...this.requests];
      return;
    }

    if (status === 'PENDING') {
      this.adminService.getPendingRequests().subscribe(res => {
        this.filteredRequests = res.data.content.map((r:any) => ({
          ...r,
          goodsPhoto1Url: r.goodsPhoto1Url ? this.fixImageUrl(r.goodsPhoto1Url) : null,
          goodsPhoto2Url: r.goodsPhoto2Url ? this.fixImageUrl(r.goodsPhoto2Url) : null
        }));
      });
      return;
    }

    this.adminService.getRequestsByStatus(status).subscribe(res => {
      this.filteredRequests = res.data.content.map((r:any) => ({
        ...r,
        goodsPhoto1Url: r.goodsPhoto1Url ? this.fixImageUrl(r.goodsPhoto1Url) : null,
        goodsPhoto2Url: r.goodsPhoto2Url ? this.fixImageUrl(r.goodsPhoto2Url) : null
      }));
    });
  }

  // CREATE REQUEST
  openCreateRideModal() { this.showModal = true; }
  closeCreateRideModal() { this.showModal = false; }

  createRide() {
    this.adminService.createRequest(this.newRide).subscribe(() => {
      alert('Created Successfully');
      this.showModal = false;
      this.loadRequests();
    });
  }

  getCount(status: string): number {
    if (status === 'ALL') return this.requests.length;
    return this.requests.filter(r => r.status === status).length;
  }

  // APPROVE
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

  // REJECT
  reject(id: string) {
    this.selectedRequestId = id;
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
      this.actionResult = res;
      this.showRejectPopup = false;
      this.loadRequests();
    });
  }

  cancel(id: string) {
    this.adminService.cancel(id).subscribe(() => this.loadRequests());
  }

  // DETAILS MODAL
  openDetails() {
    if (!this.selectedRequestId) return;

    this.adminService.getRequestById(this.selectedRequestId).subscribe(res => {
      let data = res.data;

      // 🔥 FIX 4: Convert details photo URLs also
      data.goodsPhoto1Url = data.goodsPhoto1Url ? this.fixImageUrl(data.goodsPhoto1Url) : null;
      data.goodsPhoto2Url = data.goodsPhoto2Url ? this.fixImageUrl(data.goodsPhoto2Url) : null;

      this.details = data;
      this.showDetails = true;
    });
  }

  closeDetails() { this.showDetails = false; }

  closeActionCard() { this.actionResult = null; }
}
