import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { OccurrencesService } from "./occurreces.service";
import { CreateOccurrenceDto } from "./dtos/create-occurrence.dto";
import { Occurrence } from "./entities/occurrence.entity";
import { JwtAuthGuard } from "../auth/jwt-auth-guard";

@ApiTags("Occurrences")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("occurrences")
export class OccurrencesController {
  constructor(private readonly occurrencesService: OccurrencesService) {}

  @ApiOperation({ summary: "Create occurrence" })
  @ApiBearerAuth("JWT")
  @ApiResponse({
    status: 200,
    description: "The occurrence has been created.",
    type: Occurrence,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createOccurrenceDto: CreateOccurrenceDto, @Request() req) {
    return this.occurrencesService.create(createOccurrenceDto, req.user.email);
  }

  @ApiOperation({ summary: "Get all occurrences for user" })
  @Get()
  findAll(@Request() req) {
    return this.occurrencesService.findAllByUser(req.user.id);
  }

  @ApiOperation({ summary: "Update occurrence" })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateOccurrenceDto: CreateOccurrenceDto,
    @Request() req
  ) {
    return this.occurrencesService.update(
      +id,
      updateOccurrenceDto,
      req.user.id
    );
  }

  @ApiOperation({ summary: "Close occurrence" })
  @Patch(":id/close")
  close(@Param("id") id: string, @Request() req) {
    return this.occurrencesService.close(+id, req.user.id);
  }

  @ApiOperation({ summary: "Delete occurrence" })
  @Delete(":id")
  remove(@Param("id") id: string, @Request() req) {
    return this.occurrencesService.remove(+id, req.user.id);
  }
}
