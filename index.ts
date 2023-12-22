import { PrismaClient } from "@prisma/client";
import { getRandomNumber } from "./src/functions/helpers.function";

import Person from "./src/models/user.model";
import Address from "./src/models/address.model";

const prisma = new PrismaClient();

const countAddresses = async () => {
  try {
    const addressLength = await prisma.address.count();
    return addressLength;
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect;
  }
};

async function createPerson() {
  try {
    await fetch("http://juliobrazao.xyz:8082/getPerson")
      .then((res) => res.json())
      .then(async function (randomPerson: Person) {
        const randomPersonGenerated: any = {
          name: randomPerson.name,
          bornIn: randomPerson.bornIn,
          addressId: await countAddresses().then((result) =>
            result && getRandomNumber(result) === 0
              ? 1
              : result && getRandomNumber(result)
          ),
        };
        await prisma.person.create({
          data: randomPersonGenerated,
        });
      });
  } catch (err) {
    console.log("PERSON_CREATION_ERROR: ", err);
  }
}

async function createAddress() {
  try {
    await fetch("http://juliobrazao.xyz:8082/getAddress")
      .then((res) => res.json())
      .then(async function (randomAddress: Address) {
        await prisma.address.create({
          data: {
            street: randomAddress.street,
            number: randomAddress.number,
            zipCode: randomAddress.zipCode,
            location: randomAddress.location,
            province: randomAddress.province,
          },
        });
      });
  } catch (err) {
    console.log("ADDRESS_CREATION_ERROR: ", err);
  }
}

setInterval(() => {
  createPerson();
}, 3000);

setInterval(() => {
  createAddress();
}, 60000);
