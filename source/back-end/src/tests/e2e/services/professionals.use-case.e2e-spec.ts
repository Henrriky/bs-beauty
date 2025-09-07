import { prismaClient } from "../../../src/lib/prisma";
import { PrismaProfessionalRepository } from "../../../src/repository/prisma/prisma-professional.repository";
import { ProfessionalsUseCase } from "../../../src/services/professionals.use-case";

describe('ProfessionalsUseCase', () => {
  let professionalsUseCase: ProfessionalsUseCase;
  let prismaProfessionalRepository: PrismaProfessionalRepository;

  beforeAll(async () => {
    professionalsUseCase = new ProfessionalsUseCase(prismaProfessionalRepository = new PrismaProfessionalRepository());
  });

  beforeEach(async () => {
    await prismaClient.professional.deleteMany({});
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it('should be defined', () => {
    expect(professionalsUseCase).toBeDefined();
  });

  describe('executeFindAll', () => {
    it('should retrieve all professionals', async () => {

      // arrange
      const professional1 = await prismaClient.professional.create({
        data: { name: 'John Doe', email: 'john.doe@example.com' },
      });

      const professional2 = await prismaClient.professional.create({
        data: { name: 'Thomas Doe', email: 'thomas.doe@example.com' },
      });

      const professional3 = await prismaClient.professional.create({
        data: { name: 'Leon S. Kennedy', email: 'leon.s.kennedy@example.com' },
      });

      // act
      const result = await professionalsUseCase.executeFindAll();

      // assert
      expect(result.professionals).toHaveLength(3);
      expect(result.professionals[0].name).toBe(professional1.name);
      expect(result.professionals[0].email).toBe(professional1.email);
      expect(result.professionals[1].name).toBe(professional2.name);
      expect(result.professionals[1].email).toBe(professional2.email);
      expect(result.professionals[2].name).toBe(professional3.name);
      expect(result.professionals[2].email).toBe(professional3.email);
    });
  });

  describe('executeFindById', () => {
    it('should return an professional by id from the database', async () => {
      // arrange
      const professional = await prismaClient.professional.create({
        data: { id: 'random-uuid', name: 'John Doe', email: 'john@example.com' },
      });

      // act
      const result = await professionalsUseCase.executeFindById('random-uuid');

      // assert
      expect(result).toEqual(professional);
    });
  });

  describe('executeCreate', () => {
    it('should create a new professional and store in the database', async () => {
      // arrange
      const newProfessional = { name: 'Mark Smith', email: 'mark@example.com' };

      // act
      const createdProfessional = await professionalsUseCase.executeCreate(newProfessional);

      // assert
      const professionalFromDb = await prismaClient.professional.findUnique({ where: { email: newProfessional.email } });
      expect(createdProfessional).toEqual(professionalFromDb);
    });

  });

  describe('executeUpdate', () => {
    it('should update an professional and save changes in the database', async () => {

      // arrange
      const professional = await prismaClient.professional.create({
        data: { id: 'random-uuid', name: 'John Doe', email: 'john@example.com' },
      });

      // act & assert
      const updatedProfessional = await professionalsUseCase.executeUpdate('random-uuid', { name: 'John Updated' });
      expect(updatedProfessional.name).toEqual('John Updated');
      const professionalFromDb = await prismaClient.professional.findUnique({ where: { id: professional.id } });
      expect(professionalFromDb?.name).toEqual('John Updated');
    });
  });

  describe('executeDelete', () => {
    it('should delete an professional from the database', async () => {

      // arrange
      const professional = await prismaClient.professional.create({
        data: { id: 'random-uuid', name: 'John Doe', email: 'john@example.com' },
      });

      // act
      const deletedProfessional = await professionalsUseCase.executeDelete(professional.id);

      // assert
      expect(deletedProfessional.id).toEqual(professional.id);
      const professionalFromDb = await prismaClient.professional.findUnique({ where: { id: professional.id } });
      expect(professionalFromDb).toBeNull();
    });
  });

})

