import { Injectable } from '@nestjs/common';
import { ClassroomRepository } from '../domain/classroom.repository';
import { Classroom } from '../domain/classroom.entity';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ClassroomRepositoryPrisma implements ClassroomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(classroom: Classroom, creatorId: number): Promise<Classroom> {
    return this.prisma.$transaction(async (tx) => {
      const result = await tx.classroom.create({
        data: {
          class_code: classroom.classCode,
          name: classroom.name,
          description: classroom.description ?? null,
        },
      });

      await tx.classroomUser.create({
        data: {
          classroom_id: result.id,
          user_id: creatorId,
          role: 'ADMIN',
        },
      });

      return this.toDomain(result);
    });
  }

  async findAll(user: { id: number }): Promise<Classroom[]> {
    const classrooms = await this.prisma.classroom.findMany({
      where: {
        users: {
          some: {
            user_id: user.id
          }
        }
      },
    });
    return classrooms.map(this.toDomain);
  }

  async findById(id: number): Promise<Classroom | null> {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
    });
    return classroom ? this.toDomain(classroom) : null;
  }

  async findByClassCode(classCode: string): Promise<Classroom | null> {
    if (!classCode) {
      throw new Error('classCode is required');
    }
    const classroom = await this.prisma.classroom.findUnique({
      where: { class_code: classCode }
    });
    return classroom ? this.toDomain(classroom) : null;
  }

  async update(classroom: Classroom): Promise<Classroom> {
    const result = await this.prisma.classroom.update({
      where: { id: classroom.id },
      data: {
        name: classroom.name,
        description: classroom.description ?? null,
        updated_at: classroom.updatedAt,
      },
    });

    return this.toDomain(result);
  }
  
  async deleteById(id: number): Promise<void> {
    await this.prisma.classroom.delete({ where: { id } });
  }

  private toDomain(raw: any): Classroom {
    return new Classroom(
      raw.id,
      raw.class_code,
      raw.name,
      raw.description,
      raw.created_at,
      raw.updated_at,
    );
  }
}
