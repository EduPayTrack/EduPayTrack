import { prisma } from '../lib/prisma';

export const getRegistry = async () => {
  let registry = await prisma.systemRegistry.findFirst();

  if (!registry) {
    registry = await prisma.systemRegistry.create({
      data: {
        id: 'singleton',
        institutionName: 'Unregistered School',
        institutionType: 'Primary School',
      }
    });
  }

  return registry;
};

export const updateRegistry = async (data: {
  institutionName?: string;
  institutionType?: string;
  address?: string;
  logoUrl?: string;
  contactEmail?: string;
}) => {
  return await prisma.systemRegistry.update({
    where: { id: 'singleton' },
    data,
  });
};
