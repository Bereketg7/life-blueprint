// FHIR API client – share health data with doctors
import { HealthProvider } from '../../types';

const FHIR_VERSION = 'R4';

export interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  name: Array<{ family: string; given: string[] }>;
  birthDate?: string;
  gender?: string;
}

export interface FHIRObservation {
  resourceType: 'Observation';
  id: string;
  status: 'final' | 'amended' | 'registered';
  code: { text: string; coding: Array<{ system: string; code: string; display: string }> };
  subject: { reference: string };
  valueQuantity?: { value: number; unit: string };
  effectiveDateTime: string;
}

export async function fetchPatientRecord(
  provider: HealthProvider,
  patientId: string
): Promise<FHIRPatient | null> {
  if (!provider.fhirEndpoint) return null;
  try {
    const response = await fetch(
      `${provider.fhirEndpoint}/${FHIR_VERSION}/Patient/${patientId}`,
      { headers: { Accept: 'application/fhir+json' } }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function postObservation(
  provider: HealthProvider,
  observation: Omit<FHIRObservation, 'id'>
): Promise<string | null> {
  if (!provider.fhirEndpoint) return null;
  try {
    const response = await fetch(
      `${provider.fhirEndpoint}/${FHIR_VERSION}/Observation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/fhir+json',
          Accept: 'application/fhir+json',
        },
        body: JSON.stringify(observation),
      }
    );
    if (!response.ok) return null;
    const result = await response.json();
    return result.id ?? null;
  } catch {
    return null;
  }
}

export function buildWeightObservation(
  patientId: string,
  weightKg: number,
  date: string
): Omit<FHIRObservation, 'id'> {
  return {
    resourceType: 'Observation',
    status: 'final',
    code: {
      text: 'Body weight',
      coding: [{ system: 'http://loinc.org', code: '29463-7', display: 'Body weight' }],
    },
    subject: { reference: `Patient/${patientId}` },
    valueQuantity: { value: weightKg, unit: 'kg' },
    effectiveDateTime: date,
  };
}
