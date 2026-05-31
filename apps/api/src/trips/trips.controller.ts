import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { Trip, TripRsvp } from '@workspace/shared';
import {
  CurrentUser,
  type CurrentUser as CurrentUserPayload,
} from '../common/decorators/current-user.decorator';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  attachTripToGroupSchema,
  createTripSchema,
  type AttachTripToGroupDto,
  type CreateTripDto,
  type UpdateTripDto,
  type UpdateTripRsvpDto,
  updateTripRsvpSchema,
  updateTripSchema,
} from './dto/trip.dto';
import { TripsService } from './trips.service';

@Controller()
@UseGuards(ClerkGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get('trips')
  getTrips(@CurrentUser() currentUser: CurrentUserPayload): Promise<Trip[]> {
    return this.tripsService.getTrips(currentUser.clerkId);
  }

  @Post('trips')
  createTrip(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Body(new ZodValidationPipe(createTripSchema)) input: CreateTripDto,
  ): Promise<Trip> {
    return this.tripsService.createTrip(currentUser.clerkId, input);
  }

  @Get('trips/:id')
  getTrip(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('id') tripId: string,
  ): Promise<Trip> {
    return this.tripsService.getTrip(currentUser.clerkId, tripId);
  }

  @Patch('trips/:id')
  updateTrip(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('id') tripId: string,
    @Body(new ZodValidationPipe(updateTripSchema)) input: UpdateTripDto,
  ): Promise<Trip> {
    return this.tripsService.updateTrip(currentUser.clerkId, tripId, input);
  }

  @Delete('trips/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrip(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('id') tripId: string,
  ): Promise<void> {
    await this.tripsService.deleteTrip(currentUser.clerkId, tripId);
  }

  @Post('trips/:id/attach-group')
  attachTripToGroup(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('id') tripId: string,
    @Body(new ZodValidationPipe(attachTripToGroupSchema))
    input: AttachTripToGroupDto,
  ): Promise<Trip> {
    return this.tripsService.attachTripToGroup(
      currentUser.clerkId,
      tripId,
      input,
    );
  }

  @Get('groups/:groupId/trips')
  getTripsByGroup(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('groupId') groupId: string,
  ): Promise<Trip[]> {
    return this.tripsService.getTripsByGroup(currentUser.clerkId, groupId);
  }

  @Get('trips/:id/rsvp')
  getRsvps(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('id') tripId: string,
  ): Promise<TripRsvp[]> {
    return this.tripsService.getRsvps(currentUser.clerkId, tripId);
  }

  @Patch('trips/:id/rsvp')
  updateRsvp(
    @CurrentUser() currentUser: CurrentUserPayload,
    @Param('id') tripId: string,
    @Body(new ZodValidationPipe(updateTripRsvpSchema))
    input: UpdateTripRsvpDto,
  ): Promise<TripRsvp> {
    return this.tripsService.updateRsvp(currentUser.clerkId, tripId, input);
  }
}
