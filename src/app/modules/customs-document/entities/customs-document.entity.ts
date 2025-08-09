import { Entity, Column, ManyToOne } from 'typeorm';
import { Shipment } from '../../shipment/entities/shipment.entity';
import { BaseModel } from '@root/src/database/base.model';

export enum DocumentType {
  COMMERCIAL_INVOICE = 'commercial_invoice',
  PACKING_LIST = 'packing_list',
  BILL_OF_LADING = 'bill_of_lading',
  CERTIFICATE_OF_ORIGIN = 'certificate_of_origin',
  EXPORT_LICENSE = 'export_license',
  IMPORT_LICENSE = 'import_license',
  CUSTOMS_DECLARATION = 'customs_declaration',
  INSURANCE_CERTIFICATE = 'insurance_certificate',
  INSPECTION_CERTIFICATE = 'inspection_certificate',
  HEALTH_CERTIFICATE = 'health_certificate',
  PHYTOSANITARY_CERTIFICATE = 'phytosanitary_certificate',
  FDA_CERTIFICATE = 'fda_certificate',
  DANGEROUS_GOODS_DECLARATION = 'dangerous_goods_declaration'
}

export enum DocumentStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

@Entity('customs_documents')
export class CustomsDocument extends BaseModel {
  @Column()
  documentNumber: string;

  @Column({
    type: 'enum',
    enum: DocumentType
  })
  type: DocumentType;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.DRAFT
  })
  status: DocumentStatus;

  @Column()
  issuedDate: Date;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  issuingAuthority: string;

  @Column({ nullable: true })
  issuingCountry: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('json', { nullable: true })
  content: any; 

  @Column('json', { nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  declaredValue: number;

  @Column({ nullable: true })
  currency: string;

  @Column('json', { nullable: true })
  hsCodeInfo: {
    hsCode: string;
    description: string;
    dutyRate: number;
    taxRate: number;
  }[];

  @Column('text', { nullable: true })
  notes: string;

  @Column({ default: false })
  requiresApproval: boolean;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ nullable: true })
  approvedDate: Date;

  @ManyToOne(() => Shipment, shipment => shipment.customsDocuments)
  shipment: Shipment;
}
