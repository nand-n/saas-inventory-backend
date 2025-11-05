import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rfi } from './entities/rfi.entity';
import { RfiQuestion } from './entities/rfi-question.entity';
import { CreateRfiDto } from './dtos/create-rfi.dto';
import { UpdateRfiDto } from './dtos/update-rfi.dto';

@Injectable()
export class RfiService {
  constructor(
    @InjectRepository(Rfi)
    private readonly rfiRepository: Repository<Rfi>,

    @InjectRepository(RfiQuestion)
    private readonly questionRepository: Repository<RfiQuestion>,
  ) {}

  async create(createRfiDto: CreateRfiDto): Promise<Rfi> {
    const { questions, ...rfiData } = createRfiDto;

    const rfi = this.rfiRepository.create({
      ...rfiData,
      questions: questions?.map((q) => this.questionRepository.create(q)) || [],
    });

    return await this.rfiRepository.save(rfi);
  }

  async findAll(): Promise<Rfi[]> {
    return this.rfiRepository.find({
      relations: ['questions', 'createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Rfi> {
    const rfi = await this.rfiRepository.findOne({
      where: { id },
      relations: ['questions', 'createdBy'],
    });
    if (!rfi) throw new NotFoundException(`RFI with ID ${id} not found`);
    return rfi;
  }

  async update(id: string, updateRfiDto: UpdateRfiDto): Promise<Rfi> {
    const existing = await this.findOne(id);

    const { questions, ...rest } = updateRfiDto;

    if (questions) {
      // Remove old questions and re-add
      await this.questionRepository.delete({ rfi: { id } });
      existing.questions = questions.map((q) =>
        this.questionRepository.create(q),
      );
    }

    Object.assign(existing, rest);
    return await this.rfiRepository.save(existing);
  }

  async remove(id: string): Promise<void> {
    const rfi = await this.findOne(id);
    await this.rfiRepository.remove(rfi);
  }
}
