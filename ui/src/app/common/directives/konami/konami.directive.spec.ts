import { KonamiDirective } from './konami.directive';
describe('Konami2irective', () => {
  let directive: any;
  beforeEach(() => {
    directive = new KonamiDirective();
  });
  afterEach(() => {
    directive = null;
  });
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
  it('expects "handleKeyboardEvent" to add keydown to sequence', () => {
    spyOn(directive.konami, 'emit').and.stub();
    spyOn(directive, 'isKonamiCode').and.callThrough();
    const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    directive.sequence = [];
    directive.handleKeyboardEvent(keyEvent);
    expect(directive.sequence).toEqual(['arrowup']);
    expect(directive.isKonamiCode).toHaveBeenCalled();
    expect(directive.konami.emit).not.toHaveBeenCalled();
  });
  it('expects "handleKeyboardEvent" to trigger a konami emit', () => {
    spyOn(directive.konami, 'emit').and.stub();
    spyOn(directive, 'isKonamiCode').and.callThrough();
    const keyEvent = new KeyboardEvent('keydown', { key: 'A' });
    directive.sequence = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b'
    ];
    directive.handleKeyboardEvent(keyEvent);
    expect(directive.isKonamiCode).toHaveBeenCalled();
    expect(directive.konami.emit).toHaveBeenCalled();
  });
  it('expects "handleKeyboardEvent" to not work if event had no key detail', () => {
    spyOn(directive.konami, 'emit').and.stub();
    spyOn(directive, 'isKonamiCode').and.callThrough();
    const keyEvent = new KeyboardEvent('keydown', { key: '' });
    directive.sequence = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'a'
    ];
    directive.handleKeyboardEvent(keyEvent);
    expect(directive.isKonamiCode).not.toHaveBeenCalled();
    expect(directive.konami.emit).not.toHaveBeenCalled();
  });
  it('expects "handleKeyboardEvent" to add to the sequence, removing from the front', () => {
    spyOn(directive.konami, 'emit').and.stub();
    spyOn(directive, 'isKonamiCode').and.callThrough();
    directive.sequence = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a'
    ];
    const result = [
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a',
      'c'
    ];
    const keyEvent = new KeyboardEvent('keydown', { key: 'C' });
    directive.handleKeyboardEvent(keyEvent);
    expect(directive.sequence).toEqual(result);
  });
  it('expects "isKonamiCode" to return true with a correct sequence', () => {
    spyOn(directive.konami, 'emit').and.stub();
    spyOn(directive, 'isKonamiCode').and.callThrough();
    directive.sequence = [
      'arrowup',
      'arrowup',
      'arrowdown',
      'arrowdown',
      'arrowleft',
      'arrowright',
      'arrowleft',
      'arrowright',
      'b',
      'a'
    ];
    expect(directive.isKonamiCode()).toEqual(true);
  });
});
