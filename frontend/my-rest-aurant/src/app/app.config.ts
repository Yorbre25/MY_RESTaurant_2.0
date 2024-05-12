import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [ provideRouter(routes), provideHttpClient(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"my-rest-raurant-2","appId":"1:59314081117:web:fac699fd4cf982ca6f6cb4","databaseURL":"https://my-rest-raurant-2-default-rtdb.firebaseio.com","storageBucket":"my-rest-raurant-2.appspot.com","apiKey":"AIzaSyAsfx-2QWa8e1lX5Dv9TRf1WXdmsXNBAT0","authDomain":"my-rest-raurant-2.firebaseapp.com","messagingSenderId":"59314081117","measurementId":"G-ZXHJN212BP"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideFunctions(() => getFunctions()))]
};
