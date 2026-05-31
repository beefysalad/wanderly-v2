import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TripsController } from './trips.controller';
import { TripsRepository } from './trips.repository';
import { TripsService } from './trips.service';

@Module({
  imports: [PrismaModule],
  controllers: [TripsController],
  providers: [TripsRepository, TripsService],
})
export class TripsModule {}
