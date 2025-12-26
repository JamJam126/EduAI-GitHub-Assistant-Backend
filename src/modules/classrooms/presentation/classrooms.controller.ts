import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ClassroomService } from '../application/classroom.service';
import { CreateClassroomDto } from '../application/dto/create-classroom.dto';
import { Classroom } from '../domain/classroom.entity';
import { UpdateClassroomDto } from '../application/dto/update-classroom.dto';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly service: ClassroomService) {}

  @Post()
  create(@Body() dto: CreateClassroomDto): Promise<Classroom> {
    const userId = 1; // HARD-CODED MOCK USER
    return this.service.create(dto, userId);
  }

  @Get()
  findAll() {
    const user = { id: 1 };
    return this.service.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Get('by-code/:classCode')
  findByClassCode(@Param('classCode') classCode: string) {
    return this.service.findByClassCode(classCode);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() dto: UpdateClassroomDto
  ) {
    const userId = 1;
    return this.service.update(+id, dto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ) {
    const userId = 1;
    await this.service.delete(+id, userId);
  }
}
