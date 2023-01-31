import admin from 'firebase-admin'
import serviceAccount from '../config/firebase.json' assert { type: 'json' }

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

class Contenedor {
  constructor(collection) {
    this.db = admin.firestore()
    this.collection = this.db.collection(collection)
  }
  async getById(id) {
    try {
      // Return document with id
      const doc = await this.collection.doc(id).get()
      return { id: doc.id, ...doc.data() }
    } catch (error) {
      throw new Error(error)
    }
  }

  async getAll() {
    try {
      const snapshot = await this.collection.get()
      const docs = []
      snapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() }))
      return docs
    } catch (error) {
      throw new Error(error)
    }
  }

  async save(item) {
    try {
      const newItem = await this.collection.add(item)
      return newItem.get()
        .then(doc => doc.id)
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateById(id, item) {
    try {
      await this.collection.doc(id).update(item)
      return item
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteById(id) {
    try {
      return await this.collection.doc(id).delete()
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteAll() {
    try {
      const snapshot = await this.collection.get()
      snapshot.forEach(doc => doc.ref.delete())
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default Contenedor
