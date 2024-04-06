import { getDocs, getDoc, query, startAfter, getCountFromServer, setDoc, DocumentSnapshot, CollectionReference, doc, deleteDoc, updateDoc, sum, getAggregateFromServer, AggregateField, average, Firestore, collection, type DocumentData } from "firebase/firestore"; 
import type { IBaseModelRepository } from "../domain/repository";
import type { BaseModel, IBaseModel } from "../domain/model";
import { QueryConstraint, limit, orderBy, where } from "firebase/firestore";
import { QueryWhere, type IQueryFilter, QueryOrderBy, QueryLimit, BaseFilter } from "../../base/domain/filter";

export function x_queries_to_contraints(queries: IQueryFilter[], ordered: boolean = true): QueryConstraint[] {
  const contraints: QueryConstraint[] = []

  for (const query of queries) {
    if (query instanceof QueryWhere) {
      contraints.push(where(query.path, query.operator, query.value))
    }

    if (ordered && query instanceof QueryOrderBy) {
      contraints.push(orderBy(query.path, query.direction))
    }

    if (query instanceof QueryLimit) {
      contraints.push(limit(query.limit))
    }
  }

  console.log(contraints)

  return contraints
}

export abstract class BaseFirestoreModelRepository<T extends BaseModel, U extends IBaseModel> implements IBaseModelRepository<T> {
  abstract db: Firestore
  abstract reference(): string
  abstract fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): T

  public toFirestore(model: T): Partial<U> {
    const payload = model.toPayload()

    delete payload.id

    return payload
  }

  public async get(id: string): Promise<T|undefined> {
    const snapshot = await getDoc(doc(collection(this.db, this.reference()), id))
  
    return snapshot.exists()
      ? this.fromFirestore(snapshot)
      : undefined
  }

  public async store(model: T): Promise<void> {
    await setDoc(doc(collection(this.db, this.reference()), model.id), this.toFirestore(model) as any)
  }

  public async update(id: string, payload: Record<string, any>): Promise<void> {
    await updateDoc(doc(collection(this.db, this.reference()), id), payload)
  }

  public async destroy(id: string): Promise<void> {
    await deleteDoc(doc(collection(this.db, this.reference()), id))
  }

  public async paginate(filter?: BaseFilter, last?: T): Promise<T[]> {
    const queries = x_queries_to_contraints(filter?.queries() ?? [])

    if (last) {
      const prev_snapshot = await getDoc(doc(collection(this.db, this.reference()), last.id))

      queries.unshift(startAfter(prev_snapshot))
    }

    const snapshot = await getDocs(query(collection(this.db, this.reference()), ...queries))

    return snapshot.docs.map((doc) => this.fromFirestore(doc))
  }

  public async count(filter?: BaseFilter): Promise<number> {
    const queries  = x_queries_to_contraints(filter?.queries() ?? [], false)
    const snapshot = await getCountFromServer(query(collection(this.db, this.reference()), ...queries))
  
    return snapshot.data().count
  }

  public async sum(path: string, filter?: BaseFilter): Promise<number> {
    const queries  = x_queries_to_contraints(filter?.queries() ?? [], false)
    const snapshot = await getAggregateFromServer(query(collection(this.db, this.reference()), ...queries), { sum: sum(path) })
  
    return snapshot.data().sum
  }

  public async average(path: string, filter?: BaseFilter): Promise<number> {
    const queries  = x_queries_to_contraints(filter?.queries() ?? [], false)
    const snapshot = await getAggregateFromServer(query(collection(this.db, this.reference()), ...queries), { average: average(path) })
  
    return snapshot.data().average ?? 0
  }
}
