import admin from 'firebase-admin';

// Configuração do Firebase Admin
const initializeFirebase = () => {
  if (!admin.apps.length) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
    });

    console.log('🔥 Firebase Admin inicializado com sucesso');
  }
};

// Inicializar Firebase
initializeFirebase();

// Exportar instâncias
export const db = admin.firestore();
export const auth = admin.auth();
export const realtimeDb = admin.database();

export default admin;