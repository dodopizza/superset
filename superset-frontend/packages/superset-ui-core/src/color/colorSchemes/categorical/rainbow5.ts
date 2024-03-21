// DODO was here

import CategoricalScheme from '../../CategoricalScheme';

const schemes = [
  {
    id: 'rainbow5',
    label: 'Rainbow Light',
    colors: [
      '#ff4d4f', // red-5
      '#ff7a45', // volcano-5
      '#ffa940', // orange-5
      '#ffc53d', // gold-5
      '#ffec3d', // yellow-5
      '#bae637', // lime-5
      '#73d13d', // green-5
      '#36cfc9', // cyan-5
      '#4096ff', // blue-5
      '#597ef7', // geekblue-5
      '#9254de', // purple-5
      '#f759ab', // magenta-5
    ],
  },
].map(s => new CategoricalScheme(s));

export default schemes;
