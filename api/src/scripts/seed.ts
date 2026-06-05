import { Firestore, FieldValue } from '@google-cloud/firestore';
const db = new Firestore({ projectId: process.env.FIRESTORE_PROJECT_ID });

async function upsert(col: string, id: string, data: Record<string, unknown>) {
  const ref = db.collection(col).doc(id);
  const snap = await ref.get();
  if (!snap.exists) { await ref.set({ ...data, createdAt: FieldValue.serverTimestamp() }); console.log(`  + ${col}/${id}`); }
  else console.log(`  ~ ${col}/${id} (exists, skipped)`);
}

async function main() {
  console.log('Seeding agencies…');
  await upsert('agencies','ag-1',{name:'Phoenix PD Cyber Unit',state:'AZ',contact:'cyber@phoenixpd.gov',tier:'law_enforcement'});
  await upsert('agencies','ag-2',{name:'Maricopa County Sheriff',state:'AZ',contact:'sheriff@maricopa.gov',tier:'law_enforcement'});
  await upsert('agencies','ag-3',{name:'AZ DPS Intelligence',state:'AZ',contact:'intel@azdps.gov',tier:'law_enforcement'});

  console.log('Seeding incidents…');
  const types=['gov_impersonation','robocall','tech_support','irs_scam','medicare_fraud'];
  const areas=['602','480','623','520','928'];
  for(let i=1;i<=20;i++){
    await upsert('incidents',`inc-${i}`,{areaCode:areas[i%5],signalType:types[i%5],riskScore:40+Math.floor((i*17)%60),transcriptExcerpt:'Sample scam call transcript excerpt for seeding.',reportedAt:new Date(Date.now()-i*86400000).toISOString(),anonymizedCallerId:`anon-${i.toString().padStart(4,'0')}`});
  }

  console.log('Seeding patterns…');
  for(let i=1;i<=10;i++){
    await upsert('patterns',`pat-${i}`,{scriptCluster:`cluster-${i%3}`,signalType:types[i%5],occurrences:5+i*3,peakHour:8+i%12,areaCode:areas[i%5],lastSeen:new Date().toISOString()});
  }
  console.log('Seed complete.');
}

main().catch(e=>{console.error(e);process.exit(1);});