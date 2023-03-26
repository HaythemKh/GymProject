import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { subscription } from './Model/subscription.model';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post("/createSubscription")
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto) : Promise<any> {
    return await this.subscriptionService.create(createSubscriptionDto);
  }

  @Get("/AllSubscriptions")
  async findAllSubscriptions() : Promise<subscription[]> {
    return await this.subscriptionService.findAllSubscriptions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<any> {
    return await this.subscriptionService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) : Promise<any> {
    return await this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<any> {
    return await this.subscriptionService.remove(id);
  }
}
