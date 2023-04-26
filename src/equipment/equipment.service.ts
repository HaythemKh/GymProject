import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'class-validator';
import { Model } from 'mongoose';
import { GymService } from 'src/gym/gym.service';
import { EquipmentSchema,EquipmentDocument,Equipment } from 'src/Schemas/equipment.models';
import { Role } from 'src/Schemas/users.models';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentModule } from './equipment.module';
import { equipment } from './Model/equipment.model';
EquipmentSchema


@Injectable()
export class EquipmentService {

  constructor(
    @InjectModel(Equipment.name) private EquipmentModel : Model<EquipmentDocument>,
    @Inject(GymService) private  gymService : GymService
  ){}
  
  async create(createEquipmentDto: CreateEquipmentDto,req:any) {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");
    createEquipmentDto.Gym = req.user.gym;
    this.verifValidId(createEquipmentDto.Gym);
    if(!(await this.gymService.verifGymExistID(createEquipmentDto.Gym))) throw new NotFoundException("This gym doesn't exist ");

    const created = await this.EquipmentModel.create(createEquipmentDto);
    if(!created) throw new NotFoundException("problem with Equipment creation ");
    await this.gymService.addEquipmentToList(createEquipmentDto.Gym,created._id);

     return {"message" : "Equipment added successfully"};
    
  }

  verifValidId(id: string){
    const isHexString = /^[0-9a-fA-F]+$/.test(id);
    if(!isHexString || id.length != 24)
     throw new NotFoundException("invalid Equipment ID");
  }
  IsEquipmentExist(id : string) : boolean{
    const currrentEquip =  this.EquipmentModel.findOne({_id: id}).exec();
    return !isEmpty(currrentEquip);

  }

  async findAll(req : any) : Promise<equipment[]> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    const AllEquipments = await this.EquipmentModel.find({Gym : req.user.gym}).exec();
    let listEquipments : equipment[] = [] ;
    AllEquipments.map(EquipmentJson => {
      listEquipments.push(new equipment(EquipmentJson));
    });

    return  listEquipments;
  }

  async findOne(id: string) :Promise<equipment> {
    this.verifValidId(id);
    const currrentEquip = await this.EquipmentModel.findOne({_id: id}).exec();
    if(isEmpty(currrentEquip)) throw new NotFoundException("equipment doesn't exist");
    const Equipment : equipment = new equipment(currrentEquip);
    return Equipment;
  }

   async update(id: string, updateEquipmentDto: UpdateEquipmentDto,req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const foundDocument = await this.EquipmentModel.findOne({ _id: id,Gym : req.user.gym }).exec();

    if(isEmpty(foundDocument)) throw new NotFoundException("equipment doesn't exist");

    const Equipment : equipment = new equipment(updateEquipmentDto);
    const updatedEquip = await this.EquipmentModel.findByIdAndUpdate(
      {_id : id},
      {$set: Equipment},
      {new: true},
    )

    if(!isEmpty(updatedEquip)) return {"message" : "Equipment updated successfully"};
    else throw new NotFoundException("updating Equipment denied");
   }


   async updateEquipmentStatusToFalse(equipment: string): Promise<void> {
    const updateResult = await this.EquipmentModel.updateOne(
      { _id: equipment },
      { $set: { Availability: false } },
    );
  }
  async isAvailable(equipId : string) : Promise<boolean> {
    const currrentEquip = await this.EquipmentModel.findOne({_id: equipId}).exec();
    
    return currrentEquip.Availability === true;
  }

  async updateEquipmentStatusToTrue(equipment: string): Promise<void> {
    const updateResult = await this.EquipmentModel.updateOne(
      { _id: equipment },
      { $set: { Availability: true } },
    );
  }

   async remove(id: string,req : any) : Promise<any> {

    if(req.user.role !== Role.ADMIN) throw new UnauthorizedException("Only Admin can get Access to This !!");

    this.verifValidId(id);
    const deletedEquip = await this.EquipmentModel.findByIdAndDelete({_id : id});
    if(deletedEquip){ 
      await this.gymService.RemoveEquipmentFromList(deletedEquip.Gym,deletedEquip._id);
      return true;
    } 
    else throw new NotFoundException("Equipment doesn't exist");
  }
}
