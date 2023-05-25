import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from 'src/Schemas/report.models';
import { GymModule } from 'src/gym/gym.module';
import { UsersModule } from 'src/users/users.module';
import { Person, UserSchema } from 'src/Schemas/users.models';

@Module({
  imports : [
    MongooseModule.forFeature([{name : Report.name, schema:ReportSchema}]),
    MongooseModule.forFeature([{name : Person.name, schema:UserSchema}]),
    GymModule,
    UsersModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports : [ReportService]
})
export class ReportModule {}
