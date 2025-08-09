import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomsDocumentDto } from './dto/create-customs-document.dto';
import { CustomsDocument } from './entities/customs-document.entity';
import { UpdateCustomsDocumentDto } from './dto/update-customs-document.dto';

@Injectable()
export class CustomsDocumentsService {
  constructor(
    @InjectRepository(CustomsDocument)
    private readonly repo: Repository<CustomsDocument>,
  ) {}

  async create(dto: CreateCustomsDocumentDto): Promise<CustomsDocument> {
  const documentNumber = `CDN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const entity = this.repo.create({...dto , documentNumber});
  return this.repo.save(entity);
}


  findAll(): Promise<CustomsDocument[]> {
    return this.repo.find({ relations: ['shipment'] });
  }

  async findOne(id: string): Promise<CustomsDocument> {
    const doc = await this.repo.findOne({ where: { id }, relations: ['shipment'] });
    if (!doc) throw new NotFoundException(`Document #${id} not found`);
    return doc;
  }

  async update(id: string, dto: UpdateCustomsDocumentDto): Promise<CustomsDocument> {
    const doc = await this.findOne(id);
    Object.assign(doc, dto);
    return this.repo.save(doc);
  }

  async remove(id: string): Promise<void> {
    const doc = await this.findOne(id);
    await this.repo.remove(doc);
  }
}