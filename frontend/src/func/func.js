import { faker } from "@faker-js/faker";
import { useState } from "react";

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle(["relationship", "complicated", "single"])[0],
  };
};

const newResponsive = () => {
  return {
    resp_id: faker.number.int({ min: 0, max: 10000 }),
    user_id_fk: faker.number.int(),
    state_id_fk: faker.number.int({ min: 1, max: 2 }),
    remedy: "TAS000001069050",
    token: 340861,
    user_name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    immediately_chief: faker.person.fullName(),
    windows_server: "vwcapappwp8007.un.pemex.com ",
    domain: "UN",
    account: "GCOADMUS",
    start_date: faker.date.past().toISOString().split("T")[0],
    end_date: faker.date.future().toISOString().split("T")[0],
    file_format: faker.number.int({ min: 3, max: 4 }),
    file_route: "3",
  };
};

export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...newResponsive(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
