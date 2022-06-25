import { faker } from "https://cdn.skypack.dev/@faker-js/faker";

function capit(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

for (let i = 0; i < 30; i++) {
  const num = faker.random.numeric(4);
  const verb = faker.hacker.verb();
  const adj = faker.hacker.adjective();
  const noun = faker.hacker.noun();
  console.log(`JIRAF-${num} ${capit(verb)} the ${adj} ${noun}`);
}
