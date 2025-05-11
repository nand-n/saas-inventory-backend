import {
  IsUUID,
  IsOptional,
  ValidateNested,
  IsString,
  IsBoolean,
  IsArray,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  IsUrl,
  IsISO31661Alpha2,
} from 'class-validator';
import { Type } from 'class-transformer';

class ThemeSettingsDto {
  @IsString()
  primaryColor: string;

  @IsString()
  secondaryColor: string;

  @IsBoolean()
  darkMode: boolean;

  @IsString()
  fontFamily: string;
}

class LogosDto {
  @IsUrl()
  desktop: string;

  @IsUrl()
  mobile: string;

  @IsUrl()
  favicon: string;

  @IsString()
  brandName: string;
}

class SocialMediasDto {
  @IsUrl()
  facebook: string;

  @IsUrl()
  twitter: string;

  @IsUrl()
  instagram: string;

  @IsUrl()
  linkedin: string;

  @IsUrl()
  youtube: string;

  @IsUrl()
  tiktok: string;
}

class EnabledModuleDto {
  @IsString()
  moduleName: string;

  @IsBoolean()
  isEnabled: boolean;

  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}

class ContactInformationDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsISO31661Alpha2()
  country: string;

  @IsString()
  postalCode: string;
}

class SecuritySettingsDto {
  @IsBoolean()
  requireTwoFactorAuth: boolean;

  @IsNumber()
  passwordComplexity: number;

  @IsNumber()
  sessionTimeout: number;

  @IsNumber()
  loginAttemptsLimit: number;
}

class PaymentConfigurationDto {
  @IsString()
  currency: string;

  @IsString()
  paymentGateway: string;

  @IsString()
  apiKey: string;

  @IsBoolean()
  sandboxMode: boolean;
}

class SeoSettingsDto {
  @IsString()
  metaTitle: string;

  @IsString()
  metaDescription: string;

  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsUrl()
  canonicalUrl: string;
}

class LocalizationDto {
  @IsString()
  timezone: string;

  @IsString()
  dateFormat: string;

  @IsString()
  timeFormat: string;

  @IsString()
  defaultLanguage: string;

  @IsArray()
  @IsString({ each: true })
  supportedLanguages: string[];
}

class AnalyticsDto {
  @IsString()
  googleAnalyticsId: string;

  @IsString()
  trackingPixel: string;

  @IsBoolean()
  heatmapEnabled: boolean;
}

class CustomFieldDto {
  @IsString()
  fieldName: string;

  @IsString()
  fieldType: string;

  @IsOptional()
  fieldValue: any;
}

// Main DTOs
export class CreateConfigurationsDto {
  @IsUUID()
  tenantId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ThemeSettingsDto)
  themeSettings?: ThemeSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LogosDto)
  logos?: LogosDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediasDto)
  socialMedias?: SocialMediasDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnabledModuleDto)
  enabledModules?: EnabledModuleDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInformationDto)
  contactInformation?: ContactInformationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SecuritySettingsDto)
  securitySettings?: SecuritySettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentConfigurationDto)
  paymentConfiguration?: PaymentConfigurationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SeoSettingsDto)
  seoSettings?: SeoSettingsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizationDto)
  localization?: LocalizationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AnalyticsDto)
  analytics?: AnalyticsDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomFieldDto)
  customFields?: CustomFieldDto[];
}
