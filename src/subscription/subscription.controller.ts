import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { subscription } from './Model/subscription.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("/createSubscription")
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto,@Request() req:any) : Promise<any> {
    return await this.subscriptionService.create(createSubscriptionDto,req);
  }
  @UseGuards(AuthGuard("jwt"))
  @Get("/AllSubscriptions")
  async findAllSubscriptions(@Request() req : any) : Promise<subscription[]> {
    return await this.subscriptionService.findAllSubscriptions(req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(':id')
  async findOne(@Param('id') id: string,@Request() req : any) : Promise<any> {
    return await this.subscriptionService.findOne(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto,@Request() req : any) : Promise<any> {
    return await this.subscriptionService.update(id, updateSubscriptionDto,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(':id')
  async remove(@Param('id') id: string,@Request() req:any) : Promise<any> {
    return await this.subscriptionService.remove(id,req);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("Member/MyPreviousSubscriptions")
  async MyRegistrations(@Request() req : any) : Promise<subscription[]>{
    return await this.subscriptionService.AvailableSubscriptions(req);
  }
}
