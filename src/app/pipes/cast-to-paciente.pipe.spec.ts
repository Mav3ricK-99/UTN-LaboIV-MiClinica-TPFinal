import { CastToPacientePipe } from './cast-to-paciente.pipe';

describe('CastToPacientePipe', () => {
  it('create an instance', () => {
    const pipe = new CastToPacientePipe();
    expect(pipe).toBeTruthy();
  });
});
