import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { GymConfig, GymConfigDocument } from 'src/Schemas/gymConfig.models';
import { CreateGymConfigDto } from './dto/create-gym-config.dto';
import { UpdateGymConfigDto } from './dto/update-gym-config.dto';
import { gymConfig } from './Model/gymConfig.model';

@Injectable()
export class GymConfigService {

  constructor(
    @InjectModel(GymConfig.name) private gymConfigModel : Model<GymConfigDocument>
    ){}

    async create(createGymConfigDto: CreateGymConfigDto) : Promise<any> {

      const NewConfig = new gymConfig(createGymConfigDto);
  
      const created = await this.gymConfigModel.create(NewConfig);
  
      if(!created)  throw new NotFoundException ("problem in creation of the gym");

      return created._id;

    }
  
    verifValidId(id: string){
      const isHexString = /^[0-9a-fA-F]+$/.test(id);
      if(!isHexString || id.length != 24)
       throw new NotFoundException("invalid GymConfig ID");
    }
  
    async findOne(id: string) : Promise<gymConfig> {
      this.verifValidId(id);
      const currrentConfig = await this.gymConfigModel.findOne({_id: id}).exec();
      if(!currrentConfig) throw new NotFoundException("this GymConfig doesn't exist");
  
      const Config : gymConfig = new gymConfig(currrentConfig);
      return  Config;
    }
  
    async update(id: string, updateGymConfigDto: UpdateGymConfigDto) : Promise<any> {
      this.verifValidId(id);
      const foundDocument = await this.gymConfigModel.findOne({ _id: id}).exec();
      if(isEmpty(foundDocument)) throw new NotFoundException("gymConfig doesn't exist");

      if(updateGymConfigDto.OpeningTime !== undefined)
      updateGymConfigDto.OpeningTime = new Date(Date.parse(`01/01/2000 ${updateGymConfigDto.OpeningTime}`));


      if((updateGymConfigDto.ClosingTime) !== undefined)
      updateGymConfigDto.ClosingTime = new Date(Date.parse(`01/01/2000 ${updateGymConfigDto.ClosingTime}`));
      
      const currentgymConfig : gymConfig = new gymConfig(updateGymConfigDto);

      const updatedGym = await this.gymConfigModel.findByIdAndUpdate(
        {_id : id},
        {$set: currentgymConfig},
        {new: true},
      )
      if(!isEmpty(updatedGym)) return {"message" : "gymConfig updated successfully"};
      throw new NotFoundException("updating gymConfig denied");

    }

    async remove(id: string) : Promise<any> {
      this.verifValidId(id);
      const deletedGymConfig = await this.gymConfigModel.findByIdAndDelete({_id : id});
      if(deletedGymConfig) return true;
      throw new NotFoundException("gymConfig doesn't exist");
    }
}
