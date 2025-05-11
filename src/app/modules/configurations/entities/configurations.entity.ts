import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { Tenant } from '../../tenants/entities/tenants.entity';

@Entity()
@Index(['tenantId'])
export class Configurations extends BaseModel {
    @OneToOne(() => Tenant, tenant => tenant.configurations)
    @JoinColumn({ name: 'tenantId' })
    tenant: Tenant;

    @Column({ type: 'uuid' })
    tenantId: string;

    // Appearance Settings
    @Column({ type: 'jsonb', nullable: true })
    themeSettings: {
        primaryColor: string;
        secondaryColor: string;
        darkMode: boolean;
        fontFamily: string;
    };

    @Column({ type: 'jsonb', nullable: true })
    logos: {
        desktop: string;
        mobile: string;
        favicon: string;
        brandName: string;
    };

    // Social Media Configuration
    @Column({ type: 'jsonb', nullable: true })
    socialMedias: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        youtube: string;
        tiktok: string;
    };

    // Module Management
    @Column({ type: 'jsonb', nullable: true })
    enabledModules: {
        moduleName: string;
        isEnabled: boolean;
        permissions: string[];
    }[];

    // Contact Information
    @Column({ type: 'jsonb', nullable: true })
    contactInformation: {
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        country?: string;
        postalCode?: string;
    };

    // Security Settings
    @Column({ type: 'jsonb', nullable: true })
    securitySettings: {
        requireTwoFactorAuth: boolean;
        passwordComplexity: number;
        sessionTimeout: number;
        loginAttemptsLimit: number;
    };

    // Payment Configuration
    @Column({ type: 'jsonb', nullable: true })
    paymentConfiguration: {
        currency: string;
        paymentGateway: string;
        apiKey: string;
        sandboxMode: boolean;
    };

    // SEO Settings
    @Column({ type: 'jsonb', nullable: true })
    seoSettings: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
        canonicalUrl: string;
    };

    // Localization
    @Column({ type: 'jsonb', nullable: true })
    localization: {
        timezone: string;
        dateFormat: string;
        timeFormat: string;
        defaultLanguage: string;
        supportedLanguages: string[];
    };

    // Analytics
    @Column({ type: 'jsonb', nullable: true })
    analytics: {
        googleAnalyticsId: string;
        trackingPixel: string;
        heatmapEnabled: boolean;
    };

    // Custom Fields
    @Column({ type: 'jsonb', nullable: true })
    customFields: Array<{
        fieldName: string;
        fieldType: string;
        fieldValue: any;
    }>;
}