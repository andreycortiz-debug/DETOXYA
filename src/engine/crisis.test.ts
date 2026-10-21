import { describe, expect, it } from 'vitest';
import { detectCrisis } from './crisis';

describe('detectCrisis', () => {
  it('returns none for empty or neutral text', () => {
    expect(detectCrisis('').level).toBe('none');
    expect(detectCrisis('hoy tengo un buen día y todo va bien').level).toBe('none');
  });

  it('detects passive ideation in Spanish', () => {
    const r = detectCrisis('a veces siento que no quiero vivir más');
    expect(r.level).toBe('passive');
  });

  it('detects active intent in Spanish', () => {
    const r = detectCrisis('voy a matarme ahora mismo');
    expect(r.level).toBe('active');
  });

  it('detects suicide mentions in English', () => {
    expect(detectCrisis('I have suicidal thoughts sometimes').level).toBe('passive');
    expect(detectCrisis("i'm going to kill myself tonight").level).toBe('active');
  });

  it('is accent-insensitive', () => {
    expect(detectCrisis('estoy pensando en suicidarme').level).toBe('passive');
  });

  it('detects self-harm language', () => {
    expect(detectCrisis('me quiero hacer daño').level).toBe('passive');
    expect(detectCrisis('I might self-harm again').level).toBe('passive');
  });

  it('does not flag ordinary recovery talk', () => {
    expect(detectCrisis('el antojo pasó en 10 minutos, lo superé').level).toBe('none');
    expect(detectCrisis('craving was hard but I surfed it').level).toBe('none');
  });

  it('detects urgent medical (overdose/mixing)', () => {
    expect(detectCrisis('me he pasado de dosis').level).toBe('urgent-medical');
    expect(detectCrisis('he tomado todas las pastillas').level).toBe('urgent-medical');
    expect(detectCrisis('mezclé clonazepam y vino').level).toBe('urgent-medical');
    expect(detectCrisis('i overdosed').level).toBe('urgent-medical');
    expect(detectCrisis('my friend is unconscious').level).toBe('urgent-medical');
  });

  it('detects new euphemisms', () => {
    expect(detectCrisis('odio vivir').level).toBe('passive');
    expect(detectCrisis('quiero desaparecer').level).toBe('passive');
    expect(detectCrisis('i want to die tonight').level).toBe('active');
    expect(detectCrisis('voy a saltarme').level).toBe('active');
  });

  it('urgent medical takes priority over passive', () => {
    expect(detectCrisis('no quiero vivir y me he pasado de dosis').level).toBe('urgent-medical');
  });
});
