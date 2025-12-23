import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ClassroomRepository } from '../domain/classroom.repository';
import { Classroom } from '../domain/classroom.entity';
import { CreateClassroomDto } from './dto/create-classroom.dto';

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

    return this.repo.save(classroom, userId);
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
}
