import { fakerPT_BR as faker } from '@faker-js/faker';

export function generateName(): string {
  return faker.person.fullName();
}

export function generateFirstName(): string {
  return faker.person.firstName();
}

export function generateLastName(): string {
  return faker.person.lastName();
}
