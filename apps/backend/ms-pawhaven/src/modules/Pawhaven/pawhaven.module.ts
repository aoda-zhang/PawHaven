import { Module } from '@nestjs/common';
// import TripDBCollection from 'src/models/trip.DBcollection';
// import { TripHistorySchema } from 'src/models/tripInfo.schema';
// import { MongooseModule } from '@nestjs/mongoose';

import { PawhavenService } from './pawhaven.service';
import { PawhavenController } from './pawhaven.controler';

@Module({
  // imports: [
  //   MongooseModule.forFeature([
  //     { name: TripDBCollection.HISTORY, schema: TripHistorySchema },
  //   ]),
  // ],
  imports: [],
  controllers: [PawhavenController],
  providers: [PawhavenService],
  exports: [PawhavenService],
})
export class PawhavenModule {}
