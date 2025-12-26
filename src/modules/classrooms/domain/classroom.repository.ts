import { Classroom } from './classroom.entity';

export interface ClassroomRepository {
  create(classroom: Classroom, creatorId: number): Promise<Classroom>;
  update(classroom: Classroom): Promise<Classroom>;
  findAll(user: { id: number }): Promise<Classroom[]>;
  findById(id: number): Promise<Classroom | null>;
  findByClassCode(classCode: string): Promise<Classroom | null>;
  deleteById(id: number): Promise<void>;
}
