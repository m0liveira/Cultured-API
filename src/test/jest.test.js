test('Test #1 - Validate main jest operations with numbers', () => {
  let number = null;
  expect(number).toBeNull();
  number = 10;
  expect(number).not.toBeNull();
  expect(number).toBe(10);
  expect(number).toEqual(10);
  expect(number).toBeGreaterThan(9);
  expect(number).toBeLessThan(11);
});

test('Test #2 - Validate main jest operations with objects', () => {
  const obj = { name: 'Cultured', desc: 'Cultures is a tracker for manwhas, mangas, animes and more...', };
  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('name', 'Cultured');
  expect(obj.name).toBe('Cultured');

  const obj2 = { name: 'Cultured', desc: 'Cultures is a tracker for manwhas, mangas, animes and more...', };
  expect(obj).toEqual(obj2);
  expect(obj).toStrictEqual(obj2);
});
