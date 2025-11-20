export enum ShapeType {
  CHAOS = 'Chaos Universe',
  HEART = 'Descartes Heart',
  ROSE = 'Agora Rose',
  CAT = 'Schrödinger Cat',
  LISSAJOUS = 'Lissajous Knot',
  MANDELBROT = 'Mandelbrot Set',
  FIBONACCI = 'Fibonacci Spiral'
}

export interface ParticleState {
  count: number;
  currentShape: ShapeType;
  fps: number;
}