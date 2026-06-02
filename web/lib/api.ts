import { collection, doc, getDocs, getDoc, orderBy, query, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Incident, FamilyMember } from './types';

/**
 * Fetch the most recent incidents (up to 50).
 * Firestore collection: "incidents"
 */
export async function getIncidents(): Promise<Incident[]> {
  try {
    const q = query(
      collection(db, 'incidents'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Incident));
  } catch (err) {
    console.error('getIncidents error:', err);
    return [];
  }
}

/**
 * Fetch a single incident by ID.
 * Firestore collection: "incidents"
 */
export async function getIncident(id: string): Promise<Incident | null> {
  try {
    const docRef = doc(db, 'incidents', id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as Incident;
  } catch (err) {
    console.error('getIncident error:', err);
    return null;
  }
}

/**
 * Fetch all family members.
 * Firestore collection: "familyMembers"
 */
export async function getFamilyMembers(): Promise<FamilyMember[]> {
  try {
    const snapshot = await getDocs(collection(db, 'familyMembers'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FamilyMember));
  } catch (err) {
    console.error('getFamilyMembers error:', err);
    return [];
  }
}