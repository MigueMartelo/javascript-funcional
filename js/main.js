const compose = (...functions) => data => functions.reduceRight((value, func) => func(value), data);

const attrsToString = (obj = {}) => {
  const keys = Object.keys(obj);
  const attrs = [];

  for (let i = 0; i < keys.length; i++) {
    let attr = keys[i];
    attrs.push(`${attr}="${obj[attr]}"`);
  }

  const string = attrs.join('');

  return string;
};

const tagAttrs = obj => (content = '') =>
  `<${obj.tag}${obj.attrs ? ' ' : ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`;

const tag = t => {
  if (typeof t === 'string') {
    return tagAttrs({ tag: t });
  } else {
    return tagAttrs(t);
  }
};

const tableRowTag = tag('tr');
const tableRow = items => compose(tableRowTag, tableCells)(items);

const tableCell = tag('td');
const tableCells = items => items.map(tableCell).join('');

const trashIcon = tag({ tag: 'i', attrs: { class: 'fas fa-trash-alt' } })('');

const description = document.getElementById('description');
const calories = document.getElementById('calories');
const carbs = document.getElementById('carbs');
const protein = document.getElementById('protein');

const list = [];

description.onkeypress = () => {
  description.classList.remove('is-invalid');
};

calories.onkeypress = () => {
  calories.classList.remove('is-invalid');
};

carbs.onkeypress = () => {
  carbs.classList.remove('is-invalid');
};

protein.onkeypress = () => {
  protein.classList.remove('is-invalid');
};

const validateInputs = () => {
  description.value ? '' : description.classList.add('is-invalid');
  calories.value ? '' : calories.classList.add('is-invalid');
  carbs.value ? '' : carbs.classList.add('is-invalid');
  protein.value ? '' : protein.classList.add('is-invalid');

  if (description.value && calories.value && carbs.value && protein.value) {
    const newItem = {
      description: description.value,
      calories: calories.value,
      carbs: carbs.value,
      protein: protein.value,
    };
    addItem(newItem);
    clearInputs();
    updateTotals();
    renderItems();
  }
};

const addItem = newItem => {
  list.push(newItem);
};

const updateTotals = () => {
  let calories = 0,
    carbs = 0,
    protein = 0;

  let totalCalories = document.getElementById('totalCalories');
  let totalCarbs = document.getElementById('totalCarbs');
  let totalProtein = document.getElementById('totalProtein');

  list.map(item => {
    (calories += +item.calories), (carbs += +item.carbs), (protein += +item.protein);
  });

  totalCalories.textContent = calories;
  totalCarbs.textContent = carbs;
  totalProtein.textContent = protein;
};

const clearInputs = () => {
  description.value = '';
  calories.value = '';
  carbs.value = '';
  protein.value = '';
};

const renderItems = () => {
  const container = document.getElementsByTagName('tbody')[0];
  container.innerHTML = '';

  const rows = list.map((item, index) => {
    const { description, calories, carbs, protein } = item;
    const removeButton = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItem(${index})`,
      },
    })(trashIcon);

    return tableRow([description, calories, carbs, protein, removeButton]);
  });
  container.innerHTML = rows.join('');
};

const removeItem = idx => {
  list.splice(idx, 1);
  updateTotals();
  renderItems();
};
