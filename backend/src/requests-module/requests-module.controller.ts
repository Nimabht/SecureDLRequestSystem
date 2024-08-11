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

@Controller('/requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit-request')
  async submitRequest(@Body('prompt') prompt: string, @Req() req) {
    return this.requestsService.createRequest(req.user.userId, prompt);
  }

  @Post('fetch-requests')
  async fetchRequest(@Body('secret') secret: string) {
    return this.requestsService.getNextRequest(secret);
  }

  @Post('submit-result')
  async submitResult(@Body() resultData) {
    return this.requestsService.submitResult(
      resultData.requestId,
      resultData.result,
      resultData.secret,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-result/:requestId')
  async getResult(@Param('requestId') requestId: string) {
    return this.requestsService.getResult(requestId);
  }
}
