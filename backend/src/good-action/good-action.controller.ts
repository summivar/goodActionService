import {Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import {ApiSecurity, ApiTags} from '@nestjs/swagger';
import {GoodActionService} from './good-action.service';
import {JwtGuard} from '../auth/jwt.guard';
import {AddGoodActionDto} from './dto/add-good-action.dto';
import {Request, Response} from 'express';
import {HelperService} from '../helper/helper.service';
import {DeleteGoodActionDto} from './dto/delete-good-action.dto';
import {UpdateGoodActionDto} from './dto/edit-good-action.dto';

@ApiTags('good-actions')
@Controller('api/good-action')
export class GoodActionController {
  constructor(
    private readonly goodActionService: GoodActionService,
    private readonly helperService: HelperService
  ) {
  }

  @Post('add')
  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  async add(@Req() request: Request, @Res() response: Response, @Body() goodActionDto: AddGoodActionDto): Promise<void> {
    const accessToken = this.helperService.getAccessTokenFromRequest(request);

    const action = await this.goodActionService.addAction(goodActionDto, accessToken);
    response.send(action);
  }

  @Put('update')
  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  async update(@Req() request: Request, @Res() response: Response, @Body() goodActionDto: UpdateGoodActionDto): Promise<void> {
    const accessToken = this.helperService.getAccessTokenFromRequest(request);

    const action = await this.goodActionService.updateAction(goodActionDto, accessToken);
    response.send(action);
  }

  @Delete('delete')
  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  async delete(@Req() request: Request, @Res() response: Response, @Body() goodActionDto: DeleteGoodActionDto): Promise<void> {
    const accessToken = this.helperService.getAccessTokenFromRequest(request);

    const action = await this.goodActionService.deleteAction(goodActionDto, accessToken);
    response.send(action);
  }

  @Get('getActions')
  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  async getActions(@Req() request: Request, @Res() response: Response) {
    const accessToken = this.helperService.getAccessTokenFromRequest(request);

    const actions = await this.goodActionService.getActions(accessToken);
    response.send(actions);
  }

  @Get('getUserActions/:id')
  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  async getUserActions(@Req() request: Request, @Res() response: Response, @Param('id') id: string) {
    const accessToken = this.helperService.getAccessTokenFromRequest(request);

    const actions = await this.goodActionService.getUserActions(id, accessToken);
    response.send(actions);
  }
}
