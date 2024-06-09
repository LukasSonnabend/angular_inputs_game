import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbSubject = new BehaviorSubject<IDBDatabase | null>(null);
  private dbName: string = 'MyAppDB';
  private storeName: string = 'animals';

  constructor() {
    this.initDB().then(db => {
      this.dbSubject.next(db);
    }).catch(error => {
      console.error('Failed to initialize IndexedDB:', error);
    });
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'uuid' });
        }
      };

      request.onsuccess = (event: Event) => {
        resolve(request.result);
      };

      request.onerror = (event: Event) => {
        reject(request.error);
      };
    });
  }

  get db$() {
    return this.dbSubject.asObservable();
  }
  private getDBPromise(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      // Immediately initialize the subscription to avoid undefined errors
      const sub = this.dbSubject.subscribe(db => {
        if (db) {
          resolve(db);
        }
      }, error => {
        reject(error);
        if (sub) {
          sub.unsubscribe();
        }
      });
    });
  }

  addAnimal(animal: any): Promise<IDBValidKey> {
    // First, ensure that the animal object has a 'uuid' property.
    if (!animal.uuid) {
      // Immediately return a rejected promise of the correct type.
      // Since the function expects a Promise<IDBValidKey>, but we're in an error state,
      // we cast the rejection reason to any to bypass TypeScript's type checking.
      return Promise.reject("Animal object must have a 'uuid' property.") as Promise<IDBValidKey>;
    }
  
    return this.getDBPromise().then(db => {
      if (!db) {
        // Similar to above, cast the rejection reason to match the expected return type.
        throw new Error('Database connection is not available.');
      }
  
      return new Promise<IDBValidKey>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(animal);
  
        request.onsuccess = () => {
          resolve(request.result);
        };
  
        request.onerror = () => {
          reject(request.error);
        };
  
        // Handle transaction errors.
        transaction.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
  
        // Handle the case where the transaction completes successfully but the request fails.
        transaction.oncomplete = () => {
          if (request.error) {
            reject(request.error);
          }
        };
      });
    }).catch(error => {
      console.error('Failed to add animal:', error);
      // Here, instead of re-throwing the error, we return a rejected promise of the correct type.
      // This ensures that the catch block conforms to the function's return type.
      return Promise.reject(error) as Promise<IDBValidKey>;
    });
  }

  loadAllAnimals(): Promise<any[]> {
    return this.getDBPromise().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }

  getAnimal(uuid: string): Promise<any> {
    return this.getDBPromise().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(uuid);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }

  deleteAnimal(uuid: string): Promise<void> {
    return this.getDBPromise().then(db => {
      if (!db) {
        throw new Error('Database connection is not available.');
      }
  
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(uuid);
  
        request.onsuccess = () => {
          resolve();
        };
  
        request.onerror = () => {
          reject(request.error);
        };
  
        // Handle transaction errors.
        transaction.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
  
        // Handle the case where the transaction completes successfully but the request fails.
        transaction.oncomplete = () => {
          if (request.error) {
            reject(request.error);
          }
        };
      });
    }).catch(error => {
      console.error('Failed to delete animal:', error);
      // Here, instead of re-throwing the error, we return a rejected promise of the correct type.
      // This ensures that the catch block conforms to the function's return type.
      return Promise.reject(error);
    });
  }


  clearAllAnimals(): Promise<void> {

    return this.getDBPromise().then(db => {
      // remove all data from indexedDB
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);
      store.clear();
      
      transaction.oncomplete = () => {
        console.log('All animals have been deleted.');
      };

      transaction.onerror = (event) => {
        console.error('Failed to delete all animals:', (event.target as IDBRequest).error);
      };
    }
    );
  }


  updateRecord(record: {uuid: string}): Promise<void> {
    // Ensure that the animal object has a 'uuid' property.
    if (!record.uuid) {
      return Promise.reject("Animal object must have a 'uuid' property.") as Promise<void>;
    }
  
    return this.getDBPromise().then(db => {
      if (!db) {
        throw new Error('Database connection is not available.');
      }
  
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(record); // 'put' updates an existing record or adds a new one if it doesn't exist
  
        request.onsuccess = () => {
          resolve();
        };
  
        request.onerror = () => {
          reject(request.error);
        };
  
        // Handle transaction errors.
        transaction.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
  
        // Handle the case where the transaction completes successfully but the request fails.
        transaction.oncomplete = () => {
          if (request.error) {
            reject(request.error);
          }
        };
      });
    }).catch(error => {
      console.error('Failed to update animal:', error);
      // Here, instead of re-throwing the error, we return a rejected promise of the correct type.
      // This ensures that the catch block conforms to the function's return type.
      return Promise.reject(error);
    });
  }
}