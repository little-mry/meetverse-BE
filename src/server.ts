function sayHello(name: string = "World"): string {
  return `Hello, ${name}!`;
}

console.log(sayHello());
console.log(sayHello("Meetverse är här"));
