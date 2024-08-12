import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/utils/jwt-auth.guard';
import { RequestsService } from './requests-module.service';

@Controller('v1/requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit-request')
  async submitRequest(@Body('prompt') prompt: string, @Req() req) {
    return this.requestsService.createRequest(req.user.userId, prompt);
  }

  @Get('fetch-requests')
  async fetchRequest(@Req() req) {
    const secret = req.headers.authorization.split(' ')[1];
    return this.requestsService.getNextRequest(secret);
  }

  @Post('submit-result')
  async submitResults(
    @Req() req,
    @Body('resultsData') resultsData: { requestId: string; result: string }[],
  ) {
    const secret = req.headers.authorization.split(' ')[1];
    return this.requestsService.submitResults(resultsData, secret);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-result/:requestId')
  async getResult(@Param('requestId') requestId: string) {
    return this.requestsService.getResult(requestId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-requests')
  async getUserRequests(@Req() req) {
    const userId = req.user.userId;
    return this.requestsService.getUserRequests(userId);
  }
}
