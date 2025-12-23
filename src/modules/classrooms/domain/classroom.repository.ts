import { Classroom } from './classroom.entity';

export interface ClassroomRepository {
  save(entity: Classroom, creatorId: number): Promise<Classroom>;
  findAll(user: { id: number }): Promise<Classroom[]>;
  findById(id: number): Promise<Classroom | null>;
  findByClassCode(classCode: string): Promise<Classroom | null>;
}
