import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomsDocument } from './entities/customs-document.entity';
import { CustomsDocumentsService } from './customs-documents.service';
import { CustomsDocumentsController } from './customs-documents.controller';


@Module({
  imports: [TypeOrmModule.forFeature([CustomsDocument])],
  providers: [CustomsDocumentsService],
  controllers: [CustomsDocumentsController],
  exports: [CustomsDocumentsService],
})
export class CustomsDocumentsModule {}