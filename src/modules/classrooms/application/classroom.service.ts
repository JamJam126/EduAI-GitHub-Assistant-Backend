import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ClassroomRepository } from '../domain/classroom.repository';
import { Classroom } from '../domain/classroom.entity';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Injectable()
export class ClassroomService {
  constructor(
    @Inject('ClassroomRepository')
    private readonly repo: ClassroomRepository,
  ) {}

	async create(dto: CreateClassroomDto, userId: number): Promise<Classroom> {
    const classroom = new Classroom(
      0,
      dto.classCode,
      dto.name,
      dto.description,
    );

    return this.repo.create(classroom, userId);
	}

  async findAll(user: { id: number }): Promise<Classroom[]> {
    return this.repo.findAll(user);
  }

  async findOne(id: number): Promise<Classroom | null> {
    const classroom = await this.repo.findById(id);
    if (!classroom) throw new NotFoundException('Classroom Not Found!');
    
    return classroom;
  } 

  async findByClassCode(classCode: string): Promise<Classroom | null> {
    const classroom = await this.repo.findByClassCode(classCode);
    if (!classCode) throw new NotFoundException('Classroom Not Found!');

    return classroom
  }

  async update(
    id: number, 
    dto: UpdateClassroomDto, 
    userId: number
  ): Promise<Classroom> {
    const record = await this.repo.findById(id);

    if (!record) throw new NotFoundException("Classroom not found.");

    const classroom = new Classroom(
      record.id,
      record.classCode,
      record.name,
      record.description,
      record.createdAt,
      record.updatedAt
    );

    if (dto.name !== undefined) {
      classroom.rename(dto.name);
    }

    if (dto.description !== undefined) {
      classroom.updateDescription(dto.description);
    }

    await this.repo.update(classroom);

    return classroom;
  }

  async delete(id: number, userId: number): Promise<void> {
    const record = await this.repo.findById(id);

    if(!record) throw new NotFoundException("Classroom not found!");

    await this.repo.deleteById(id);
  }

}
