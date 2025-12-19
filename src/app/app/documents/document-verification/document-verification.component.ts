import { CommonModule, NgClass, NgIf, NgFor, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-verification',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf, NgFor, DatePipe, FormsModule],
  templateUrl: './document-verification.component.html',
  styleUrls: ['./document-verification.component.css']
})
export class DocumentVerificationComponent implements OnInit {

  userId = "user-uuid";

  // ---------------- MOCK DATA ----------------
  userData: any = {
    userId: "user-uuid",
    documents: [
      {
        type: "PROFILE_PHOTO",
        url: "/api/documents/download/user-uuid/PROFILE_PHOTO",
        fileSize: 245678,
        uploadDate: "2025-01-25T10:00:00",
        status: "PENDING_VERIFICATION",
        fileName: "profile.jpg",
        contentType: "image/jpeg",
        rejectReason: ''
      },
      {
        type: "AADHAR_FRONT",
        url: "/api/documents/download/user-uuid/AADHAR_FRONT",
        fileSize: 512345,
        uploadDate: "2025-01-25T10:00:00",
        status: "PENDING_VERIFICATION",
        fileName: "aadhar_front.jpg",
        contentType: "image/jpeg",
        rejectReason: ''
      },
      {
        type: "AADHAR_BACK",
        url: "/api/documents/download/user-uuid/AADHAR_BACK",
        fileSize: 498765,
        uploadDate: "2025-01-25T10:00:00",
        status: "PENDING_VERIFICATION",
        fileName: "aadhar_back.jpg",
        contentType: "image/jpeg",
        rejectReason: ''
      }
    ],
    overallStatus: "PENDING_VERIFICATION",
    verificationDate: null,
    rejectionReason: null
  };

  rejectReason: string = "";
  showRejectPopup = false;
  currentDocument: any = null; // Track document being rejected

  constructor() {}

  ngOnInit(): void {}

  // ---------------- APPROVE SINGLE DOCUMENT ----------------
  approveDocument(doc: any) {
    doc.status = 'VERIFIED';
    doc.rejectReason = '';
    alert(`${doc.type.replace('_', ' ')} Approved!`);
  }

  // ---------------- REJECT SINGLE DOCUMENT ----------------
  openRejectPopup(doc: any) {
    this.currentDocument = doc;
    this.rejectReason = doc.rejectReason || '';
    this.showRejectPopup = true;
  }

  rejectDocument() {
    if (!this.rejectReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    this.currentDocument.status = 'REJECTED';
    this.currentDocument.rejectReason = this.rejectReason;
    alert(`${this.currentDocument.type.replace('_', ' ')} Rejected!\nReason: ${this.rejectReason}`);
    this.showRejectPopup = false;
    this.currentDocument = null;
    this.rejectReason = '';
  }

  cancelReject() {
    this.showRejectPopup = false;
    this.currentDocument = null;
    this.rejectReason = '';
  }

  // ---------------- APPROVE ALL ----------------
  approveDocuments() {
    this.userData.documents.forEach((doc: any) => {
      doc.status = 'VERIFIED';
      doc.rejectReason = '';
    });
    alert("All documents approved successfully!");
  }

  // ---------------- REJECT ALL ----------------
  openRejectAllPopup() {
    this.currentDocument = null; // null = all
    this.showRejectPopup = true;
  }

  rejectAllDocuments() {
    if (!this.rejectReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    this.userData.documents.forEach((doc: any) => {
      if (doc.status === 'PENDING_VERIFICATION') {
        doc.status = 'REJECTED';
        doc.rejectReason = this.rejectReason;
      }
    });
    alert("All pending documents rejected!\nReason: " + this.rejectReason);
    this.showRejectPopup = false;
    this.rejectReason = '';
  }

  // ---------------- DOWNLOAD ----------------
  downloadDocument(doc: any) {
    alert("Downloading " + doc.fileName);
  }
}
