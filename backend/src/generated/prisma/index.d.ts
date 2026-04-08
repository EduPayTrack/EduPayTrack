
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Student
 * 
 */
export type Student = $Result.DefaultSelection<Prisma.$StudentPayload>
/**
 * Model FeeStructure
 * 
 */
export type FeeStructure = $Result.DefaultSelection<Prisma.$FeeStructurePayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model GeneratedReport
 * 
 */
export type GeneratedReport = $Result.DefaultSelection<Prisma.$GeneratedReportPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model SystemRegistry
 * 
 */
export type SystemRegistry = $Result.DefaultSelection<Prisma.$SystemRegistryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  ACCOUNTS: 'ACCOUNTS'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const UserStatus: {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DEACTIVATED: 'DEACTIVATED'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]


export const PaymentMethod: {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOBILE_CREDIT_CARD: 'MOBILE_CREDIT_CARD'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const PaymentStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const VerificationStatus: {
  UNVERIFIED: 'UNVERIFIED',
  VERIFIED: 'VERIFIED',
  FLAGGED: 'FLAGGED'
};

export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus]


export const ReconciliationStatus: {
  UNMATCHED: 'UNMATCHED',
  MATCHED: 'MATCHED'
};

export type ReconciliationStatus = (typeof ReconciliationStatus)[keyof typeof ReconciliationStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type UserStatus = $Enums.UserStatus

export const UserStatus: typeof $Enums.UserStatus

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type VerificationStatus = $Enums.VerificationStatus

export const VerificationStatus: typeof $Enums.VerificationStatus

export type ReconciliationStatus = $Enums.ReconciliationStatus

export const ReconciliationStatus: typeof $Enums.ReconciliationStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.student`: Exposes CRUD operations for the **Student** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Students
    * const students = await prisma.student.findMany()
    * ```
    */
  get student(): Prisma.StudentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.feeStructure`: Exposes CRUD operations for the **FeeStructure** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FeeStructures
    * const feeStructures = await prisma.feeStructure.findMany()
    * ```
    */
  get feeStructure(): Prisma.FeeStructureDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.generatedReport`: Exposes CRUD operations for the **GeneratedReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GeneratedReports
    * const generatedReports = await prisma.generatedReport.findMany()
    * ```
    */
  get generatedReport(): Prisma.GeneratedReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.systemRegistry`: Exposes CRUD operations for the **SystemRegistry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemRegistries
    * const systemRegistries = await prisma.systemRegistry.findMany()
    * ```
    */
  get systemRegistry(): Prisma.SystemRegistryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Student: 'Student',
    FeeStructure: 'FeeStructure',
    Payment: 'Payment',
    GeneratedReport: 'GeneratedReport',
    Notification: 'Notification',
    SystemRegistry: 'SystemRegistry'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "student" | "feeStructure" | "payment" | "generatedReport" | "notification" | "systemRegistry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Student: {
        payload: Prisma.$StudentPayload<ExtArgs>
        fields: Prisma.StudentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findFirst: {
            args: Prisma.StudentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findMany: {
            args: Prisma.StudentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          create: {
            args: Prisma.StudentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          createMany: {
            args: Prisma.StudentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          delete: {
            args: Prisma.StudentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          update: {
            args: Prisma.StudentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          deleteMany: {
            args: Prisma.StudentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          upsert: {
            args: Prisma.StudentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          aggregate: {
            args: Prisma.StudentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudent>
          }
          groupBy: {
            args: Prisma.StudentGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentCountArgs<ExtArgs>
            result: $Utils.Optional<StudentCountAggregateOutputType> | number
          }
        }
      }
      FeeStructure: {
        payload: Prisma.$FeeStructurePayload<ExtArgs>
        fields: Prisma.FeeStructureFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeeStructureFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeeStructureFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload>
          }
          findFirst: {
            args: Prisma.FeeStructureFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeeStructureFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload>
          }
          findMany: {
            args: Prisma.FeeStructureFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload>[]
          }
          create: {
            args: Prisma.FeeStructureCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload>
          }
          createMany: {
            args: Prisma.FeeStructureCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeeStructureCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload>[]
          }
          delete: {
            args: Prisma.FeeStructureDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload>
          }
          update: {
            args: Prisma.FeeStructureUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload>
          }
          deleteMany: {
            args: Prisma.FeeStructureDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeeStructureUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FeeStructureUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload>[]
          }
          upsert: {
            args: Prisma.FeeStructureUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeeStructurePayload>
          }
          aggregate: {
            args: Prisma.FeeStructureAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeeStructure>
          }
          groupBy: {
            args: Prisma.FeeStructureGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeeStructureGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeeStructureCountArgs<ExtArgs>
            result: $Utils.Optional<FeeStructureCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      GeneratedReport: {
        payload: Prisma.$GeneratedReportPayload<ExtArgs>
        fields: Prisma.GeneratedReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GeneratedReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GeneratedReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload>
          }
          findFirst: {
            args: Prisma.GeneratedReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GeneratedReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload>
          }
          findMany: {
            args: Prisma.GeneratedReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload>[]
          }
          create: {
            args: Prisma.GeneratedReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload>
          }
          createMany: {
            args: Prisma.GeneratedReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GeneratedReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload>[]
          }
          delete: {
            args: Prisma.GeneratedReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload>
          }
          update: {
            args: Prisma.GeneratedReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload>
          }
          deleteMany: {
            args: Prisma.GeneratedReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GeneratedReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GeneratedReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload>[]
          }
          upsert: {
            args: Prisma.GeneratedReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GeneratedReportPayload>
          }
          aggregate: {
            args: Prisma.GeneratedReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGeneratedReport>
          }
          groupBy: {
            args: Prisma.GeneratedReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<GeneratedReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.GeneratedReportCountArgs<ExtArgs>
            result: $Utils.Optional<GeneratedReportCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      SystemRegistry: {
        payload: Prisma.$SystemRegistryPayload<ExtArgs>
        fields: Prisma.SystemRegistryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemRegistryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemRegistryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload>
          }
          findFirst: {
            args: Prisma.SystemRegistryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemRegistryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload>
          }
          findMany: {
            args: Prisma.SystemRegistryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload>[]
          }
          create: {
            args: Prisma.SystemRegistryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload>
          }
          createMany: {
            args: Prisma.SystemRegistryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemRegistryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload>[]
          }
          delete: {
            args: Prisma.SystemRegistryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload>
          }
          update: {
            args: Prisma.SystemRegistryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload>
          }
          deleteMany: {
            args: Prisma.SystemRegistryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemRegistryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemRegistryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload>[]
          }
          upsert: {
            args: Prisma.SystemRegistryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemRegistryPayload>
          }
          aggregate: {
            args: Prisma.SystemRegistryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemRegistry>
          }
          groupBy: {
            args: Prisma.SystemRegistryGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemRegistryGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemRegistryCountArgs<ExtArgs>
            result: $Utils.Optional<SystemRegistryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    student?: StudentOmit
    feeStructure?: FeeStructureOmit
    payment?: PaymentOmit
    generatedReport?: GeneratedReportOmit
    notification?: NotificationOmit
    systemRegistry?: SystemRegistryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    verifiedPayments: number
    reviewedPayments: number
    reconciledPayments: number
    generatedReports: number
    notifications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    verifiedPayments?: boolean | UserCountOutputTypeCountVerifiedPaymentsArgs
    reviewedPayments?: boolean | UserCountOutputTypeCountReviewedPaymentsArgs
    reconciledPayments?: boolean | UserCountOutputTypeCountReconciledPaymentsArgs
    generatedReports?: boolean | UserCountOutputTypeCountGeneratedReportsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountVerifiedPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReviewedPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReconciledPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGeneratedReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GeneratedReportWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type StudentCountOutputType
   */

  export type StudentCountOutputType = {
    payments: number
  }

  export type StudentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | StudentCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCountOutputType
     */
    select?: StudentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    role: $Enums.UserRole | null
    status: $Enums.UserStatus | null
    profilePictureUrl: string | null
    currentSessionId: string | null
    sessionExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    firstName: string | null
    lastName: string | null
    role: $Enums.UserRole | null
    status: $Enums.UserStatus | null
    profilePictureUrl: string | null
    currentSessionId: string | null
    sessionExpires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    firstName: number
    lastName: number
    role: number
    status: number
    profilePictureUrl: number
    currentSessionId: number
    sessionExpires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    role?: true
    status?: true
    profilePictureUrl?: true
    currentSessionId?: true
    sessionExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    role?: true
    status?: true
    profilePictureUrl?: true
    currentSessionId?: true
    sessionExpires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    firstName?: true
    lastName?: true
    role?: true
    status?: true
    profilePictureUrl?: true
    currentSessionId?: true
    sessionExpires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    firstName: string | null
    lastName: string | null
    role: $Enums.UserRole
    status: $Enums.UserStatus
    profilePictureUrl: string | null
    currentSessionId: string | null
    sessionExpires: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    status?: boolean
    profilePictureUrl?: boolean
    currentSessionId?: boolean
    sessionExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    student?: boolean | User$studentArgs<ExtArgs>
    verifiedPayments?: boolean | User$verifiedPaymentsArgs<ExtArgs>
    reviewedPayments?: boolean | User$reviewedPaymentsArgs<ExtArgs>
    reconciledPayments?: boolean | User$reconciledPaymentsArgs<ExtArgs>
    generatedReports?: boolean | User$generatedReportsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    status?: boolean
    profilePictureUrl?: boolean
    currentSessionId?: boolean
    sessionExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    status?: boolean
    profilePictureUrl?: boolean
    currentSessionId?: boolean
    sessionExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    firstName?: boolean
    lastName?: boolean
    role?: boolean
    status?: boolean
    profilePictureUrl?: boolean
    currentSessionId?: boolean
    sessionExpires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "firstName" | "lastName" | "role" | "status" | "profilePictureUrl" | "currentSessionId" | "sessionExpires" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | User$studentArgs<ExtArgs>
    verifiedPayments?: boolean | User$verifiedPaymentsArgs<ExtArgs>
    reviewedPayments?: boolean | User$reviewedPaymentsArgs<ExtArgs>
    reconciledPayments?: boolean | User$reconciledPaymentsArgs<ExtArgs>
    generatedReports?: boolean | User$generatedReportsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs> | null
      verifiedPayments: Prisma.$PaymentPayload<ExtArgs>[]
      reviewedPayments: Prisma.$PaymentPayload<ExtArgs>[]
      reconciledPayments: Prisma.$PaymentPayload<ExtArgs>[]
      generatedReports: Prisma.$GeneratedReportPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      firstName: string | null
      lastName: string | null
      role: $Enums.UserRole
      status: $Enums.UserStatus
      profilePictureUrl: string | null
      currentSessionId: string | null
      sessionExpires: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends User$studentArgs<ExtArgs> = {}>(args?: Subset<T, User$studentArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    verifiedPayments<T extends User$verifiedPaymentsArgs<ExtArgs> = {}>(args?: Subset<T, User$verifiedPaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reviewedPayments<T extends User$reviewedPaymentsArgs<ExtArgs> = {}>(args?: Subset<T, User$reviewedPaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reconciledPayments<T extends User$reconciledPaymentsArgs<ExtArgs> = {}>(args?: Subset<T, User$reconciledPaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    generatedReports<T extends User$generatedReportsArgs<ExtArgs> = {}>(args?: Subset<T, User$generatedReportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly status: FieldRef<"User", 'UserStatus'>
    readonly profilePictureUrl: FieldRef<"User", 'String'>
    readonly currentSessionId: FieldRef<"User", 'String'>
    readonly sessionExpires: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.student
   */
  export type User$studentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    where?: StudentWhereInput
  }

  /**
   * User.verifiedPayments
   */
  export type User$verifiedPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * User.reviewedPayments
   */
  export type User$reviewedPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * User.reconciledPayments
   */
  export type User$reconciledPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * User.generatedReports
   */
  export type User$generatedReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
    where?: GeneratedReportWhereInput
    orderBy?: GeneratedReportOrderByWithRelationInput | GeneratedReportOrderByWithRelationInput[]
    cursor?: GeneratedReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GeneratedReportScalarFieldEnum | GeneratedReportScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Student
   */

  export type AggregateStudent = {
    _count: StudentCountAggregateOutputType | null
    _avg: StudentAvgAggregateOutputType | null
    _sum: StudentSumAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  export type StudentAvgAggregateOutputType = {
    currentBalance: Decimal | null
  }

  export type StudentSumAggregateOutputType = {
    currentBalance: Decimal | null
  }

  export type StudentMinAggregateOutputType = {
    id: string | null
    userId: string | null
    studentCode: string | null
    firstName: string | null
    lastName: string | null
    program: string | null
    classLevel: string | null
    academicYear: string | null
    term: string | null
    semester: string | null
    phone: string | null
    currentBalance: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    studentCode: string | null
    firstName: string | null
    lastName: string | null
    program: string | null
    classLevel: string | null
    academicYear: string | null
    term: string | null
    semester: string | null
    phone: string | null
    currentBalance: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StudentCountAggregateOutputType = {
    id: number
    userId: number
    studentCode: number
    firstName: number
    lastName: number
    program: number
    classLevel: number
    academicYear: number
    term: number
    semester: number
    phone: number
    currentBalance: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StudentAvgAggregateInputType = {
    currentBalance?: true
  }

  export type StudentSumAggregateInputType = {
    currentBalance?: true
  }

  export type StudentMinAggregateInputType = {
    id?: true
    userId?: true
    studentCode?: true
    firstName?: true
    lastName?: true
    program?: true
    classLevel?: true
    academicYear?: true
    term?: true
    semester?: true
    phone?: true
    currentBalance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentMaxAggregateInputType = {
    id?: true
    userId?: true
    studentCode?: true
    firstName?: true
    lastName?: true
    program?: true
    classLevel?: true
    academicYear?: true
    term?: true
    semester?: true
    phone?: true
    currentBalance?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StudentCountAggregateInputType = {
    id?: true
    userId?: true
    studentCode?: true
    firstName?: true
    lastName?: true
    program?: true
    classLevel?: true
    academicYear?: true
    term?: true
    semester?: true
    phone?: true
    currentBalance?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StudentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Student to aggregate.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Students
    **/
    _count?: true | StudentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentMaxAggregateInputType
  }

  export type GetStudentAggregateType<T extends StudentAggregateArgs> = {
        [P in keyof T & keyof AggregateStudent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudent[P]>
      : GetScalarType<T[P], AggregateStudent[P]>
  }




  export type StudentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithAggregationInput | StudentOrderByWithAggregationInput[]
    by: StudentScalarFieldEnum[] | StudentScalarFieldEnum
    having?: StudentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentCountAggregateInputType | true
    _avg?: StudentAvgAggregateInputType
    _sum?: StudentSumAggregateInputType
    _min?: StudentMinAggregateInputType
    _max?: StudentMaxAggregateInputType
  }

  export type StudentGroupByOutputType = {
    id: string
    userId: string
    studentCode: string
    firstName: string
    lastName: string
    program: string
    classLevel: string | null
    academicYear: string | null
    term: string | null
    semester: string | null
    phone: string | null
    currentBalance: Decimal
    createdAt: Date
    updatedAt: Date
    _count: StudentCountAggregateOutputType | null
    _avg: StudentAvgAggregateOutputType | null
    _sum: StudentSumAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  type GetStudentGroupByPayload<T extends StudentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentGroupByOutputType[P]>
            : GetScalarType<T[P], StudentGroupByOutputType[P]>
        }
      >
    >


  export type StudentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    studentCode?: boolean
    firstName?: boolean
    lastName?: boolean
    program?: boolean
    classLevel?: boolean
    academicYear?: boolean
    term?: boolean
    semester?: boolean
    phone?: boolean
    currentBalance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    payments?: boolean | Student$paymentsArgs<ExtArgs>
    _count?: boolean | StudentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    studentCode?: boolean
    firstName?: boolean
    lastName?: boolean
    program?: boolean
    classLevel?: boolean
    academicYear?: boolean
    term?: boolean
    semester?: boolean
    phone?: boolean
    currentBalance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    studentCode?: boolean
    firstName?: boolean
    lastName?: boolean
    program?: boolean
    classLevel?: boolean
    academicYear?: boolean
    term?: boolean
    semester?: boolean
    phone?: boolean
    currentBalance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectScalar = {
    id?: boolean
    userId?: boolean
    studentCode?: boolean
    firstName?: boolean
    lastName?: boolean
    program?: boolean
    classLevel?: boolean
    academicYear?: boolean
    term?: boolean
    semester?: boolean
    phone?: boolean
    currentBalance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StudentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "studentCode" | "firstName" | "lastName" | "program" | "classLevel" | "academicYear" | "term" | "semester" | "phone" | "currentBalance" | "createdAt" | "updatedAt", ExtArgs["result"]["student"]>
  export type StudentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    payments?: boolean | Student$paymentsArgs<ExtArgs>
    _count?: boolean | StudentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StudentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type StudentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $StudentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Student"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      payments: Prisma.$PaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      studentCode: string
      firstName: string
      lastName: string
      program: string
      classLevel: string | null
      academicYear: string | null
      term: string | null
      semester: string | null
      phone: string | null
      currentBalance: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["student"]>
    composites: {}
  }

  type StudentGetPayload<S extends boolean | null | undefined | StudentDefaultArgs> = $Result.GetResult<Prisma.$StudentPayload, S>

  type StudentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentCountAggregateInputType | true
    }

  export interface StudentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Student'], meta: { name: 'Student' } }
    /**
     * Find zero or one Student that matches the filter.
     * @param {StudentFindUniqueArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentFindUniqueArgs>(args: SelectSubset<T, StudentFindUniqueArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Student that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentFindUniqueOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentFindFirstArgs>(args?: SelectSubset<T, StudentFindFirstArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Students that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Students
     * const students = await prisma.student.findMany()
     * 
     * // Get first 10 Students
     * const students = await prisma.student.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentWithIdOnly = await prisma.student.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentFindManyArgs>(args?: SelectSubset<T, StudentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Student.
     * @param {StudentCreateArgs} args - Arguments to create a Student.
     * @example
     * // Create one Student
     * const Student = await prisma.student.create({
     *   data: {
     *     // ... data to create a Student
     *   }
     * })
     * 
     */
    create<T extends StudentCreateArgs>(args: SelectSubset<T, StudentCreateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Students.
     * @param {StudentCreateManyArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentCreateManyArgs>(args?: SelectSubset<T, StudentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Students and returns the data saved in the database.
     * @param {StudentCreateManyAndReturnArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Student.
     * @param {StudentDeleteArgs} args - Arguments to delete one Student.
     * @example
     * // Delete one Student
     * const Student = await prisma.student.delete({
     *   where: {
     *     // ... filter to delete one Student
     *   }
     * })
     * 
     */
    delete<T extends StudentDeleteArgs>(args: SelectSubset<T, StudentDeleteArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Student.
     * @param {StudentUpdateArgs} args - Arguments to update one Student.
     * @example
     * // Update one Student
     * const student = await prisma.student.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentUpdateArgs>(args: SelectSubset<T, StudentUpdateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Students.
     * @param {StudentDeleteManyArgs} args - Arguments to filter Students to delete.
     * @example
     * // Delete a few Students
     * const { count } = await prisma.student.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentDeleteManyArgs>(args?: SelectSubset<T, StudentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentUpdateManyArgs>(args: SelectSubset<T, StudentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students and returns the data updated in the database.
     * @param {StudentUpdateManyAndReturnArgs} args - Arguments to update many Students.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StudentUpdateManyAndReturnArgs>(args: SelectSubset<T, StudentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Student.
     * @param {StudentUpsertArgs} args - Arguments to update or create a Student.
     * @example
     * // Update or create a Student
     * const student = await prisma.student.upsert({
     *   create: {
     *     // ... data to create a Student
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Student we want to update
     *   }
     * })
     */
    upsert<T extends StudentUpsertArgs>(args: SelectSubset<T, StudentUpsertArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCountArgs} args - Arguments to filter Students to count.
     * @example
     * // Count the number of Students
     * const count = await prisma.student.count({
     *   where: {
     *     // ... the filter for the Students we want to count
     *   }
     * })
    **/
    count<T extends StudentCountArgs>(
      args?: Subset<T, StudentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentAggregateArgs>(args: Subset<T, StudentAggregateArgs>): Prisma.PrismaPromise<GetStudentAggregateType<T>>

    /**
     * Group by Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentGroupByArgs['orderBy'] }
        : { orderBy?: StudentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Student model
   */
  readonly fields: StudentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Student.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    payments<T extends Student$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Student$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Student model
   */
  interface StudentFieldRefs {
    readonly id: FieldRef<"Student", 'String'>
    readonly userId: FieldRef<"Student", 'String'>
    readonly studentCode: FieldRef<"Student", 'String'>
    readonly firstName: FieldRef<"Student", 'String'>
    readonly lastName: FieldRef<"Student", 'String'>
    readonly program: FieldRef<"Student", 'String'>
    readonly classLevel: FieldRef<"Student", 'String'>
    readonly academicYear: FieldRef<"Student", 'String'>
    readonly term: FieldRef<"Student", 'String'>
    readonly semester: FieldRef<"Student", 'String'>
    readonly phone: FieldRef<"Student", 'String'>
    readonly currentBalance: FieldRef<"Student", 'Decimal'>
    readonly createdAt: FieldRef<"Student", 'DateTime'>
    readonly updatedAt: FieldRef<"Student", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Student findUnique
   */
  export type StudentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findUniqueOrThrow
   */
  export type StudentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findFirst
   */
  export type StudentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findFirstOrThrow
   */
  export type StudentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findMany
   */
  export type StudentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Students to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student create
   */
  export type StudentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The data needed to create a Student.
     */
    data: XOR<StudentCreateInput, StudentUncheckedCreateInput>
  }

  /**
   * Student createMany
   */
  export type StudentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Student createManyAndReturn
   */
  export type StudentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Student update
   */
  export type StudentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The data needed to update a Student.
     */
    data: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
    /**
     * Choose, which Student to update.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student updateMany
   */
  export type StudentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to update.
     */
    limit?: number
  }

  /**
   * Student updateManyAndReturn
   */
  export type StudentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Student upsert
   */
  export type StudentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The filter to search for the Student to update in case it exists.
     */
    where: StudentWhereUniqueInput
    /**
     * In case the Student found by the `where` argument doesn't exist, create a new Student with this data.
     */
    create: XOR<StudentCreateInput, StudentUncheckedCreateInput>
    /**
     * In case the Student was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
  }

  /**
   * Student delete
   */
  export type StudentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter which Student to delete.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student deleteMany
   */
  export type StudentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Students to delete
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to delete.
     */
    limit?: number
  }

  /**
   * Student.payments
   */
  export type Student$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Student without action
   */
  export type StudentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
  }


  /**
   * Model FeeStructure
   */

  export type AggregateFeeStructure = {
    _count: FeeStructureCountAggregateOutputType | null
    _avg: FeeStructureAvgAggregateOutputType | null
    _sum: FeeStructureSumAggregateOutputType | null
    _min: FeeStructureMinAggregateOutputType | null
    _max: FeeStructureMaxAggregateOutputType | null
  }

  export type FeeStructureAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type FeeStructureSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type FeeStructureMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    amount: Decimal | null
    program: string | null
    classLevel: string | null
    term: string | null
    semester: string | null
    academicYear: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FeeStructureMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    amount: Decimal | null
    program: string | null
    classLevel: string | null
    term: string | null
    semester: string | null
    academicYear: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FeeStructureCountAggregateOutputType = {
    id: number
    title: number
    description: number
    amount: number
    program: number
    classLevel: number
    term: number
    semester: number
    academicYear: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FeeStructureAvgAggregateInputType = {
    amount?: true
  }

  export type FeeStructureSumAggregateInputType = {
    amount?: true
  }

  export type FeeStructureMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    amount?: true
    program?: true
    classLevel?: true
    term?: true
    semester?: true
    academicYear?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FeeStructureMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    amount?: true
    program?: true
    classLevel?: true
    term?: true
    semester?: true
    academicYear?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FeeStructureCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    amount?: true
    program?: true
    classLevel?: true
    term?: true
    semester?: true
    academicYear?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FeeStructureAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FeeStructure to aggregate.
     */
    where?: FeeStructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeeStructures to fetch.
     */
    orderBy?: FeeStructureOrderByWithRelationInput | FeeStructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeeStructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeeStructures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeeStructures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FeeStructures
    **/
    _count?: true | FeeStructureCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FeeStructureAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FeeStructureSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeeStructureMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeeStructureMaxAggregateInputType
  }

  export type GetFeeStructureAggregateType<T extends FeeStructureAggregateArgs> = {
        [P in keyof T & keyof AggregateFeeStructure]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeeStructure[P]>
      : GetScalarType<T[P], AggregateFeeStructure[P]>
  }




  export type FeeStructureGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeeStructureWhereInput
    orderBy?: FeeStructureOrderByWithAggregationInput | FeeStructureOrderByWithAggregationInput[]
    by: FeeStructureScalarFieldEnum[] | FeeStructureScalarFieldEnum
    having?: FeeStructureScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeeStructureCountAggregateInputType | true
    _avg?: FeeStructureAvgAggregateInputType
    _sum?: FeeStructureSumAggregateInputType
    _min?: FeeStructureMinAggregateInputType
    _max?: FeeStructureMaxAggregateInputType
  }

  export type FeeStructureGroupByOutputType = {
    id: string
    title: string
    description: string | null
    amount: Decimal
    program: string | null
    classLevel: string | null
    term: string | null
    semester: string | null
    academicYear: string | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: FeeStructureCountAggregateOutputType | null
    _avg: FeeStructureAvgAggregateOutputType | null
    _sum: FeeStructureSumAggregateOutputType | null
    _min: FeeStructureMinAggregateOutputType | null
    _max: FeeStructureMaxAggregateOutputType | null
  }

  type GetFeeStructureGroupByPayload<T extends FeeStructureGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeeStructureGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeeStructureGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeeStructureGroupByOutputType[P]>
            : GetScalarType<T[P], FeeStructureGroupByOutputType[P]>
        }
      >
    >


  export type FeeStructureSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    amount?: boolean
    program?: boolean
    classLevel?: boolean
    term?: boolean
    semester?: boolean
    academicYear?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["feeStructure"]>

  export type FeeStructureSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    amount?: boolean
    program?: boolean
    classLevel?: boolean
    term?: boolean
    semester?: boolean
    academicYear?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["feeStructure"]>

  export type FeeStructureSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    amount?: boolean
    program?: boolean
    classLevel?: boolean
    term?: boolean
    semester?: boolean
    academicYear?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["feeStructure"]>

  export type FeeStructureSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    amount?: boolean
    program?: boolean
    classLevel?: boolean
    term?: boolean
    semester?: boolean
    academicYear?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FeeStructureOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "amount" | "program" | "classLevel" | "term" | "semester" | "academicYear" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["feeStructure"]>

  export type $FeeStructurePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FeeStructure"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      amount: Prisma.Decimal
      program: string | null
      classLevel: string | null
      term: string | null
      semester: string | null
      academicYear: string | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["feeStructure"]>
    composites: {}
  }

  type FeeStructureGetPayload<S extends boolean | null | undefined | FeeStructureDefaultArgs> = $Result.GetResult<Prisma.$FeeStructurePayload, S>

  type FeeStructureCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FeeStructureFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FeeStructureCountAggregateInputType | true
    }

  export interface FeeStructureDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FeeStructure'], meta: { name: 'FeeStructure' } }
    /**
     * Find zero or one FeeStructure that matches the filter.
     * @param {FeeStructureFindUniqueArgs} args - Arguments to find a FeeStructure
     * @example
     * // Get one FeeStructure
     * const feeStructure = await prisma.feeStructure.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeeStructureFindUniqueArgs>(args: SelectSubset<T, FeeStructureFindUniqueArgs<ExtArgs>>): Prisma__FeeStructureClient<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FeeStructure that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FeeStructureFindUniqueOrThrowArgs} args - Arguments to find a FeeStructure
     * @example
     * // Get one FeeStructure
     * const feeStructure = await prisma.feeStructure.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeeStructureFindUniqueOrThrowArgs>(args: SelectSubset<T, FeeStructureFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeeStructureClient<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FeeStructure that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeeStructureFindFirstArgs} args - Arguments to find a FeeStructure
     * @example
     * // Get one FeeStructure
     * const feeStructure = await prisma.feeStructure.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeeStructureFindFirstArgs>(args?: SelectSubset<T, FeeStructureFindFirstArgs<ExtArgs>>): Prisma__FeeStructureClient<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FeeStructure that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeeStructureFindFirstOrThrowArgs} args - Arguments to find a FeeStructure
     * @example
     * // Get one FeeStructure
     * const feeStructure = await prisma.feeStructure.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeeStructureFindFirstOrThrowArgs>(args?: SelectSubset<T, FeeStructureFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeeStructureClient<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FeeStructures that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeeStructureFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FeeStructures
     * const feeStructures = await prisma.feeStructure.findMany()
     * 
     * // Get first 10 FeeStructures
     * const feeStructures = await prisma.feeStructure.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feeStructureWithIdOnly = await prisma.feeStructure.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeeStructureFindManyArgs>(args?: SelectSubset<T, FeeStructureFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FeeStructure.
     * @param {FeeStructureCreateArgs} args - Arguments to create a FeeStructure.
     * @example
     * // Create one FeeStructure
     * const FeeStructure = await prisma.feeStructure.create({
     *   data: {
     *     // ... data to create a FeeStructure
     *   }
     * })
     * 
     */
    create<T extends FeeStructureCreateArgs>(args: SelectSubset<T, FeeStructureCreateArgs<ExtArgs>>): Prisma__FeeStructureClient<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FeeStructures.
     * @param {FeeStructureCreateManyArgs} args - Arguments to create many FeeStructures.
     * @example
     * // Create many FeeStructures
     * const feeStructure = await prisma.feeStructure.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeeStructureCreateManyArgs>(args?: SelectSubset<T, FeeStructureCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FeeStructures and returns the data saved in the database.
     * @param {FeeStructureCreateManyAndReturnArgs} args - Arguments to create many FeeStructures.
     * @example
     * // Create many FeeStructures
     * const feeStructure = await prisma.feeStructure.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FeeStructures and only return the `id`
     * const feeStructureWithIdOnly = await prisma.feeStructure.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeeStructureCreateManyAndReturnArgs>(args?: SelectSubset<T, FeeStructureCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FeeStructure.
     * @param {FeeStructureDeleteArgs} args - Arguments to delete one FeeStructure.
     * @example
     * // Delete one FeeStructure
     * const FeeStructure = await prisma.feeStructure.delete({
     *   where: {
     *     // ... filter to delete one FeeStructure
     *   }
     * })
     * 
     */
    delete<T extends FeeStructureDeleteArgs>(args: SelectSubset<T, FeeStructureDeleteArgs<ExtArgs>>): Prisma__FeeStructureClient<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FeeStructure.
     * @param {FeeStructureUpdateArgs} args - Arguments to update one FeeStructure.
     * @example
     * // Update one FeeStructure
     * const feeStructure = await prisma.feeStructure.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeeStructureUpdateArgs>(args: SelectSubset<T, FeeStructureUpdateArgs<ExtArgs>>): Prisma__FeeStructureClient<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FeeStructures.
     * @param {FeeStructureDeleteManyArgs} args - Arguments to filter FeeStructures to delete.
     * @example
     * // Delete a few FeeStructures
     * const { count } = await prisma.feeStructure.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeeStructureDeleteManyArgs>(args?: SelectSubset<T, FeeStructureDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FeeStructures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeeStructureUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FeeStructures
     * const feeStructure = await prisma.feeStructure.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeeStructureUpdateManyArgs>(args: SelectSubset<T, FeeStructureUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FeeStructures and returns the data updated in the database.
     * @param {FeeStructureUpdateManyAndReturnArgs} args - Arguments to update many FeeStructures.
     * @example
     * // Update many FeeStructures
     * const feeStructure = await prisma.feeStructure.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FeeStructures and only return the `id`
     * const feeStructureWithIdOnly = await prisma.feeStructure.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FeeStructureUpdateManyAndReturnArgs>(args: SelectSubset<T, FeeStructureUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FeeStructure.
     * @param {FeeStructureUpsertArgs} args - Arguments to update or create a FeeStructure.
     * @example
     * // Update or create a FeeStructure
     * const feeStructure = await prisma.feeStructure.upsert({
     *   create: {
     *     // ... data to create a FeeStructure
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FeeStructure we want to update
     *   }
     * })
     */
    upsert<T extends FeeStructureUpsertArgs>(args: SelectSubset<T, FeeStructureUpsertArgs<ExtArgs>>): Prisma__FeeStructureClient<$Result.GetResult<Prisma.$FeeStructurePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FeeStructures.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeeStructureCountArgs} args - Arguments to filter FeeStructures to count.
     * @example
     * // Count the number of FeeStructures
     * const count = await prisma.feeStructure.count({
     *   where: {
     *     // ... the filter for the FeeStructures we want to count
     *   }
     * })
    **/
    count<T extends FeeStructureCountArgs>(
      args?: Subset<T, FeeStructureCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeeStructureCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FeeStructure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeeStructureAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeeStructureAggregateArgs>(args: Subset<T, FeeStructureAggregateArgs>): Prisma.PrismaPromise<GetFeeStructureAggregateType<T>>

    /**
     * Group by FeeStructure.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeeStructureGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeeStructureGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeeStructureGroupByArgs['orderBy'] }
        : { orderBy?: FeeStructureGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeeStructureGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeeStructureGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FeeStructure model
   */
  readonly fields: FeeStructureFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FeeStructure.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeeStructureClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FeeStructure model
   */
  interface FeeStructureFieldRefs {
    readonly id: FieldRef<"FeeStructure", 'String'>
    readonly title: FieldRef<"FeeStructure", 'String'>
    readonly description: FieldRef<"FeeStructure", 'String'>
    readonly amount: FieldRef<"FeeStructure", 'Decimal'>
    readonly program: FieldRef<"FeeStructure", 'String'>
    readonly classLevel: FieldRef<"FeeStructure", 'String'>
    readonly term: FieldRef<"FeeStructure", 'String'>
    readonly semester: FieldRef<"FeeStructure", 'String'>
    readonly academicYear: FieldRef<"FeeStructure", 'String'>
    readonly active: FieldRef<"FeeStructure", 'Boolean'>
    readonly createdAt: FieldRef<"FeeStructure", 'DateTime'>
    readonly updatedAt: FieldRef<"FeeStructure", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FeeStructure findUnique
   */
  export type FeeStructureFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * Filter, which FeeStructure to fetch.
     */
    where: FeeStructureWhereUniqueInput
  }

  /**
   * FeeStructure findUniqueOrThrow
   */
  export type FeeStructureFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * Filter, which FeeStructure to fetch.
     */
    where: FeeStructureWhereUniqueInput
  }

  /**
   * FeeStructure findFirst
   */
  export type FeeStructureFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * Filter, which FeeStructure to fetch.
     */
    where?: FeeStructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeeStructures to fetch.
     */
    orderBy?: FeeStructureOrderByWithRelationInput | FeeStructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FeeStructures.
     */
    cursor?: FeeStructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeeStructures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeeStructures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FeeStructures.
     */
    distinct?: FeeStructureScalarFieldEnum | FeeStructureScalarFieldEnum[]
  }

  /**
   * FeeStructure findFirstOrThrow
   */
  export type FeeStructureFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * Filter, which FeeStructure to fetch.
     */
    where?: FeeStructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeeStructures to fetch.
     */
    orderBy?: FeeStructureOrderByWithRelationInput | FeeStructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FeeStructures.
     */
    cursor?: FeeStructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeeStructures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeeStructures.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FeeStructures.
     */
    distinct?: FeeStructureScalarFieldEnum | FeeStructureScalarFieldEnum[]
  }

  /**
   * FeeStructure findMany
   */
  export type FeeStructureFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * Filter, which FeeStructures to fetch.
     */
    where?: FeeStructureWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeeStructures to fetch.
     */
    orderBy?: FeeStructureOrderByWithRelationInput | FeeStructureOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FeeStructures.
     */
    cursor?: FeeStructureWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeeStructures from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeeStructures.
     */
    skip?: number
    distinct?: FeeStructureScalarFieldEnum | FeeStructureScalarFieldEnum[]
  }

  /**
   * FeeStructure create
   */
  export type FeeStructureCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * The data needed to create a FeeStructure.
     */
    data: XOR<FeeStructureCreateInput, FeeStructureUncheckedCreateInput>
  }

  /**
   * FeeStructure createMany
   */
  export type FeeStructureCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FeeStructures.
     */
    data: FeeStructureCreateManyInput | FeeStructureCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FeeStructure createManyAndReturn
   */
  export type FeeStructureCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * The data used to create many FeeStructures.
     */
    data: FeeStructureCreateManyInput | FeeStructureCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FeeStructure update
   */
  export type FeeStructureUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * The data needed to update a FeeStructure.
     */
    data: XOR<FeeStructureUpdateInput, FeeStructureUncheckedUpdateInput>
    /**
     * Choose, which FeeStructure to update.
     */
    where: FeeStructureWhereUniqueInput
  }

  /**
   * FeeStructure updateMany
   */
  export type FeeStructureUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FeeStructures.
     */
    data: XOR<FeeStructureUpdateManyMutationInput, FeeStructureUncheckedUpdateManyInput>
    /**
     * Filter which FeeStructures to update
     */
    where?: FeeStructureWhereInput
    /**
     * Limit how many FeeStructures to update.
     */
    limit?: number
  }

  /**
   * FeeStructure updateManyAndReturn
   */
  export type FeeStructureUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * The data used to update FeeStructures.
     */
    data: XOR<FeeStructureUpdateManyMutationInput, FeeStructureUncheckedUpdateManyInput>
    /**
     * Filter which FeeStructures to update
     */
    where?: FeeStructureWhereInput
    /**
     * Limit how many FeeStructures to update.
     */
    limit?: number
  }

  /**
   * FeeStructure upsert
   */
  export type FeeStructureUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * The filter to search for the FeeStructure to update in case it exists.
     */
    where: FeeStructureWhereUniqueInput
    /**
     * In case the FeeStructure found by the `where` argument doesn't exist, create a new FeeStructure with this data.
     */
    create: XOR<FeeStructureCreateInput, FeeStructureUncheckedCreateInput>
    /**
     * In case the FeeStructure was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeeStructureUpdateInput, FeeStructureUncheckedUpdateInput>
  }

  /**
   * FeeStructure delete
   */
  export type FeeStructureDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
    /**
     * Filter which FeeStructure to delete.
     */
    where: FeeStructureWhereUniqueInput
  }

  /**
   * FeeStructure deleteMany
   */
  export type FeeStructureDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FeeStructures to delete
     */
    where?: FeeStructureWhereInput
    /**
     * Limit how many FeeStructures to delete.
     */
    limit?: number
  }

  /**
   * FeeStructure without action
   */
  export type FeeStructureDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeeStructure
     */
    select?: FeeStructureSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FeeStructure
     */
    omit?: FeeStructureOmit<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: Decimal | null
    ocrAmount: Decimal | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: Decimal | null
    ocrAmount: Decimal | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    studentId: string | null
    amount: Decimal | null
    currency: string | null
    method: $Enums.PaymentMethod | null
    externalReference: string | null
    receiptNumber: string | null
    proofUrl: string | null
    payerName: string | null
    paymentDate: Date | null
    submittedAt: Date | null
    status: $Enums.PaymentStatus | null
    verificationStatus: $Enums.VerificationStatus | null
    duplicateFlag: boolean | null
    ocrText: string | null
    ocrAmount: Decimal | null
    ocrReference: string | null
    notes: string | null
    verificationNotes: string | null
    reviewNotes: string | null
    reconciliationStatus: $Enums.ReconciliationStatus | null
    reconciliationNote: string | null
    reconciledAt: Date | null
    reconciledBy: string | null
    verifiedBy: string | null
    verifiedAt: Date | null
    reviewedAt: Date | null
    reviewerId: string | null
    academicYear: string | null
    term: string | null
    semester: string | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    studentId: string | null
    amount: Decimal | null
    currency: string | null
    method: $Enums.PaymentMethod | null
    externalReference: string | null
    receiptNumber: string | null
    proofUrl: string | null
    payerName: string | null
    paymentDate: Date | null
    submittedAt: Date | null
    status: $Enums.PaymentStatus | null
    verificationStatus: $Enums.VerificationStatus | null
    duplicateFlag: boolean | null
    ocrText: string | null
    ocrAmount: Decimal | null
    ocrReference: string | null
    notes: string | null
    verificationNotes: string | null
    reviewNotes: string | null
    reconciliationStatus: $Enums.ReconciliationStatus | null
    reconciliationNote: string | null
    reconciledAt: Date | null
    reconciledBy: string | null
    verifiedBy: string | null
    verifiedAt: Date | null
    reviewedAt: Date | null
    reviewerId: string | null
    academicYear: string | null
    term: string | null
    semester: string | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    studentId: number
    amount: number
    currency: number
    method: number
    externalReference: number
    receiptNumber: number
    proofUrl: number
    payerName: number
    paymentDate: number
    submittedAt: number
    status: number
    verificationStatus: number
    duplicateFlag: number
    ocrText: number
    ocrAmount: number
    ocrReference: number
    notes: number
    verificationNotes: number
    reviewNotes: number
    reconciliationStatus: number
    reconciliationNote: number
    reconciledAt: number
    reconciledBy: number
    verifiedBy: number
    verifiedAt: number
    reviewedAt: number
    reviewerId: number
    academicYear: number
    term: number
    semester: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
    ocrAmount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
    ocrAmount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    studentId?: true
    amount?: true
    currency?: true
    method?: true
    externalReference?: true
    receiptNumber?: true
    proofUrl?: true
    payerName?: true
    paymentDate?: true
    submittedAt?: true
    status?: true
    verificationStatus?: true
    duplicateFlag?: true
    ocrText?: true
    ocrAmount?: true
    ocrReference?: true
    notes?: true
    verificationNotes?: true
    reviewNotes?: true
    reconciliationStatus?: true
    reconciliationNote?: true
    reconciledAt?: true
    reconciledBy?: true
    verifiedBy?: true
    verifiedAt?: true
    reviewedAt?: true
    reviewerId?: true
    academicYear?: true
    term?: true
    semester?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    studentId?: true
    amount?: true
    currency?: true
    method?: true
    externalReference?: true
    receiptNumber?: true
    proofUrl?: true
    payerName?: true
    paymentDate?: true
    submittedAt?: true
    status?: true
    verificationStatus?: true
    duplicateFlag?: true
    ocrText?: true
    ocrAmount?: true
    ocrReference?: true
    notes?: true
    verificationNotes?: true
    reviewNotes?: true
    reconciliationStatus?: true
    reconciliationNote?: true
    reconciledAt?: true
    reconciledBy?: true
    verifiedBy?: true
    verifiedAt?: true
    reviewedAt?: true
    reviewerId?: true
    academicYear?: true
    term?: true
    semester?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    studentId?: true
    amount?: true
    currency?: true
    method?: true
    externalReference?: true
    receiptNumber?: true
    proofUrl?: true
    payerName?: true
    paymentDate?: true
    submittedAt?: true
    status?: true
    verificationStatus?: true
    duplicateFlag?: true
    ocrText?: true
    ocrAmount?: true
    ocrReference?: true
    notes?: true
    verificationNotes?: true
    reviewNotes?: true
    reconciliationStatus?: true
    reconciliationNote?: true
    reconciledAt?: true
    reconciledBy?: true
    verifiedBy?: true
    verifiedAt?: true
    reviewedAt?: true
    reviewerId?: true
    academicYear?: true
    term?: true
    semester?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    studentId: string
    amount: Decimal
    currency: string
    method: $Enums.PaymentMethod
    externalReference: string | null
    receiptNumber: string | null
    proofUrl: string
    payerName: string | null
    paymentDate: Date
    submittedAt: Date
    status: $Enums.PaymentStatus
    verificationStatus: $Enums.VerificationStatus
    duplicateFlag: boolean
    ocrText: string | null
    ocrAmount: Decimal | null
    ocrReference: string | null
    notes: string | null
    verificationNotes: string | null
    reviewNotes: string | null
    reconciliationStatus: $Enums.ReconciliationStatus
    reconciliationNote: string | null
    reconciledAt: Date | null
    reconciledBy: string | null
    verifiedBy: string | null
    verifiedAt: Date | null
    reviewedAt: Date | null
    reviewerId: string | null
    academicYear: string | null
    term: string | null
    semester: string | null
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    amount?: boolean
    currency?: boolean
    method?: boolean
    externalReference?: boolean
    receiptNumber?: boolean
    proofUrl?: boolean
    payerName?: boolean
    paymentDate?: boolean
    submittedAt?: boolean
    status?: boolean
    verificationStatus?: boolean
    duplicateFlag?: boolean
    ocrText?: boolean
    ocrAmount?: boolean
    ocrReference?: boolean
    notes?: boolean
    verificationNotes?: boolean
    reviewNotes?: boolean
    reconciliationStatus?: boolean
    reconciliationNote?: boolean
    reconciledAt?: boolean
    reconciledBy?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    reviewedAt?: boolean
    reviewerId?: boolean
    academicYear?: boolean
    term?: boolean
    semester?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
    reconciler?: boolean | Payment$reconcilerArgs<ExtArgs>
    verifier?: boolean | Payment$verifierArgs<ExtArgs>
    reviewer?: boolean | Payment$reviewerArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    amount?: boolean
    currency?: boolean
    method?: boolean
    externalReference?: boolean
    receiptNumber?: boolean
    proofUrl?: boolean
    payerName?: boolean
    paymentDate?: boolean
    submittedAt?: boolean
    status?: boolean
    verificationStatus?: boolean
    duplicateFlag?: boolean
    ocrText?: boolean
    ocrAmount?: boolean
    ocrReference?: boolean
    notes?: boolean
    verificationNotes?: boolean
    reviewNotes?: boolean
    reconciliationStatus?: boolean
    reconciliationNote?: boolean
    reconciledAt?: boolean
    reconciledBy?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    reviewedAt?: boolean
    reviewerId?: boolean
    academicYear?: boolean
    term?: boolean
    semester?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
    reconciler?: boolean | Payment$reconcilerArgs<ExtArgs>
    verifier?: boolean | Payment$verifierArgs<ExtArgs>
    reviewer?: boolean | Payment$reviewerArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    amount?: boolean
    currency?: boolean
    method?: boolean
    externalReference?: boolean
    receiptNumber?: boolean
    proofUrl?: boolean
    payerName?: boolean
    paymentDate?: boolean
    submittedAt?: boolean
    status?: boolean
    verificationStatus?: boolean
    duplicateFlag?: boolean
    ocrText?: boolean
    ocrAmount?: boolean
    ocrReference?: boolean
    notes?: boolean
    verificationNotes?: boolean
    reviewNotes?: boolean
    reconciliationStatus?: boolean
    reconciliationNote?: boolean
    reconciledAt?: boolean
    reconciledBy?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    reviewedAt?: boolean
    reviewerId?: boolean
    academicYear?: boolean
    term?: boolean
    semester?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
    reconciler?: boolean | Payment$reconcilerArgs<ExtArgs>
    verifier?: boolean | Payment$verifierArgs<ExtArgs>
    reviewer?: boolean | Payment$reviewerArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    studentId?: boolean
    amount?: boolean
    currency?: boolean
    method?: boolean
    externalReference?: boolean
    receiptNumber?: boolean
    proofUrl?: boolean
    payerName?: boolean
    paymentDate?: boolean
    submittedAt?: boolean
    status?: boolean
    verificationStatus?: boolean
    duplicateFlag?: boolean
    ocrText?: boolean
    ocrAmount?: boolean
    ocrReference?: boolean
    notes?: boolean
    verificationNotes?: boolean
    reviewNotes?: boolean
    reconciliationStatus?: boolean
    reconciliationNote?: boolean
    reconciledAt?: boolean
    reconciledBy?: boolean
    verifiedBy?: boolean
    verifiedAt?: boolean
    reviewedAt?: boolean
    reviewerId?: boolean
    academicYear?: boolean
    term?: boolean
    semester?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "amount" | "currency" | "method" | "externalReference" | "receiptNumber" | "proofUrl" | "payerName" | "paymentDate" | "submittedAt" | "status" | "verificationStatus" | "duplicateFlag" | "ocrText" | "ocrAmount" | "ocrReference" | "notes" | "verificationNotes" | "reviewNotes" | "reconciliationStatus" | "reconciliationNote" | "reconciledAt" | "reconciledBy" | "verifiedBy" | "verifiedAt" | "reviewedAt" | "reviewerId" | "academicYear" | "term" | "semester", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
    reconciler?: boolean | Payment$reconcilerArgs<ExtArgs>
    verifier?: boolean | Payment$verifierArgs<ExtArgs>
    reviewer?: boolean | Payment$reviewerArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
    reconciler?: boolean | Payment$reconcilerArgs<ExtArgs>
    verifier?: boolean | Payment$verifierArgs<ExtArgs>
    reviewer?: boolean | Payment$reviewerArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
    reconciler?: boolean | Payment$reconcilerArgs<ExtArgs>
    verifier?: boolean | Payment$verifierArgs<ExtArgs>
    reviewer?: boolean | Payment$reviewerArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
      reconciler: Prisma.$UserPayload<ExtArgs> | null
      verifier: Prisma.$UserPayload<ExtArgs> | null
      reviewer: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      studentId: string
      amount: Prisma.Decimal
      currency: string
      method: $Enums.PaymentMethod
      externalReference: string | null
      receiptNumber: string | null
      proofUrl: string
      payerName: string | null
      paymentDate: Date
      submittedAt: Date
      status: $Enums.PaymentStatus
      verificationStatus: $Enums.VerificationStatus
      duplicateFlag: boolean
      ocrText: string | null
      ocrAmount: Prisma.Decimal | null
      ocrReference: string | null
      notes: string | null
      verificationNotes: string | null
      reviewNotes: string | null
      reconciliationStatus: $Enums.ReconciliationStatus
      reconciliationNote: string | null
      reconciledAt: Date | null
      reconciledBy: string | null
      verifiedBy: string | null
      verifiedAt: Date | null
      reviewedAt: Date | null
      reviewerId: string | null
      academicYear: string | null
      term: string | null
      semester: string | null
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reconciler<T extends Payment$reconcilerArgs<ExtArgs> = {}>(args?: Subset<T, Payment$reconcilerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    verifier<T extends Payment$verifierArgs<ExtArgs> = {}>(args?: Subset<T, Payment$verifierArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    reviewer<T extends Payment$reviewerArgs<ExtArgs> = {}>(args?: Subset<T, Payment$reviewerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly studentId: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Decimal'>
    readonly currency: FieldRef<"Payment", 'String'>
    readonly method: FieldRef<"Payment", 'PaymentMethod'>
    readonly externalReference: FieldRef<"Payment", 'String'>
    readonly receiptNumber: FieldRef<"Payment", 'String'>
    readonly proofUrl: FieldRef<"Payment", 'String'>
    readonly payerName: FieldRef<"Payment", 'String'>
    readonly paymentDate: FieldRef<"Payment", 'DateTime'>
    readonly submittedAt: FieldRef<"Payment", 'DateTime'>
    readonly status: FieldRef<"Payment", 'PaymentStatus'>
    readonly verificationStatus: FieldRef<"Payment", 'VerificationStatus'>
    readonly duplicateFlag: FieldRef<"Payment", 'Boolean'>
    readonly ocrText: FieldRef<"Payment", 'String'>
    readonly ocrAmount: FieldRef<"Payment", 'Decimal'>
    readonly ocrReference: FieldRef<"Payment", 'String'>
    readonly notes: FieldRef<"Payment", 'String'>
    readonly verificationNotes: FieldRef<"Payment", 'String'>
    readonly reviewNotes: FieldRef<"Payment", 'String'>
    readonly reconciliationStatus: FieldRef<"Payment", 'ReconciliationStatus'>
    readonly reconciliationNote: FieldRef<"Payment", 'String'>
    readonly reconciledAt: FieldRef<"Payment", 'DateTime'>
    readonly reconciledBy: FieldRef<"Payment", 'String'>
    readonly verifiedBy: FieldRef<"Payment", 'String'>
    readonly verifiedAt: FieldRef<"Payment", 'DateTime'>
    readonly reviewedAt: FieldRef<"Payment", 'DateTime'>
    readonly reviewerId: FieldRef<"Payment", 'String'>
    readonly academicYear: FieldRef<"Payment", 'String'>
    readonly term: FieldRef<"Payment", 'String'>
    readonly semester: FieldRef<"Payment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment.reconciler
   */
  export type Payment$reconcilerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Payment.verifier
   */
  export type Payment$verifierArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Payment.reviewer
   */
  export type Payment$reviewerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model GeneratedReport
   */

  export type AggregateGeneratedReport = {
    _count: GeneratedReportCountAggregateOutputType | null
    _min: GeneratedReportMinAggregateOutputType | null
    _max: GeneratedReportMaxAggregateOutputType | null
  }

  export type GeneratedReportMinAggregateOutputType = {
    id: string | null
    title: string | null
    reportType: string | null
    generatedBy: string | null
    createdAt: Date | null
  }

  export type GeneratedReportMaxAggregateOutputType = {
    id: string | null
    title: string | null
    reportType: string | null
    generatedBy: string | null
    createdAt: Date | null
  }

  export type GeneratedReportCountAggregateOutputType = {
    id: number
    title: number
    reportType: number
    filters: number
    data: number
    generatedBy: number
    createdAt: number
    _all: number
  }


  export type GeneratedReportMinAggregateInputType = {
    id?: true
    title?: true
    reportType?: true
    generatedBy?: true
    createdAt?: true
  }

  export type GeneratedReportMaxAggregateInputType = {
    id?: true
    title?: true
    reportType?: true
    generatedBy?: true
    createdAt?: true
  }

  export type GeneratedReportCountAggregateInputType = {
    id?: true
    title?: true
    reportType?: true
    filters?: true
    data?: true
    generatedBy?: true
    createdAt?: true
    _all?: true
  }

  export type GeneratedReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GeneratedReport to aggregate.
     */
    where?: GeneratedReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneratedReports to fetch.
     */
    orderBy?: GeneratedReportOrderByWithRelationInput | GeneratedReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GeneratedReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneratedReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneratedReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GeneratedReports
    **/
    _count?: true | GeneratedReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GeneratedReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GeneratedReportMaxAggregateInputType
  }

  export type GetGeneratedReportAggregateType<T extends GeneratedReportAggregateArgs> = {
        [P in keyof T & keyof AggregateGeneratedReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGeneratedReport[P]>
      : GetScalarType<T[P], AggregateGeneratedReport[P]>
  }




  export type GeneratedReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GeneratedReportWhereInput
    orderBy?: GeneratedReportOrderByWithAggregationInput | GeneratedReportOrderByWithAggregationInput[]
    by: GeneratedReportScalarFieldEnum[] | GeneratedReportScalarFieldEnum
    having?: GeneratedReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GeneratedReportCountAggregateInputType | true
    _min?: GeneratedReportMinAggregateInputType
    _max?: GeneratedReportMaxAggregateInputType
  }

  export type GeneratedReportGroupByOutputType = {
    id: string
    title: string
    reportType: string
    filters: JsonValue
    data: JsonValue | null
    generatedBy: string
    createdAt: Date
    _count: GeneratedReportCountAggregateOutputType | null
    _min: GeneratedReportMinAggregateOutputType | null
    _max: GeneratedReportMaxAggregateOutputType | null
  }

  type GetGeneratedReportGroupByPayload<T extends GeneratedReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GeneratedReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GeneratedReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GeneratedReportGroupByOutputType[P]>
            : GetScalarType<T[P], GeneratedReportGroupByOutputType[P]>
        }
      >
    >


  export type GeneratedReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    reportType?: boolean
    filters?: boolean
    data?: boolean
    generatedBy?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generatedReport"]>

  export type GeneratedReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    reportType?: boolean
    filters?: boolean
    data?: boolean
    generatedBy?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generatedReport"]>

  export type GeneratedReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    reportType?: boolean
    filters?: boolean
    data?: boolean
    generatedBy?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["generatedReport"]>

  export type GeneratedReportSelectScalar = {
    id?: boolean
    title?: boolean
    reportType?: boolean
    filters?: boolean
    data?: boolean
    generatedBy?: boolean
    createdAt?: boolean
  }

  export type GeneratedReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "reportType" | "filters" | "data" | "generatedBy" | "createdAt", ExtArgs["result"]["generatedReport"]>
  export type GeneratedReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type GeneratedReportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type GeneratedReportIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $GeneratedReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GeneratedReport"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      reportType: string
      filters: Prisma.JsonValue
      data: Prisma.JsonValue | null
      generatedBy: string
      createdAt: Date
    }, ExtArgs["result"]["generatedReport"]>
    composites: {}
  }

  type GeneratedReportGetPayload<S extends boolean | null | undefined | GeneratedReportDefaultArgs> = $Result.GetResult<Prisma.$GeneratedReportPayload, S>

  type GeneratedReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GeneratedReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GeneratedReportCountAggregateInputType | true
    }

  export interface GeneratedReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GeneratedReport'], meta: { name: 'GeneratedReport' } }
    /**
     * Find zero or one GeneratedReport that matches the filter.
     * @param {GeneratedReportFindUniqueArgs} args - Arguments to find a GeneratedReport
     * @example
     * // Get one GeneratedReport
     * const generatedReport = await prisma.generatedReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GeneratedReportFindUniqueArgs>(args: SelectSubset<T, GeneratedReportFindUniqueArgs<ExtArgs>>): Prisma__GeneratedReportClient<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GeneratedReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GeneratedReportFindUniqueOrThrowArgs} args - Arguments to find a GeneratedReport
     * @example
     * // Get one GeneratedReport
     * const generatedReport = await prisma.generatedReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GeneratedReportFindUniqueOrThrowArgs>(args: SelectSubset<T, GeneratedReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GeneratedReportClient<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GeneratedReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedReportFindFirstArgs} args - Arguments to find a GeneratedReport
     * @example
     * // Get one GeneratedReport
     * const generatedReport = await prisma.generatedReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GeneratedReportFindFirstArgs>(args?: SelectSubset<T, GeneratedReportFindFirstArgs<ExtArgs>>): Prisma__GeneratedReportClient<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GeneratedReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedReportFindFirstOrThrowArgs} args - Arguments to find a GeneratedReport
     * @example
     * // Get one GeneratedReport
     * const generatedReport = await prisma.generatedReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GeneratedReportFindFirstOrThrowArgs>(args?: SelectSubset<T, GeneratedReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__GeneratedReportClient<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GeneratedReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GeneratedReports
     * const generatedReports = await prisma.generatedReport.findMany()
     * 
     * // Get first 10 GeneratedReports
     * const generatedReports = await prisma.generatedReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const generatedReportWithIdOnly = await prisma.generatedReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GeneratedReportFindManyArgs>(args?: SelectSubset<T, GeneratedReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GeneratedReport.
     * @param {GeneratedReportCreateArgs} args - Arguments to create a GeneratedReport.
     * @example
     * // Create one GeneratedReport
     * const GeneratedReport = await prisma.generatedReport.create({
     *   data: {
     *     // ... data to create a GeneratedReport
     *   }
     * })
     * 
     */
    create<T extends GeneratedReportCreateArgs>(args: SelectSubset<T, GeneratedReportCreateArgs<ExtArgs>>): Prisma__GeneratedReportClient<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GeneratedReports.
     * @param {GeneratedReportCreateManyArgs} args - Arguments to create many GeneratedReports.
     * @example
     * // Create many GeneratedReports
     * const generatedReport = await prisma.generatedReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GeneratedReportCreateManyArgs>(args?: SelectSubset<T, GeneratedReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GeneratedReports and returns the data saved in the database.
     * @param {GeneratedReportCreateManyAndReturnArgs} args - Arguments to create many GeneratedReports.
     * @example
     * // Create many GeneratedReports
     * const generatedReport = await prisma.generatedReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GeneratedReports and only return the `id`
     * const generatedReportWithIdOnly = await prisma.generatedReport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GeneratedReportCreateManyAndReturnArgs>(args?: SelectSubset<T, GeneratedReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GeneratedReport.
     * @param {GeneratedReportDeleteArgs} args - Arguments to delete one GeneratedReport.
     * @example
     * // Delete one GeneratedReport
     * const GeneratedReport = await prisma.generatedReport.delete({
     *   where: {
     *     // ... filter to delete one GeneratedReport
     *   }
     * })
     * 
     */
    delete<T extends GeneratedReportDeleteArgs>(args: SelectSubset<T, GeneratedReportDeleteArgs<ExtArgs>>): Prisma__GeneratedReportClient<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GeneratedReport.
     * @param {GeneratedReportUpdateArgs} args - Arguments to update one GeneratedReport.
     * @example
     * // Update one GeneratedReport
     * const generatedReport = await prisma.generatedReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GeneratedReportUpdateArgs>(args: SelectSubset<T, GeneratedReportUpdateArgs<ExtArgs>>): Prisma__GeneratedReportClient<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GeneratedReports.
     * @param {GeneratedReportDeleteManyArgs} args - Arguments to filter GeneratedReports to delete.
     * @example
     * // Delete a few GeneratedReports
     * const { count } = await prisma.generatedReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GeneratedReportDeleteManyArgs>(args?: SelectSubset<T, GeneratedReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GeneratedReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GeneratedReports
     * const generatedReport = await prisma.generatedReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GeneratedReportUpdateManyArgs>(args: SelectSubset<T, GeneratedReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GeneratedReports and returns the data updated in the database.
     * @param {GeneratedReportUpdateManyAndReturnArgs} args - Arguments to update many GeneratedReports.
     * @example
     * // Update many GeneratedReports
     * const generatedReport = await prisma.generatedReport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GeneratedReports and only return the `id`
     * const generatedReportWithIdOnly = await prisma.generatedReport.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GeneratedReportUpdateManyAndReturnArgs>(args: SelectSubset<T, GeneratedReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GeneratedReport.
     * @param {GeneratedReportUpsertArgs} args - Arguments to update or create a GeneratedReport.
     * @example
     * // Update or create a GeneratedReport
     * const generatedReport = await prisma.generatedReport.upsert({
     *   create: {
     *     // ... data to create a GeneratedReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GeneratedReport we want to update
     *   }
     * })
     */
    upsert<T extends GeneratedReportUpsertArgs>(args: SelectSubset<T, GeneratedReportUpsertArgs<ExtArgs>>): Prisma__GeneratedReportClient<$Result.GetResult<Prisma.$GeneratedReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GeneratedReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedReportCountArgs} args - Arguments to filter GeneratedReports to count.
     * @example
     * // Count the number of GeneratedReports
     * const count = await prisma.generatedReport.count({
     *   where: {
     *     // ... the filter for the GeneratedReports we want to count
     *   }
     * })
    **/
    count<T extends GeneratedReportCountArgs>(
      args?: Subset<T, GeneratedReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GeneratedReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GeneratedReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GeneratedReportAggregateArgs>(args: Subset<T, GeneratedReportAggregateArgs>): Prisma.PrismaPromise<GetGeneratedReportAggregateType<T>>

    /**
     * Group by GeneratedReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GeneratedReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GeneratedReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GeneratedReportGroupByArgs['orderBy'] }
        : { orderBy?: GeneratedReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GeneratedReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGeneratedReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GeneratedReport model
   */
  readonly fields: GeneratedReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GeneratedReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GeneratedReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GeneratedReport model
   */
  interface GeneratedReportFieldRefs {
    readonly id: FieldRef<"GeneratedReport", 'String'>
    readonly title: FieldRef<"GeneratedReport", 'String'>
    readonly reportType: FieldRef<"GeneratedReport", 'String'>
    readonly filters: FieldRef<"GeneratedReport", 'Json'>
    readonly data: FieldRef<"GeneratedReport", 'Json'>
    readonly generatedBy: FieldRef<"GeneratedReport", 'String'>
    readonly createdAt: FieldRef<"GeneratedReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GeneratedReport findUnique
   */
  export type GeneratedReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
    /**
     * Filter, which GeneratedReport to fetch.
     */
    where: GeneratedReportWhereUniqueInput
  }

  /**
   * GeneratedReport findUniqueOrThrow
   */
  export type GeneratedReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
    /**
     * Filter, which GeneratedReport to fetch.
     */
    where: GeneratedReportWhereUniqueInput
  }

  /**
   * GeneratedReport findFirst
   */
  export type GeneratedReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
    /**
     * Filter, which GeneratedReport to fetch.
     */
    where?: GeneratedReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneratedReports to fetch.
     */
    orderBy?: GeneratedReportOrderByWithRelationInput | GeneratedReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GeneratedReports.
     */
    cursor?: GeneratedReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneratedReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneratedReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GeneratedReports.
     */
    distinct?: GeneratedReportScalarFieldEnum | GeneratedReportScalarFieldEnum[]
  }

  /**
   * GeneratedReport findFirstOrThrow
   */
  export type GeneratedReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
    /**
     * Filter, which GeneratedReport to fetch.
     */
    where?: GeneratedReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneratedReports to fetch.
     */
    orderBy?: GeneratedReportOrderByWithRelationInput | GeneratedReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GeneratedReports.
     */
    cursor?: GeneratedReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneratedReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneratedReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GeneratedReports.
     */
    distinct?: GeneratedReportScalarFieldEnum | GeneratedReportScalarFieldEnum[]
  }

  /**
   * GeneratedReport findMany
   */
  export type GeneratedReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
    /**
     * Filter, which GeneratedReports to fetch.
     */
    where?: GeneratedReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GeneratedReports to fetch.
     */
    orderBy?: GeneratedReportOrderByWithRelationInput | GeneratedReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GeneratedReports.
     */
    cursor?: GeneratedReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GeneratedReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GeneratedReports.
     */
    skip?: number
    distinct?: GeneratedReportScalarFieldEnum | GeneratedReportScalarFieldEnum[]
  }

  /**
   * GeneratedReport create
   */
  export type GeneratedReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
    /**
     * The data needed to create a GeneratedReport.
     */
    data: XOR<GeneratedReportCreateInput, GeneratedReportUncheckedCreateInput>
  }

  /**
   * GeneratedReport createMany
   */
  export type GeneratedReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GeneratedReports.
     */
    data: GeneratedReportCreateManyInput | GeneratedReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GeneratedReport createManyAndReturn
   */
  export type GeneratedReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * The data used to create many GeneratedReports.
     */
    data: GeneratedReportCreateManyInput | GeneratedReportCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GeneratedReport update
   */
  export type GeneratedReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
    /**
     * The data needed to update a GeneratedReport.
     */
    data: XOR<GeneratedReportUpdateInput, GeneratedReportUncheckedUpdateInput>
    /**
     * Choose, which GeneratedReport to update.
     */
    where: GeneratedReportWhereUniqueInput
  }

  /**
   * GeneratedReport updateMany
   */
  export type GeneratedReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GeneratedReports.
     */
    data: XOR<GeneratedReportUpdateManyMutationInput, GeneratedReportUncheckedUpdateManyInput>
    /**
     * Filter which GeneratedReports to update
     */
    where?: GeneratedReportWhereInput
    /**
     * Limit how many GeneratedReports to update.
     */
    limit?: number
  }

  /**
   * GeneratedReport updateManyAndReturn
   */
  export type GeneratedReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * The data used to update GeneratedReports.
     */
    data: XOR<GeneratedReportUpdateManyMutationInput, GeneratedReportUncheckedUpdateManyInput>
    /**
     * Filter which GeneratedReports to update
     */
    where?: GeneratedReportWhereInput
    /**
     * Limit how many GeneratedReports to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GeneratedReport upsert
   */
  export type GeneratedReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
    /**
     * The filter to search for the GeneratedReport to update in case it exists.
     */
    where: GeneratedReportWhereUniqueInput
    /**
     * In case the GeneratedReport found by the `where` argument doesn't exist, create a new GeneratedReport with this data.
     */
    create: XOR<GeneratedReportCreateInput, GeneratedReportUncheckedCreateInput>
    /**
     * In case the GeneratedReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GeneratedReportUpdateInput, GeneratedReportUncheckedUpdateInput>
  }

  /**
   * GeneratedReport delete
   */
  export type GeneratedReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
    /**
     * Filter which GeneratedReport to delete.
     */
    where: GeneratedReportWhereUniqueInput
  }

  /**
   * GeneratedReport deleteMany
   */
  export type GeneratedReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GeneratedReports to delete
     */
    where?: GeneratedReportWhereInput
    /**
     * Limit how many GeneratedReports to delete.
     */
    limit?: number
  }

  /**
   * GeneratedReport without action
   */
  export type GeneratedReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GeneratedReport
     */
    select?: GeneratedReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GeneratedReport
     */
    omit?: GeneratedReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GeneratedReportInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    message: string | null
    type: string | null
    read: boolean | null
    createdAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    message: string | null
    type: string | null
    read: boolean | null
    createdAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    message: number
    type: number
    read: number
    createdAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    read?: true
    createdAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    read?: true
    createdAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    read?: true
    createdAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string
    title: string
    message: string
    type: string
    read: boolean
    createdAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    read?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    read?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    read?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    read?: boolean
    createdAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "message" | "type" | "read" | "createdAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      message: string
      type: string
      read: boolean
      createdAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly read: FieldRef<"Notification", 'Boolean'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model SystemRegistry
   */

  export type AggregateSystemRegistry = {
    _count: SystemRegistryCountAggregateOutputType | null
    _min: SystemRegistryMinAggregateOutputType | null
    _max: SystemRegistryMaxAggregateOutputType | null
  }

  export type SystemRegistryMinAggregateOutputType = {
    id: string | null
    institutionName: string | null
    institutionType: string | null
    address: string | null
    logoUrl: string | null
    contactEmail: string | null
    updatedAt: Date | null
  }

  export type SystemRegistryMaxAggregateOutputType = {
    id: string | null
    institutionName: string | null
    institutionType: string | null
    address: string | null
    logoUrl: string | null
    contactEmail: string | null
    updatedAt: Date | null
  }

  export type SystemRegistryCountAggregateOutputType = {
    id: number
    institutionName: number
    institutionType: number
    address: number
    logoUrl: number
    contactEmail: number
    updatedAt: number
    _all: number
  }


  export type SystemRegistryMinAggregateInputType = {
    id?: true
    institutionName?: true
    institutionType?: true
    address?: true
    logoUrl?: true
    contactEmail?: true
    updatedAt?: true
  }

  export type SystemRegistryMaxAggregateInputType = {
    id?: true
    institutionName?: true
    institutionType?: true
    address?: true
    logoUrl?: true
    contactEmail?: true
    updatedAt?: true
  }

  export type SystemRegistryCountAggregateInputType = {
    id?: true
    institutionName?: true
    institutionType?: true
    address?: true
    logoUrl?: true
    contactEmail?: true
    updatedAt?: true
    _all?: true
  }

  export type SystemRegistryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemRegistry to aggregate.
     */
    where?: SystemRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemRegistries to fetch.
     */
    orderBy?: SystemRegistryOrderByWithRelationInput | SystemRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemRegistries
    **/
    _count?: true | SystemRegistryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemRegistryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemRegistryMaxAggregateInputType
  }

  export type GetSystemRegistryAggregateType<T extends SystemRegistryAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemRegistry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemRegistry[P]>
      : GetScalarType<T[P], AggregateSystemRegistry[P]>
  }




  export type SystemRegistryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemRegistryWhereInput
    orderBy?: SystemRegistryOrderByWithAggregationInput | SystemRegistryOrderByWithAggregationInput[]
    by: SystemRegistryScalarFieldEnum[] | SystemRegistryScalarFieldEnum
    having?: SystemRegistryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemRegistryCountAggregateInputType | true
    _min?: SystemRegistryMinAggregateInputType
    _max?: SystemRegistryMaxAggregateInputType
  }

  export type SystemRegistryGroupByOutputType = {
    id: string
    institutionName: string
    institutionType: string
    address: string | null
    logoUrl: string | null
    contactEmail: string | null
    updatedAt: Date
    _count: SystemRegistryCountAggregateOutputType | null
    _min: SystemRegistryMinAggregateOutputType | null
    _max: SystemRegistryMaxAggregateOutputType | null
  }

  type GetSystemRegistryGroupByPayload<T extends SystemRegistryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemRegistryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemRegistryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemRegistryGroupByOutputType[P]>
            : GetScalarType<T[P], SystemRegistryGroupByOutputType[P]>
        }
      >
    >


  export type SystemRegistrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionName?: boolean
    institutionType?: boolean
    address?: boolean
    logoUrl?: boolean
    contactEmail?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemRegistry"]>

  export type SystemRegistrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionName?: boolean
    institutionType?: boolean
    address?: boolean
    logoUrl?: boolean
    contactEmail?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemRegistry"]>

  export type SystemRegistrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    institutionName?: boolean
    institutionType?: boolean
    address?: boolean
    logoUrl?: boolean
    contactEmail?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemRegistry"]>

  export type SystemRegistrySelectScalar = {
    id?: boolean
    institutionName?: boolean
    institutionType?: boolean
    address?: boolean
    logoUrl?: boolean
    contactEmail?: boolean
    updatedAt?: boolean
  }

  export type SystemRegistryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "institutionName" | "institutionType" | "address" | "logoUrl" | "contactEmail" | "updatedAt", ExtArgs["result"]["systemRegistry"]>

  export type $SystemRegistryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemRegistry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      institutionName: string
      institutionType: string
      address: string | null
      logoUrl: string | null
      contactEmail: string | null
      updatedAt: Date
    }, ExtArgs["result"]["systemRegistry"]>
    composites: {}
  }

  type SystemRegistryGetPayload<S extends boolean | null | undefined | SystemRegistryDefaultArgs> = $Result.GetResult<Prisma.$SystemRegistryPayload, S>

  type SystemRegistryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemRegistryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemRegistryCountAggregateInputType | true
    }

  export interface SystemRegistryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemRegistry'], meta: { name: 'SystemRegistry' } }
    /**
     * Find zero or one SystemRegistry that matches the filter.
     * @param {SystemRegistryFindUniqueArgs} args - Arguments to find a SystemRegistry
     * @example
     * // Get one SystemRegistry
     * const systemRegistry = await prisma.systemRegistry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemRegistryFindUniqueArgs>(args: SelectSubset<T, SystemRegistryFindUniqueArgs<ExtArgs>>): Prisma__SystemRegistryClient<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemRegistry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemRegistryFindUniqueOrThrowArgs} args - Arguments to find a SystemRegistry
     * @example
     * // Get one SystemRegistry
     * const systemRegistry = await prisma.systemRegistry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemRegistryFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemRegistryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemRegistryClient<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemRegistry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemRegistryFindFirstArgs} args - Arguments to find a SystemRegistry
     * @example
     * // Get one SystemRegistry
     * const systemRegistry = await prisma.systemRegistry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemRegistryFindFirstArgs>(args?: SelectSubset<T, SystemRegistryFindFirstArgs<ExtArgs>>): Prisma__SystemRegistryClient<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemRegistry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemRegistryFindFirstOrThrowArgs} args - Arguments to find a SystemRegistry
     * @example
     * // Get one SystemRegistry
     * const systemRegistry = await prisma.systemRegistry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemRegistryFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemRegistryFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemRegistryClient<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemRegistries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemRegistryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemRegistries
     * const systemRegistries = await prisma.systemRegistry.findMany()
     * 
     * // Get first 10 SystemRegistries
     * const systemRegistries = await prisma.systemRegistry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemRegistryWithIdOnly = await prisma.systemRegistry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemRegistryFindManyArgs>(args?: SelectSubset<T, SystemRegistryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemRegistry.
     * @param {SystemRegistryCreateArgs} args - Arguments to create a SystemRegistry.
     * @example
     * // Create one SystemRegistry
     * const SystemRegistry = await prisma.systemRegistry.create({
     *   data: {
     *     // ... data to create a SystemRegistry
     *   }
     * })
     * 
     */
    create<T extends SystemRegistryCreateArgs>(args: SelectSubset<T, SystemRegistryCreateArgs<ExtArgs>>): Prisma__SystemRegistryClient<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemRegistries.
     * @param {SystemRegistryCreateManyArgs} args - Arguments to create many SystemRegistries.
     * @example
     * // Create many SystemRegistries
     * const systemRegistry = await prisma.systemRegistry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemRegistryCreateManyArgs>(args?: SelectSubset<T, SystemRegistryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemRegistries and returns the data saved in the database.
     * @param {SystemRegistryCreateManyAndReturnArgs} args - Arguments to create many SystemRegistries.
     * @example
     * // Create many SystemRegistries
     * const systemRegistry = await prisma.systemRegistry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemRegistries and only return the `id`
     * const systemRegistryWithIdOnly = await prisma.systemRegistry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemRegistryCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemRegistryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemRegistry.
     * @param {SystemRegistryDeleteArgs} args - Arguments to delete one SystemRegistry.
     * @example
     * // Delete one SystemRegistry
     * const SystemRegistry = await prisma.systemRegistry.delete({
     *   where: {
     *     // ... filter to delete one SystemRegistry
     *   }
     * })
     * 
     */
    delete<T extends SystemRegistryDeleteArgs>(args: SelectSubset<T, SystemRegistryDeleteArgs<ExtArgs>>): Prisma__SystemRegistryClient<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemRegistry.
     * @param {SystemRegistryUpdateArgs} args - Arguments to update one SystemRegistry.
     * @example
     * // Update one SystemRegistry
     * const systemRegistry = await prisma.systemRegistry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemRegistryUpdateArgs>(args: SelectSubset<T, SystemRegistryUpdateArgs<ExtArgs>>): Prisma__SystemRegistryClient<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemRegistries.
     * @param {SystemRegistryDeleteManyArgs} args - Arguments to filter SystemRegistries to delete.
     * @example
     * // Delete a few SystemRegistries
     * const { count } = await prisma.systemRegistry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemRegistryDeleteManyArgs>(args?: SelectSubset<T, SystemRegistryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemRegistries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemRegistryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemRegistries
     * const systemRegistry = await prisma.systemRegistry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemRegistryUpdateManyArgs>(args: SelectSubset<T, SystemRegistryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemRegistries and returns the data updated in the database.
     * @param {SystemRegistryUpdateManyAndReturnArgs} args - Arguments to update many SystemRegistries.
     * @example
     * // Update many SystemRegistries
     * const systemRegistry = await prisma.systemRegistry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemRegistries and only return the `id`
     * const systemRegistryWithIdOnly = await prisma.systemRegistry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SystemRegistryUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemRegistryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemRegistry.
     * @param {SystemRegistryUpsertArgs} args - Arguments to update or create a SystemRegistry.
     * @example
     * // Update or create a SystemRegistry
     * const systemRegistry = await prisma.systemRegistry.upsert({
     *   create: {
     *     // ... data to create a SystemRegistry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemRegistry we want to update
     *   }
     * })
     */
    upsert<T extends SystemRegistryUpsertArgs>(args: SelectSubset<T, SystemRegistryUpsertArgs<ExtArgs>>): Prisma__SystemRegistryClient<$Result.GetResult<Prisma.$SystemRegistryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemRegistries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemRegistryCountArgs} args - Arguments to filter SystemRegistries to count.
     * @example
     * // Count the number of SystemRegistries
     * const count = await prisma.systemRegistry.count({
     *   where: {
     *     // ... the filter for the SystemRegistries we want to count
     *   }
     * })
    **/
    count<T extends SystemRegistryCountArgs>(
      args?: Subset<T, SystemRegistryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemRegistryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemRegistry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemRegistryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemRegistryAggregateArgs>(args: Subset<T, SystemRegistryAggregateArgs>): Prisma.PrismaPromise<GetSystemRegistryAggregateType<T>>

    /**
     * Group by SystemRegistry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemRegistryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemRegistryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemRegistryGroupByArgs['orderBy'] }
        : { orderBy?: SystemRegistryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemRegistryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemRegistryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemRegistry model
   */
  readonly fields: SystemRegistryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemRegistry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemRegistryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemRegistry model
   */
  interface SystemRegistryFieldRefs {
    readonly id: FieldRef<"SystemRegistry", 'String'>
    readonly institutionName: FieldRef<"SystemRegistry", 'String'>
    readonly institutionType: FieldRef<"SystemRegistry", 'String'>
    readonly address: FieldRef<"SystemRegistry", 'String'>
    readonly logoUrl: FieldRef<"SystemRegistry", 'String'>
    readonly contactEmail: FieldRef<"SystemRegistry", 'String'>
    readonly updatedAt: FieldRef<"SystemRegistry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemRegistry findUnique
   */
  export type SystemRegistryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * Filter, which SystemRegistry to fetch.
     */
    where: SystemRegistryWhereUniqueInput
  }

  /**
   * SystemRegistry findUniqueOrThrow
   */
  export type SystemRegistryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * Filter, which SystemRegistry to fetch.
     */
    where: SystemRegistryWhereUniqueInput
  }

  /**
   * SystemRegistry findFirst
   */
  export type SystemRegistryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * Filter, which SystemRegistry to fetch.
     */
    where?: SystemRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemRegistries to fetch.
     */
    orderBy?: SystemRegistryOrderByWithRelationInput | SystemRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemRegistries.
     */
    cursor?: SystemRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemRegistries.
     */
    distinct?: SystemRegistryScalarFieldEnum | SystemRegistryScalarFieldEnum[]
  }

  /**
   * SystemRegistry findFirstOrThrow
   */
  export type SystemRegistryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * Filter, which SystemRegistry to fetch.
     */
    where?: SystemRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemRegistries to fetch.
     */
    orderBy?: SystemRegistryOrderByWithRelationInput | SystemRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemRegistries.
     */
    cursor?: SystemRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemRegistries.
     */
    distinct?: SystemRegistryScalarFieldEnum | SystemRegistryScalarFieldEnum[]
  }

  /**
   * SystemRegistry findMany
   */
  export type SystemRegistryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * Filter, which SystemRegistries to fetch.
     */
    where?: SystemRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemRegistries to fetch.
     */
    orderBy?: SystemRegistryOrderByWithRelationInput | SystemRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemRegistries.
     */
    cursor?: SystemRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemRegistries.
     */
    skip?: number
    distinct?: SystemRegistryScalarFieldEnum | SystemRegistryScalarFieldEnum[]
  }

  /**
   * SystemRegistry create
   */
  export type SystemRegistryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * The data needed to create a SystemRegistry.
     */
    data: XOR<SystemRegistryCreateInput, SystemRegistryUncheckedCreateInput>
  }

  /**
   * SystemRegistry createMany
   */
  export type SystemRegistryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemRegistries.
     */
    data: SystemRegistryCreateManyInput | SystemRegistryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemRegistry createManyAndReturn
   */
  export type SystemRegistryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * The data used to create many SystemRegistries.
     */
    data: SystemRegistryCreateManyInput | SystemRegistryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemRegistry update
   */
  export type SystemRegistryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * The data needed to update a SystemRegistry.
     */
    data: XOR<SystemRegistryUpdateInput, SystemRegistryUncheckedUpdateInput>
    /**
     * Choose, which SystemRegistry to update.
     */
    where: SystemRegistryWhereUniqueInput
  }

  /**
   * SystemRegistry updateMany
   */
  export type SystemRegistryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemRegistries.
     */
    data: XOR<SystemRegistryUpdateManyMutationInput, SystemRegistryUncheckedUpdateManyInput>
    /**
     * Filter which SystemRegistries to update
     */
    where?: SystemRegistryWhereInput
    /**
     * Limit how many SystemRegistries to update.
     */
    limit?: number
  }

  /**
   * SystemRegistry updateManyAndReturn
   */
  export type SystemRegistryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * The data used to update SystemRegistries.
     */
    data: XOR<SystemRegistryUpdateManyMutationInput, SystemRegistryUncheckedUpdateManyInput>
    /**
     * Filter which SystemRegistries to update
     */
    where?: SystemRegistryWhereInput
    /**
     * Limit how many SystemRegistries to update.
     */
    limit?: number
  }

  /**
   * SystemRegistry upsert
   */
  export type SystemRegistryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * The filter to search for the SystemRegistry to update in case it exists.
     */
    where: SystemRegistryWhereUniqueInput
    /**
     * In case the SystemRegistry found by the `where` argument doesn't exist, create a new SystemRegistry with this data.
     */
    create: XOR<SystemRegistryCreateInput, SystemRegistryUncheckedCreateInput>
    /**
     * In case the SystemRegistry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemRegistryUpdateInput, SystemRegistryUncheckedUpdateInput>
  }

  /**
   * SystemRegistry delete
   */
  export type SystemRegistryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
    /**
     * Filter which SystemRegistry to delete.
     */
    where: SystemRegistryWhereUniqueInput
  }

  /**
   * SystemRegistry deleteMany
   */
  export type SystemRegistryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemRegistries to delete
     */
    where?: SystemRegistryWhereInput
    /**
     * Limit how many SystemRegistries to delete.
     */
    limit?: number
  }

  /**
   * SystemRegistry without action
   */
  export type SystemRegistryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemRegistry
     */
    select?: SystemRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemRegistry
     */
    omit?: SystemRegistryOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    firstName: 'firstName',
    lastName: 'lastName',
    role: 'role',
    status: 'status',
    profilePictureUrl: 'profilePictureUrl',
    currentSessionId: 'currentSessionId',
    sessionExpires: 'sessionExpires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const StudentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    studentCode: 'studentCode',
    firstName: 'firstName',
    lastName: 'lastName',
    program: 'program',
    classLevel: 'classLevel',
    academicYear: 'academicYear',
    term: 'term',
    semester: 'semester',
    phone: 'phone',
    currentBalance: 'currentBalance',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StudentScalarFieldEnum = (typeof StudentScalarFieldEnum)[keyof typeof StudentScalarFieldEnum]


  export const FeeStructureScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    amount: 'amount',
    program: 'program',
    classLevel: 'classLevel',
    term: 'term',
    semester: 'semester',
    academicYear: 'academicYear',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FeeStructureScalarFieldEnum = (typeof FeeStructureScalarFieldEnum)[keyof typeof FeeStructureScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    amount: 'amount',
    currency: 'currency',
    method: 'method',
    externalReference: 'externalReference',
    receiptNumber: 'receiptNumber',
    proofUrl: 'proofUrl',
    payerName: 'payerName',
    paymentDate: 'paymentDate',
    submittedAt: 'submittedAt',
    status: 'status',
    verificationStatus: 'verificationStatus',
    duplicateFlag: 'duplicateFlag',
    ocrText: 'ocrText',
    ocrAmount: 'ocrAmount',
    ocrReference: 'ocrReference',
    notes: 'notes',
    verificationNotes: 'verificationNotes',
    reviewNotes: 'reviewNotes',
    reconciliationStatus: 'reconciliationStatus',
    reconciliationNote: 'reconciliationNote',
    reconciledAt: 'reconciledAt',
    reconciledBy: 'reconciledBy',
    verifiedBy: 'verifiedBy',
    verifiedAt: 'verifiedAt',
    reviewedAt: 'reviewedAt',
    reviewerId: 'reviewerId',
    academicYear: 'academicYear',
    term: 'term',
    semester: 'semester'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const GeneratedReportScalarFieldEnum: {
    id: 'id',
    title: 'title',
    reportType: 'reportType',
    filters: 'filters',
    data: 'data',
    generatedBy: 'generatedBy',
    createdAt: 'createdAt'
  };

  export type GeneratedReportScalarFieldEnum = (typeof GeneratedReportScalarFieldEnum)[keyof typeof GeneratedReportScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    message: 'message',
    type: 'type',
    read: 'read',
    createdAt: 'createdAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SystemRegistryScalarFieldEnum: {
    id: 'id',
    institutionName: 'institutionName',
    institutionType: 'institutionType',
    address: 'address',
    logoUrl: 'logoUrl',
    contactEmail: 'contactEmail',
    updatedAt: 'updatedAt'
  };

  export type SystemRegistryScalarFieldEnum = (typeof SystemRegistryScalarFieldEnum)[keyof typeof SystemRegistryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'UserStatus'
   */
  export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus'>
    


  /**
   * Reference to a field of type 'UserStatus[]'
   */
  export type ListEnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'PaymentMethod[]'
   */
  export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    


  /**
   * Reference to a field of type 'VerificationStatus'
   */
  export type EnumVerificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationStatus'>
    


  /**
   * Reference to a field of type 'VerificationStatus[]'
   */
  export type ListEnumVerificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VerificationStatus[]'>
    


  /**
   * Reference to a field of type 'ReconciliationStatus'
   */
  export type EnumReconciliationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReconciliationStatus'>
    


  /**
   * Reference to a field of type 'ReconciliationStatus[]'
   */
  export type ListEnumReconciliationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReconciliationStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    profilePictureUrl?: StringNullableFilter<"User"> | string | null
    currentSessionId?: StringNullableFilter<"User"> | string | null
    sessionExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    student?: XOR<StudentNullableScalarRelationFilter, StudentWhereInput> | null
    verifiedPayments?: PaymentListRelationFilter
    reviewedPayments?: PaymentListRelationFilter
    reconciledPayments?: PaymentListRelationFilter
    generatedReports?: GeneratedReportListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    role?: SortOrder
    status?: SortOrder
    profilePictureUrl?: SortOrderInput | SortOrder
    currentSessionId?: SortOrderInput | SortOrder
    sessionExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    student?: StudentOrderByWithRelationInput
    verifiedPayments?: PaymentOrderByRelationAggregateInput
    reviewedPayments?: PaymentOrderByRelationAggregateInput
    reconciledPayments?: PaymentOrderByRelationAggregateInput
    generatedReports?: GeneratedReportOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    profilePictureUrl?: StringNullableFilter<"User"> | string | null
    currentSessionId?: StringNullableFilter<"User"> | string | null
    sessionExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    student?: XOR<StudentNullableScalarRelationFilter, StudentWhereInput> | null
    verifiedPayments?: PaymentListRelationFilter
    reviewedPayments?: PaymentListRelationFilter
    reconciledPayments?: PaymentListRelationFilter
    generatedReports?: GeneratedReportListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    role?: SortOrder
    status?: SortOrder
    profilePictureUrl?: SortOrderInput | SortOrder
    currentSessionId?: SortOrderInput | SortOrder
    sessionExpires?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    status?: EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus
    profilePictureUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    currentSessionId?: StringNullableWithAggregatesFilter<"User"> | string | null
    sessionExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type StudentWhereInput = {
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    id?: StringFilter<"Student"> | string
    userId?: StringFilter<"Student"> | string
    studentCode?: StringFilter<"Student"> | string
    firstName?: StringFilter<"Student"> | string
    lastName?: StringFilter<"Student"> | string
    program?: StringFilter<"Student"> | string
    classLevel?: StringNullableFilter<"Student"> | string | null
    academicYear?: StringNullableFilter<"Student"> | string | null
    term?: StringNullableFilter<"Student"> | string | null
    semester?: StringNullableFilter<"Student"> | string | null
    phone?: StringNullableFilter<"Student"> | string | null
    currentBalance?: DecimalFilter<"Student"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Student"> | Date | string
    updatedAt?: DateTimeFilter<"Student"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    payments?: PaymentListRelationFilter
  }

  export type StudentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    studentCode?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    program?: SortOrder
    classLevel?: SortOrderInput | SortOrder
    academicYear?: SortOrderInput | SortOrder
    term?: SortOrderInput | SortOrder
    semester?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    currentBalance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    payments?: PaymentOrderByRelationAggregateInput
  }

  export type StudentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    studentCode?: string
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    firstName?: StringFilter<"Student"> | string
    lastName?: StringFilter<"Student"> | string
    program?: StringFilter<"Student"> | string
    classLevel?: StringNullableFilter<"Student"> | string | null
    academicYear?: StringNullableFilter<"Student"> | string | null
    term?: StringNullableFilter<"Student"> | string | null
    semester?: StringNullableFilter<"Student"> | string | null
    phone?: StringNullableFilter<"Student"> | string | null
    currentBalance?: DecimalFilter<"Student"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Student"> | Date | string
    updatedAt?: DateTimeFilter<"Student"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    payments?: PaymentListRelationFilter
  }, "id" | "userId" | "studentCode">

  export type StudentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    studentCode?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    program?: SortOrder
    classLevel?: SortOrderInput | SortOrder
    academicYear?: SortOrderInput | SortOrder
    term?: SortOrderInput | SortOrder
    semester?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    currentBalance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StudentCountOrderByAggregateInput
    _avg?: StudentAvgOrderByAggregateInput
    _max?: StudentMaxOrderByAggregateInput
    _min?: StudentMinOrderByAggregateInput
    _sum?: StudentSumOrderByAggregateInput
  }

  export type StudentScalarWhereWithAggregatesInput = {
    AND?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    OR?: StudentScalarWhereWithAggregatesInput[]
    NOT?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Student"> | string
    userId?: StringWithAggregatesFilter<"Student"> | string
    studentCode?: StringWithAggregatesFilter<"Student"> | string
    firstName?: StringWithAggregatesFilter<"Student"> | string
    lastName?: StringWithAggregatesFilter<"Student"> | string
    program?: StringWithAggregatesFilter<"Student"> | string
    classLevel?: StringNullableWithAggregatesFilter<"Student"> | string | null
    academicYear?: StringNullableWithAggregatesFilter<"Student"> | string | null
    term?: StringNullableWithAggregatesFilter<"Student"> | string | null
    semester?: StringNullableWithAggregatesFilter<"Student"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Student"> | string | null
    currentBalance?: DecimalWithAggregatesFilter<"Student"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Student"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Student"> | Date | string
  }

  export type FeeStructureWhereInput = {
    AND?: FeeStructureWhereInput | FeeStructureWhereInput[]
    OR?: FeeStructureWhereInput[]
    NOT?: FeeStructureWhereInput | FeeStructureWhereInput[]
    id?: StringFilter<"FeeStructure"> | string
    title?: StringFilter<"FeeStructure"> | string
    description?: StringNullableFilter<"FeeStructure"> | string | null
    amount?: DecimalFilter<"FeeStructure"> | Decimal | DecimalJsLike | number | string
    program?: StringNullableFilter<"FeeStructure"> | string | null
    classLevel?: StringNullableFilter<"FeeStructure"> | string | null
    term?: StringNullableFilter<"FeeStructure"> | string | null
    semester?: StringNullableFilter<"FeeStructure"> | string | null
    academicYear?: StringNullableFilter<"FeeStructure"> | string | null
    active?: BoolFilter<"FeeStructure"> | boolean
    createdAt?: DateTimeFilter<"FeeStructure"> | Date | string
    updatedAt?: DateTimeFilter<"FeeStructure"> | Date | string
  }

  export type FeeStructureOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    amount?: SortOrder
    program?: SortOrderInput | SortOrder
    classLevel?: SortOrderInput | SortOrder
    term?: SortOrderInput | SortOrder
    semester?: SortOrderInput | SortOrder
    academicYear?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeeStructureWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FeeStructureWhereInput | FeeStructureWhereInput[]
    OR?: FeeStructureWhereInput[]
    NOT?: FeeStructureWhereInput | FeeStructureWhereInput[]
    title?: StringFilter<"FeeStructure"> | string
    description?: StringNullableFilter<"FeeStructure"> | string | null
    amount?: DecimalFilter<"FeeStructure"> | Decimal | DecimalJsLike | number | string
    program?: StringNullableFilter<"FeeStructure"> | string | null
    classLevel?: StringNullableFilter<"FeeStructure"> | string | null
    term?: StringNullableFilter<"FeeStructure"> | string | null
    semester?: StringNullableFilter<"FeeStructure"> | string | null
    academicYear?: StringNullableFilter<"FeeStructure"> | string | null
    active?: BoolFilter<"FeeStructure"> | boolean
    createdAt?: DateTimeFilter<"FeeStructure"> | Date | string
    updatedAt?: DateTimeFilter<"FeeStructure"> | Date | string
  }, "id">

  export type FeeStructureOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    amount?: SortOrder
    program?: SortOrderInput | SortOrder
    classLevel?: SortOrderInput | SortOrder
    term?: SortOrderInput | SortOrder
    semester?: SortOrderInput | SortOrder
    academicYear?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FeeStructureCountOrderByAggregateInput
    _avg?: FeeStructureAvgOrderByAggregateInput
    _max?: FeeStructureMaxOrderByAggregateInput
    _min?: FeeStructureMinOrderByAggregateInput
    _sum?: FeeStructureSumOrderByAggregateInput
  }

  export type FeeStructureScalarWhereWithAggregatesInput = {
    AND?: FeeStructureScalarWhereWithAggregatesInput | FeeStructureScalarWhereWithAggregatesInput[]
    OR?: FeeStructureScalarWhereWithAggregatesInput[]
    NOT?: FeeStructureScalarWhereWithAggregatesInput | FeeStructureScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FeeStructure"> | string
    title?: StringWithAggregatesFilter<"FeeStructure"> | string
    description?: StringNullableWithAggregatesFilter<"FeeStructure"> | string | null
    amount?: DecimalWithAggregatesFilter<"FeeStructure"> | Decimal | DecimalJsLike | number | string
    program?: StringNullableWithAggregatesFilter<"FeeStructure"> | string | null
    classLevel?: StringNullableWithAggregatesFilter<"FeeStructure"> | string | null
    term?: StringNullableWithAggregatesFilter<"FeeStructure"> | string | null
    semester?: StringNullableWithAggregatesFilter<"FeeStructure"> | string | null
    academicYear?: StringNullableWithAggregatesFilter<"FeeStructure"> | string | null
    active?: BoolWithAggregatesFilter<"FeeStructure"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"FeeStructure"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FeeStructure"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    studentId?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    externalReference?: StringNullableFilter<"Payment"> | string | null
    receiptNumber?: StringNullableFilter<"Payment"> | string | null
    proofUrl?: StringFilter<"Payment"> | string
    payerName?: StringNullableFilter<"Payment"> | string | null
    paymentDate?: DateTimeFilter<"Payment"> | Date | string
    submittedAt?: DateTimeFilter<"Payment"> | Date | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFilter<"Payment"> | $Enums.VerificationStatus
    duplicateFlag?: BoolFilter<"Payment"> | boolean
    ocrText?: StringNullableFilter<"Payment"> | string | null
    ocrAmount?: DecimalNullableFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    ocrReference?: StringNullableFilter<"Payment"> | string | null
    notes?: StringNullableFilter<"Payment"> | string | null
    verificationNotes?: StringNullableFilter<"Payment"> | string | null
    reviewNotes?: StringNullableFilter<"Payment"> | string | null
    reconciliationStatus?: EnumReconciliationStatusFilter<"Payment"> | $Enums.ReconciliationStatus
    reconciliationNote?: StringNullableFilter<"Payment"> | string | null
    reconciledAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reconciledBy?: StringNullableFilter<"Payment"> | string | null
    verifiedBy?: StringNullableFilter<"Payment"> | string | null
    verifiedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reviewedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reviewerId?: StringNullableFilter<"Payment"> | string | null
    academicYear?: StringNullableFilter<"Payment"> | string | null
    term?: StringNullableFilter<"Payment"> | string | null
    semester?: StringNullableFilter<"Payment"> | string | null
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
    reconciler?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    verifier?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    reviewer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    method?: SortOrder
    externalReference?: SortOrderInput | SortOrder
    receiptNumber?: SortOrderInput | SortOrder
    proofUrl?: SortOrder
    payerName?: SortOrderInput | SortOrder
    paymentDate?: SortOrder
    submittedAt?: SortOrder
    status?: SortOrder
    verificationStatus?: SortOrder
    duplicateFlag?: SortOrder
    ocrText?: SortOrderInput | SortOrder
    ocrAmount?: SortOrderInput | SortOrder
    ocrReference?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    verificationNotes?: SortOrderInput | SortOrder
    reviewNotes?: SortOrderInput | SortOrder
    reconciliationStatus?: SortOrder
    reconciliationNote?: SortOrderInput | SortOrder
    reconciledAt?: SortOrderInput | SortOrder
    reconciledBy?: SortOrderInput | SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewerId?: SortOrderInput | SortOrder
    academicYear?: SortOrderInput | SortOrder
    term?: SortOrderInput | SortOrder
    semester?: SortOrderInput | SortOrder
    student?: StudentOrderByWithRelationInput
    reconciler?: UserOrderByWithRelationInput
    verifier?: UserOrderByWithRelationInput
    reviewer?: UserOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    studentId?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    externalReference?: StringNullableFilter<"Payment"> | string | null
    receiptNumber?: StringNullableFilter<"Payment"> | string | null
    proofUrl?: StringFilter<"Payment"> | string
    payerName?: StringNullableFilter<"Payment"> | string | null
    paymentDate?: DateTimeFilter<"Payment"> | Date | string
    submittedAt?: DateTimeFilter<"Payment"> | Date | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFilter<"Payment"> | $Enums.VerificationStatus
    duplicateFlag?: BoolFilter<"Payment"> | boolean
    ocrText?: StringNullableFilter<"Payment"> | string | null
    ocrAmount?: DecimalNullableFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    ocrReference?: StringNullableFilter<"Payment"> | string | null
    notes?: StringNullableFilter<"Payment"> | string | null
    verificationNotes?: StringNullableFilter<"Payment"> | string | null
    reviewNotes?: StringNullableFilter<"Payment"> | string | null
    reconciliationStatus?: EnumReconciliationStatusFilter<"Payment"> | $Enums.ReconciliationStatus
    reconciliationNote?: StringNullableFilter<"Payment"> | string | null
    reconciledAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reconciledBy?: StringNullableFilter<"Payment"> | string | null
    verifiedBy?: StringNullableFilter<"Payment"> | string | null
    verifiedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reviewedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reviewerId?: StringNullableFilter<"Payment"> | string | null
    academicYear?: StringNullableFilter<"Payment"> | string | null
    term?: StringNullableFilter<"Payment"> | string | null
    semester?: StringNullableFilter<"Payment"> | string | null
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
    reconciler?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    verifier?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    reviewer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    method?: SortOrder
    externalReference?: SortOrderInput | SortOrder
    receiptNumber?: SortOrderInput | SortOrder
    proofUrl?: SortOrder
    payerName?: SortOrderInput | SortOrder
    paymentDate?: SortOrder
    submittedAt?: SortOrder
    status?: SortOrder
    verificationStatus?: SortOrder
    duplicateFlag?: SortOrder
    ocrText?: SortOrderInput | SortOrder
    ocrAmount?: SortOrderInput | SortOrder
    ocrReference?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    verificationNotes?: SortOrderInput | SortOrder
    reviewNotes?: SortOrderInput | SortOrder
    reconciliationStatus?: SortOrder
    reconciliationNote?: SortOrderInput | SortOrder
    reconciledAt?: SortOrderInput | SortOrder
    reconciledBy?: SortOrderInput | SortOrder
    verifiedBy?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewerId?: SortOrderInput | SortOrder
    academicYear?: SortOrderInput | SortOrder
    term?: SortOrderInput | SortOrder
    semester?: SortOrderInput | SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    studentId?: StringWithAggregatesFilter<"Payment"> | string
    amount?: DecimalWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"Payment"> | string
    method?: EnumPaymentMethodWithAggregatesFilter<"Payment"> | $Enums.PaymentMethod
    externalReference?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    receiptNumber?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    proofUrl?: StringWithAggregatesFilter<"Payment"> | string
    payerName?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    paymentDate?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    submittedAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    status?: EnumPaymentStatusWithAggregatesFilter<"Payment"> | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusWithAggregatesFilter<"Payment"> | $Enums.VerificationStatus
    duplicateFlag?: BoolWithAggregatesFilter<"Payment"> | boolean
    ocrText?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    ocrAmount?: DecimalNullableWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    ocrReference?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    verificationNotes?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    reviewNotes?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    reconciliationStatus?: EnumReconciliationStatusWithAggregatesFilter<"Payment"> | $Enums.ReconciliationStatus
    reconciliationNote?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    reconciledAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    reconciledBy?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    verifiedBy?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    reviewerId?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    academicYear?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    term?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    semester?: StringNullableWithAggregatesFilter<"Payment"> | string | null
  }

  export type GeneratedReportWhereInput = {
    AND?: GeneratedReportWhereInput | GeneratedReportWhereInput[]
    OR?: GeneratedReportWhereInput[]
    NOT?: GeneratedReportWhereInput | GeneratedReportWhereInput[]
    id?: StringFilter<"GeneratedReport"> | string
    title?: StringFilter<"GeneratedReport"> | string
    reportType?: StringFilter<"GeneratedReport"> | string
    filters?: JsonFilter<"GeneratedReport">
    data?: JsonNullableFilter<"GeneratedReport">
    generatedBy?: StringFilter<"GeneratedReport"> | string
    createdAt?: DateTimeFilter<"GeneratedReport"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type GeneratedReportOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    reportType?: SortOrder
    filters?: SortOrder
    data?: SortOrderInput | SortOrder
    generatedBy?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type GeneratedReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GeneratedReportWhereInput | GeneratedReportWhereInput[]
    OR?: GeneratedReportWhereInput[]
    NOT?: GeneratedReportWhereInput | GeneratedReportWhereInput[]
    title?: StringFilter<"GeneratedReport"> | string
    reportType?: StringFilter<"GeneratedReport"> | string
    filters?: JsonFilter<"GeneratedReport">
    data?: JsonNullableFilter<"GeneratedReport">
    generatedBy?: StringFilter<"GeneratedReport"> | string
    createdAt?: DateTimeFilter<"GeneratedReport"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type GeneratedReportOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    reportType?: SortOrder
    filters?: SortOrder
    data?: SortOrderInput | SortOrder
    generatedBy?: SortOrder
    createdAt?: SortOrder
    _count?: GeneratedReportCountOrderByAggregateInput
    _max?: GeneratedReportMaxOrderByAggregateInput
    _min?: GeneratedReportMinOrderByAggregateInput
  }

  export type GeneratedReportScalarWhereWithAggregatesInput = {
    AND?: GeneratedReportScalarWhereWithAggregatesInput | GeneratedReportScalarWhereWithAggregatesInput[]
    OR?: GeneratedReportScalarWhereWithAggregatesInput[]
    NOT?: GeneratedReportScalarWhereWithAggregatesInput | GeneratedReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GeneratedReport"> | string
    title?: StringWithAggregatesFilter<"GeneratedReport"> | string
    reportType?: StringWithAggregatesFilter<"GeneratedReport"> | string
    filters?: JsonWithAggregatesFilter<"GeneratedReport">
    data?: JsonNullableWithAggregatesFilter<"GeneratedReport">
    generatedBy?: StringWithAggregatesFilter<"GeneratedReport"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GeneratedReport"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    type?: StringWithAggregatesFilter<"Notification"> | string
    read?: BoolWithAggregatesFilter<"Notification"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type SystemRegistryWhereInput = {
    AND?: SystemRegistryWhereInput | SystemRegistryWhereInput[]
    OR?: SystemRegistryWhereInput[]
    NOT?: SystemRegistryWhereInput | SystemRegistryWhereInput[]
    id?: StringFilter<"SystemRegistry"> | string
    institutionName?: StringFilter<"SystemRegistry"> | string
    institutionType?: StringFilter<"SystemRegistry"> | string
    address?: StringNullableFilter<"SystemRegistry"> | string | null
    logoUrl?: StringNullableFilter<"SystemRegistry"> | string | null
    contactEmail?: StringNullableFilter<"SystemRegistry"> | string | null
    updatedAt?: DateTimeFilter<"SystemRegistry"> | Date | string
  }

  export type SystemRegistryOrderByWithRelationInput = {
    id?: SortOrder
    institutionName?: SortOrder
    institutionType?: SortOrder
    address?: SortOrderInput | SortOrder
    logoUrl?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type SystemRegistryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SystemRegistryWhereInput | SystemRegistryWhereInput[]
    OR?: SystemRegistryWhereInput[]
    NOT?: SystemRegistryWhereInput | SystemRegistryWhereInput[]
    institutionName?: StringFilter<"SystemRegistry"> | string
    institutionType?: StringFilter<"SystemRegistry"> | string
    address?: StringNullableFilter<"SystemRegistry"> | string | null
    logoUrl?: StringNullableFilter<"SystemRegistry"> | string | null
    contactEmail?: StringNullableFilter<"SystemRegistry"> | string | null
    updatedAt?: DateTimeFilter<"SystemRegistry"> | Date | string
  }, "id">

  export type SystemRegistryOrderByWithAggregationInput = {
    id?: SortOrder
    institutionName?: SortOrder
    institutionType?: SortOrder
    address?: SortOrderInput | SortOrder
    logoUrl?: SortOrderInput | SortOrder
    contactEmail?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: SystemRegistryCountOrderByAggregateInput
    _max?: SystemRegistryMaxOrderByAggregateInput
    _min?: SystemRegistryMinOrderByAggregateInput
  }

  export type SystemRegistryScalarWhereWithAggregatesInput = {
    AND?: SystemRegistryScalarWhereWithAggregatesInput | SystemRegistryScalarWhereWithAggregatesInput[]
    OR?: SystemRegistryScalarWhereWithAggregatesInput[]
    NOT?: SystemRegistryScalarWhereWithAggregatesInput | SystemRegistryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemRegistry"> | string
    institutionName?: StringWithAggregatesFilter<"SystemRegistry"> | string
    institutionType?: StringWithAggregatesFilter<"SystemRegistry"> | string
    address?: StringNullableWithAggregatesFilter<"SystemRegistry"> | string | null
    logoUrl?: StringNullableWithAggregatesFilter<"SystemRegistry"> | string | null
    contactEmail?: StringNullableWithAggregatesFilter<"SystemRegistry"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"SystemRegistry"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentCreateNestedOneWithoutUserInput
    verifiedPayments?: PaymentCreateNestedManyWithoutVerifierInput
    reviewedPayments?: PaymentCreateNestedManyWithoutReviewerInput
    reconciledPayments?: PaymentCreateNestedManyWithoutReconcilerInput
    generatedReports?: GeneratedReportCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    verifiedPayments?: PaymentUncheckedCreateNestedManyWithoutVerifierInput
    reviewedPayments?: PaymentUncheckedCreateNestedManyWithoutReviewerInput
    reconciledPayments?: PaymentUncheckedCreateNestedManyWithoutReconcilerInput
    generatedReports?: GeneratedReportUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneWithoutUserNestedInput
    verifiedPayments?: PaymentUpdateManyWithoutVerifierNestedInput
    reviewedPayments?: PaymentUpdateManyWithoutReviewerNestedInput
    reconciledPayments?: PaymentUpdateManyWithoutReconcilerNestedInput
    generatedReports?: GeneratedReportUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    verifiedPayments?: PaymentUncheckedUpdateManyWithoutVerifierNestedInput
    reviewedPayments?: PaymentUncheckedUpdateManyWithoutReviewerNestedInput
    reconciledPayments?: PaymentUncheckedUpdateManyWithoutReconcilerNestedInput
    generatedReports?: GeneratedReportUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentCreateInput = {
    id?: string
    studentCode: string
    firstName: string
    lastName: string
    program: string
    classLevel?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    phone?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentInput
    payments?: PaymentCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateInput = {
    id?: string
    userId: string
    studentCode: string
    firstName: string
    lastName: string
    program: string
    classLevel?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    phone?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentCode?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    program?: StringFieldUpdateOperationsInput | string
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentNestedInput
    payments?: PaymentUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    studentCode?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    program?: StringFieldUpdateOperationsInput | string
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateManyInput = {
    id?: string
    userId: string
    studentCode: string
    firstName: string
    lastName: string
    program: string
    classLevel?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    phone?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentCode?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    program?: StringFieldUpdateOperationsInput | string
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    studentCode?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    program?: StringFieldUpdateOperationsInput | string
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeeStructureCreateInput = {
    id?: string
    title: string
    description?: string | null
    amount: Decimal | DecimalJsLike | number | string
    program?: string | null
    classLevel?: string | null
    term?: string | null
    semester?: string | null
    academicYear?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeeStructureUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    amount: Decimal | DecimalJsLike | number | string
    program?: string | null
    classLevel?: string | null
    term?: string | null
    semester?: string | null
    academicYear?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeeStructureUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    program?: NullableStringFieldUpdateOperationsInput | string | null
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeeStructureUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    program?: NullableStringFieldUpdateOperationsInput | string | null
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeeStructureCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    amount: Decimal | DecimalJsLike | number | string
    program?: string | null
    classLevel?: string | null
    term?: string | null
    semester?: string | null
    academicYear?: string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeeStructureUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    program?: NullableStringFieldUpdateOperationsInput | string | null
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeeStructureUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    program?: NullableStringFieldUpdateOperationsInput | string | null
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    student: StudentCreateNestedOneWithoutPaymentsInput
    reconciler?: UserCreateNestedOneWithoutReconciledPaymentsInput
    verifier?: UserCreateNestedOneWithoutVerifiedPaymentsInput
    reviewer?: UserCreateNestedOneWithoutReviewedPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    studentId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    reconciledBy?: string | null
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewerId?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    student?: StudentUpdateOneRequiredWithoutPaymentsNestedInput
    reconciler?: UserUpdateOneWithoutReconciledPaymentsNestedInput
    verifier?: UserUpdateOneWithoutVerifiedPaymentsNestedInput
    reviewer?: UserUpdateOneWithoutReviewedPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reconciledBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentCreateManyInput = {
    id?: string
    studentId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    reconciledBy?: string | null
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewerId?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reconciledBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GeneratedReportCreateInput = {
    id?: string
    title: string
    reportType: string
    filters: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutGeneratedReportsInput
  }

  export type GeneratedReportUncheckedCreateInput = {
    id?: string
    title: string
    reportType: string
    filters: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    generatedBy: string
    createdAt?: Date | string
  }

  export type GeneratedReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    filters?: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGeneratedReportsNestedInput
  }

  export type GeneratedReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    filters?: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    generatedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneratedReportCreateManyInput = {
    id?: string
    title: string
    reportType: string
    filters: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    generatedBy: string
    createdAt?: Date | string
  }

  export type GeneratedReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    filters?: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneratedReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    filters?: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    generatedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    message: string
    type: string
    read?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    message: string
    type: string
    read?: boolean
    createdAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId: string
    title: string
    message: string
    type: string
    read?: boolean
    createdAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemRegistryCreateInput = {
    id?: string
    institutionName?: string
    institutionType?: string
    address?: string | null
    logoUrl?: string | null
    contactEmail?: string | null
    updatedAt?: Date | string
  }

  export type SystemRegistryUncheckedCreateInput = {
    id?: string
    institutionName?: string
    institutionType?: string
    address?: string | null
    logoUrl?: string | null
    contactEmail?: string | null
    updatedAt?: Date | string
  }

  export type SystemRegistryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionName?: StringFieldUpdateOperationsInput | string
    institutionType?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemRegistryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionName?: StringFieldUpdateOperationsInput | string
    institutionType?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemRegistryCreateManyInput = {
    id?: string
    institutionName?: string
    institutionType?: string
    address?: string | null
    logoUrl?: string | null
    contactEmail?: string | null
    updatedAt?: Date | string
  }

  export type SystemRegistryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionName?: StringFieldUpdateOperationsInput | string
    institutionType?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemRegistryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    institutionName?: StringFieldUpdateOperationsInput | string
    institutionType?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    contactEmail?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type EnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StudentNullableScalarRelationFilter = {
    is?: StudentWhereInput | null
    isNot?: StudentWhereInput | null
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type GeneratedReportListRelationFilter = {
    every?: GeneratedReportWhereInput
    some?: GeneratedReportWhereInput
    none?: GeneratedReportWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GeneratedReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    status?: SortOrder
    profilePictureUrl?: SortOrder
    currentSessionId?: SortOrder
    sessionExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    status?: SortOrder
    profilePictureUrl?: SortOrder
    currentSessionId?: SortOrder
    sessionExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    role?: SortOrder
    status?: SortOrder
    profilePictureUrl?: SortOrder
    currentSessionId?: SortOrder
    sessionExpires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type StudentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    studentCode?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    program?: SortOrder
    classLevel?: SortOrder
    academicYear?: SortOrder
    term?: SortOrder
    semester?: SortOrder
    phone?: SortOrder
    currentBalance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentAvgOrderByAggregateInput = {
    currentBalance?: SortOrder
  }

  export type StudentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    studentCode?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    program?: SortOrder
    classLevel?: SortOrder
    academicYear?: SortOrder
    term?: SortOrder
    semester?: SortOrder
    phone?: SortOrder
    currentBalance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    studentCode?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    program?: SortOrder
    classLevel?: SortOrder
    academicYear?: SortOrder
    term?: SortOrder
    semester?: SortOrder
    phone?: SortOrder
    currentBalance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentSumOrderByAggregateInput = {
    currentBalance?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FeeStructureCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    program?: SortOrder
    classLevel?: SortOrder
    term?: SortOrder
    semester?: SortOrder
    academicYear?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeeStructureAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type FeeStructureMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    program?: SortOrder
    classLevel?: SortOrder
    term?: SortOrder
    semester?: SortOrder
    academicYear?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeeStructureMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    amount?: SortOrder
    program?: SortOrder
    classLevel?: SortOrder
    term?: SortOrder
    semester?: SortOrder
    academicYear?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeeStructureSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type EnumVerificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusFilter<$PrismaModel> | $Enums.VerificationStatus
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumReconciliationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReconciliationStatus | EnumReconciliationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReconciliationStatus[] | ListEnumReconciliationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReconciliationStatus[] | ListEnumReconciliationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReconciliationStatusFilter<$PrismaModel> | $Enums.ReconciliationStatus
  }

  export type StudentScalarRelationFilter = {
    is?: StudentWhereInput
    isNot?: StudentWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    method?: SortOrder
    externalReference?: SortOrder
    receiptNumber?: SortOrder
    proofUrl?: SortOrder
    payerName?: SortOrder
    paymentDate?: SortOrder
    submittedAt?: SortOrder
    status?: SortOrder
    verificationStatus?: SortOrder
    duplicateFlag?: SortOrder
    ocrText?: SortOrder
    ocrAmount?: SortOrder
    ocrReference?: SortOrder
    notes?: SortOrder
    verificationNotes?: SortOrder
    reviewNotes?: SortOrder
    reconciliationStatus?: SortOrder
    reconciliationNote?: SortOrder
    reconciledAt?: SortOrder
    reconciledBy?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewerId?: SortOrder
    academicYear?: SortOrder
    term?: SortOrder
    semester?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
    ocrAmount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    method?: SortOrder
    externalReference?: SortOrder
    receiptNumber?: SortOrder
    proofUrl?: SortOrder
    payerName?: SortOrder
    paymentDate?: SortOrder
    submittedAt?: SortOrder
    status?: SortOrder
    verificationStatus?: SortOrder
    duplicateFlag?: SortOrder
    ocrText?: SortOrder
    ocrAmount?: SortOrder
    ocrReference?: SortOrder
    notes?: SortOrder
    verificationNotes?: SortOrder
    reviewNotes?: SortOrder
    reconciliationStatus?: SortOrder
    reconciliationNote?: SortOrder
    reconciledAt?: SortOrder
    reconciledBy?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewerId?: SortOrder
    academicYear?: SortOrder
    term?: SortOrder
    semester?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    method?: SortOrder
    externalReference?: SortOrder
    receiptNumber?: SortOrder
    proofUrl?: SortOrder
    payerName?: SortOrder
    paymentDate?: SortOrder
    submittedAt?: SortOrder
    status?: SortOrder
    verificationStatus?: SortOrder
    duplicateFlag?: SortOrder
    ocrText?: SortOrder
    ocrAmount?: SortOrder
    ocrReference?: SortOrder
    notes?: SortOrder
    verificationNotes?: SortOrder
    reviewNotes?: SortOrder
    reconciliationStatus?: SortOrder
    reconciliationNote?: SortOrder
    reconciledAt?: SortOrder
    reconciledBy?: SortOrder
    verifiedBy?: SortOrder
    verifiedAt?: SortOrder
    reviewedAt?: SortOrder
    reviewerId?: SortOrder
    academicYear?: SortOrder
    term?: SortOrder
    semester?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
    ocrAmount?: SortOrder
  }

  export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type EnumVerificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.VerificationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVerificationStatusFilter<$PrismaModel>
    _max?: NestedEnumVerificationStatusFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumReconciliationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReconciliationStatus | EnumReconciliationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReconciliationStatus[] | ListEnumReconciliationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReconciliationStatus[] | ListEnumReconciliationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReconciliationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReconciliationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReconciliationStatusFilter<$PrismaModel>
    _max?: NestedEnumReconciliationStatusFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type GeneratedReportCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    reportType?: SortOrder
    filters?: SortOrder
    data?: SortOrder
    generatedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type GeneratedReportMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    reportType?: SortOrder
    generatedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type GeneratedReportMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    reportType?: SortOrder
    generatedBy?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    read?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemRegistryCountOrderByAggregateInput = {
    id?: SortOrder
    institutionName?: SortOrder
    institutionType?: SortOrder
    address?: SortOrder
    logoUrl?: SortOrder
    contactEmail?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemRegistryMaxOrderByAggregateInput = {
    id?: SortOrder
    institutionName?: SortOrder
    institutionType?: SortOrder
    address?: SortOrder
    logoUrl?: SortOrder
    contactEmail?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemRegistryMinOrderByAggregateInput = {
    id?: SortOrder
    institutionName?: SortOrder
    institutionType?: SortOrder
    address?: SortOrder
    logoUrl?: SortOrder
    contactEmail?: SortOrder
    updatedAt?: SortOrder
  }

  export type StudentCreateNestedOneWithoutUserInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    connect?: StudentWhereUniqueInput
  }

  export type PaymentCreateNestedManyWithoutVerifierInput = {
    create?: XOR<PaymentCreateWithoutVerifierInput, PaymentUncheckedCreateWithoutVerifierInput> | PaymentCreateWithoutVerifierInput[] | PaymentUncheckedCreateWithoutVerifierInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutVerifierInput | PaymentCreateOrConnectWithoutVerifierInput[]
    createMany?: PaymentCreateManyVerifierInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutReviewerInput = {
    create?: XOR<PaymentCreateWithoutReviewerInput, PaymentUncheckedCreateWithoutReviewerInput> | PaymentCreateWithoutReviewerInput[] | PaymentUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutReviewerInput | PaymentCreateOrConnectWithoutReviewerInput[]
    createMany?: PaymentCreateManyReviewerInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutReconcilerInput = {
    create?: XOR<PaymentCreateWithoutReconcilerInput, PaymentUncheckedCreateWithoutReconcilerInput> | PaymentCreateWithoutReconcilerInput[] | PaymentUncheckedCreateWithoutReconcilerInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutReconcilerInput | PaymentCreateOrConnectWithoutReconcilerInput[]
    createMany?: PaymentCreateManyReconcilerInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type GeneratedReportCreateNestedManyWithoutUserInput = {
    create?: XOR<GeneratedReportCreateWithoutUserInput, GeneratedReportUncheckedCreateWithoutUserInput> | GeneratedReportCreateWithoutUserInput[] | GeneratedReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GeneratedReportCreateOrConnectWithoutUserInput | GeneratedReportCreateOrConnectWithoutUserInput[]
    createMany?: GeneratedReportCreateManyUserInputEnvelope
    connect?: GeneratedReportWhereUniqueInput | GeneratedReportWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type StudentUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    connect?: StudentWhereUniqueInput
  }

  export type PaymentUncheckedCreateNestedManyWithoutVerifierInput = {
    create?: XOR<PaymentCreateWithoutVerifierInput, PaymentUncheckedCreateWithoutVerifierInput> | PaymentCreateWithoutVerifierInput[] | PaymentUncheckedCreateWithoutVerifierInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutVerifierInput | PaymentCreateOrConnectWithoutVerifierInput[]
    createMany?: PaymentCreateManyVerifierInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutReviewerInput = {
    create?: XOR<PaymentCreateWithoutReviewerInput, PaymentUncheckedCreateWithoutReviewerInput> | PaymentCreateWithoutReviewerInput[] | PaymentUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutReviewerInput | PaymentCreateOrConnectWithoutReviewerInput[]
    createMany?: PaymentCreateManyReviewerInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutReconcilerInput = {
    create?: XOR<PaymentCreateWithoutReconcilerInput, PaymentUncheckedCreateWithoutReconcilerInput> | PaymentCreateWithoutReconcilerInput[] | PaymentUncheckedCreateWithoutReconcilerInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutReconcilerInput | PaymentCreateOrConnectWithoutReconcilerInput[]
    createMany?: PaymentCreateManyReconcilerInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type GeneratedReportUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GeneratedReportCreateWithoutUserInput, GeneratedReportUncheckedCreateWithoutUserInput> | GeneratedReportCreateWithoutUserInput[] | GeneratedReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GeneratedReportCreateOrConnectWithoutUserInput | GeneratedReportCreateOrConnectWithoutUserInput[]
    createMany?: GeneratedReportCreateManyUserInputEnvelope
    connect?: GeneratedReportWhereUniqueInput | GeneratedReportWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StudentUpdateOneWithoutUserNestedInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    upsert?: StudentUpsertWithoutUserInput
    disconnect?: StudentWhereInput | boolean
    delete?: StudentWhereInput | boolean
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutUserInput, StudentUpdateWithoutUserInput>, StudentUncheckedUpdateWithoutUserInput>
  }

  export type PaymentUpdateManyWithoutVerifierNestedInput = {
    create?: XOR<PaymentCreateWithoutVerifierInput, PaymentUncheckedCreateWithoutVerifierInput> | PaymentCreateWithoutVerifierInput[] | PaymentUncheckedCreateWithoutVerifierInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutVerifierInput | PaymentCreateOrConnectWithoutVerifierInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutVerifierInput | PaymentUpsertWithWhereUniqueWithoutVerifierInput[]
    createMany?: PaymentCreateManyVerifierInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutVerifierInput | PaymentUpdateWithWhereUniqueWithoutVerifierInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutVerifierInput | PaymentUpdateManyWithWhereWithoutVerifierInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<PaymentCreateWithoutReviewerInput, PaymentUncheckedCreateWithoutReviewerInput> | PaymentCreateWithoutReviewerInput[] | PaymentUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutReviewerInput | PaymentCreateOrConnectWithoutReviewerInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutReviewerInput | PaymentUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: PaymentCreateManyReviewerInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutReviewerInput | PaymentUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutReviewerInput | PaymentUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutReconcilerNestedInput = {
    create?: XOR<PaymentCreateWithoutReconcilerInput, PaymentUncheckedCreateWithoutReconcilerInput> | PaymentCreateWithoutReconcilerInput[] | PaymentUncheckedCreateWithoutReconcilerInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutReconcilerInput | PaymentCreateOrConnectWithoutReconcilerInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutReconcilerInput | PaymentUpsertWithWhereUniqueWithoutReconcilerInput[]
    createMany?: PaymentCreateManyReconcilerInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutReconcilerInput | PaymentUpdateWithWhereUniqueWithoutReconcilerInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutReconcilerInput | PaymentUpdateManyWithWhereWithoutReconcilerInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type GeneratedReportUpdateManyWithoutUserNestedInput = {
    create?: XOR<GeneratedReportCreateWithoutUserInput, GeneratedReportUncheckedCreateWithoutUserInput> | GeneratedReportCreateWithoutUserInput[] | GeneratedReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GeneratedReportCreateOrConnectWithoutUserInput | GeneratedReportCreateOrConnectWithoutUserInput[]
    upsert?: GeneratedReportUpsertWithWhereUniqueWithoutUserInput | GeneratedReportUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GeneratedReportCreateManyUserInputEnvelope
    set?: GeneratedReportWhereUniqueInput | GeneratedReportWhereUniqueInput[]
    disconnect?: GeneratedReportWhereUniqueInput | GeneratedReportWhereUniqueInput[]
    delete?: GeneratedReportWhereUniqueInput | GeneratedReportWhereUniqueInput[]
    connect?: GeneratedReportWhereUniqueInput | GeneratedReportWhereUniqueInput[]
    update?: GeneratedReportUpdateWithWhereUniqueWithoutUserInput | GeneratedReportUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GeneratedReportUpdateManyWithWhereWithoutUserInput | GeneratedReportUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GeneratedReportScalarWhereInput | GeneratedReportScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type StudentUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    connectOrCreate?: StudentCreateOrConnectWithoutUserInput
    upsert?: StudentUpsertWithoutUserInput
    disconnect?: StudentWhereInput | boolean
    delete?: StudentWhereInput | boolean
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutUserInput, StudentUpdateWithoutUserInput>, StudentUncheckedUpdateWithoutUserInput>
  }

  export type PaymentUncheckedUpdateManyWithoutVerifierNestedInput = {
    create?: XOR<PaymentCreateWithoutVerifierInput, PaymentUncheckedCreateWithoutVerifierInput> | PaymentCreateWithoutVerifierInput[] | PaymentUncheckedCreateWithoutVerifierInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutVerifierInput | PaymentCreateOrConnectWithoutVerifierInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutVerifierInput | PaymentUpsertWithWhereUniqueWithoutVerifierInput[]
    createMany?: PaymentCreateManyVerifierInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutVerifierInput | PaymentUpdateWithWhereUniqueWithoutVerifierInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutVerifierInput | PaymentUpdateManyWithWhereWithoutVerifierInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutReviewerNestedInput = {
    create?: XOR<PaymentCreateWithoutReviewerInput, PaymentUncheckedCreateWithoutReviewerInput> | PaymentCreateWithoutReviewerInput[] | PaymentUncheckedCreateWithoutReviewerInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutReviewerInput | PaymentCreateOrConnectWithoutReviewerInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutReviewerInput | PaymentUpsertWithWhereUniqueWithoutReviewerInput[]
    createMany?: PaymentCreateManyReviewerInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutReviewerInput | PaymentUpdateWithWhereUniqueWithoutReviewerInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutReviewerInput | PaymentUpdateManyWithWhereWithoutReviewerInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutReconcilerNestedInput = {
    create?: XOR<PaymentCreateWithoutReconcilerInput, PaymentUncheckedCreateWithoutReconcilerInput> | PaymentCreateWithoutReconcilerInput[] | PaymentUncheckedCreateWithoutReconcilerInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutReconcilerInput | PaymentCreateOrConnectWithoutReconcilerInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutReconcilerInput | PaymentUpsertWithWhereUniqueWithoutReconcilerInput[]
    createMany?: PaymentCreateManyReconcilerInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutReconcilerInput | PaymentUpdateWithWhereUniqueWithoutReconcilerInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutReconcilerInput | PaymentUpdateManyWithWhereWithoutReconcilerInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type GeneratedReportUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GeneratedReportCreateWithoutUserInput, GeneratedReportUncheckedCreateWithoutUserInput> | GeneratedReportCreateWithoutUserInput[] | GeneratedReportUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GeneratedReportCreateOrConnectWithoutUserInput | GeneratedReportCreateOrConnectWithoutUserInput[]
    upsert?: GeneratedReportUpsertWithWhereUniqueWithoutUserInput | GeneratedReportUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GeneratedReportCreateManyUserInputEnvelope
    set?: GeneratedReportWhereUniqueInput | GeneratedReportWhereUniqueInput[]
    disconnect?: GeneratedReportWhereUniqueInput | GeneratedReportWhereUniqueInput[]
    delete?: GeneratedReportWhereUniqueInput | GeneratedReportWhereUniqueInput[]
    connect?: GeneratedReportWhereUniqueInput | GeneratedReportWhereUniqueInput[]
    update?: GeneratedReportUpdateWithWhereUniqueWithoutUserInput | GeneratedReportUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GeneratedReportUpdateManyWithWhereWithoutUserInput | GeneratedReportUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GeneratedReportScalarWhereInput | GeneratedReportScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutStudentInput = {
    create?: XOR<UserCreateWithoutStudentInput, UserUncheckedCreateWithoutStudentInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentInput
    connect?: UserWhereUniqueInput
  }

  export type PaymentCreateNestedManyWithoutStudentInput = {
    create?: XOR<PaymentCreateWithoutStudentInput, PaymentUncheckedCreateWithoutStudentInput> | PaymentCreateWithoutStudentInput[] | PaymentUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutStudentInput | PaymentCreateOrConnectWithoutStudentInput[]
    createMany?: PaymentCreateManyStudentInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<PaymentCreateWithoutStudentInput, PaymentUncheckedCreateWithoutStudentInput> | PaymentCreateWithoutStudentInput[] | PaymentUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutStudentInput | PaymentCreateOrConnectWithoutStudentInput[]
    createMany?: PaymentCreateManyStudentInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type UserUpdateOneRequiredWithoutStudentNestedInput = {
    create?: XOR<UserCreateWithoutStudentInput, UserUncheckedCreateWithoutStudentInput>
    connectOrCreate?: UserCreateOrConnectWithoutStudentInput
    upsert?: UserUpsertWithoutStudentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStudentInput, UserUpdateWithoutStudentInput>, UserUncheckedUpdateWithoutStudentInput>
  }

  export type PaymentUpdateManyWithoutStudentNestedInput = {
    create?: XOR<PaymentCreateWithoutStudentInput, PaymentUncheckedCreateWithoutStudentInput> | PaymentCreateWithoutStudentInput[] | PaymentUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutStudentInput | PaymentCreateOrConnectWithoutStudentInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutStudentInput | PaymentUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: PaymentCreateManyStudentInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutStudentInput | PaymentUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutStudentInput | PaymentUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<PaymentCreateWithoutStudentInput, PaymentUncheckedCreateWithoutStudentInput> | PaymentCreateWithoutStudentInput[] | PaymentUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutStudentInput | PaymentCreateOrConnectWithoutStudentInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutStudentInput | PaymentUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: PaymentCreateManyStudentInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutStudentInput | PaymentUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutStudentInput | PaymentUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type StudentCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<StudentCreateWithoutPaymentsInput, StudentUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutPaymentsInput
    connect?: StudentWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReconciledPaymentsInput = {
    create?: XOR<UserCreateWithoutReconciledPaymentsInput, UserUncheckedCreateWithoutReconciledPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReconciledPaymentsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutVerifiedPaymentsInput = {
    create?: XOR<UserCreateWithoutVerifiedPaymentsInput, UserUncheckedCreateWithoutVerifiedPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutVerifiedPaymentsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReviewedPaymentsInput = {
    create?: XOR<UserCreateWithoutReviewedPaymentsInput, UserUncheckedCreateWithoutReviewedPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewedPaymentsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type EnumVerificationStatusFieldUpdateOperationsInput = {
    set?: $Enums.VerificationStatus
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumReconciliationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReconciliationStatus
  }

  export type StudentUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<StudentCreateWithoutPaymentsInput, StudentUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutPaymentsInput
    upsert?: StudentUpsertWithoutPaymentsInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutPaymentsInput, StudentUpdateWithoutPaymentsInput>, StudentUncheckedUpdateWithoutPaymentsInput>
  }

  export type UserUpdateOneWithoutReconciledPaymentsNestedInput = {
    create?: XOR<UserCreateWithoutReconciledPaymentsInput, UserUncheckedCreateWithoutReconciledPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReconciledPaymentsInput
    upsert?: UserUpsertWithoutReconciledPaymentsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReconciledPaymentsInput, UserUpdateWithoutReconciledPaymentsInput>, UserUncheckedUpdateWithoutReconciledPaymentsInput>
  }

  export type UserUpdateOneWithoutVerifiedPaymentsNestedInput = {
    create?: XOR<UserCreateWithoutVerifiedPaymentsInput, UserUncheckedCreateWithoutVerifiedPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutVerifiedPaymentsInput
    upsert?: UserUpsertWithoutVerifiedPaymentsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutVerifiedPaymentsInput, UserUpdateWithoutVerifiedPaymentsInput>, UserUncheckedUpdateWithoutVerifiedPaymentsInput>
  }

  export type UserUpdateOneWithoutReviewedPaymentsNestedInput = {
    create?: XOR<UserCreateWithoutReviewedPaymentsInput, UserUncheckedCreateWithoutReviewedPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewedPaymentsInput
    upsert?: UserUpsertWithoutReviewedPaymentsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReviewedPaymentsInput, UserUpdateWithoutReviewedPaymentsInput>, UserUncheckedUpdateWithoutReviewedPaymentsInput>
  }

  export type UserCreateNestedOneWithoutGeneratedReportsInput = {
    create?: XOR<UserCreateWithoutGeneratedReportsInput, UserUncheckedCreateWithoutGeneratedReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGeneratedReportsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutGeneratedReportsNestedInput = {
    create?: XOR<UserCreateWithoutGeneratedReportsInput, UserUncheckedCreateWithoutGeneratedReportsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGeneratedReportsInput
    upsert?: UserUpsertWithoutGeneratedReportsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGeneratedReportsInput, UserUpdateWithoutGeneratedReportsInput>, UserUncheckedUpdateWithoutGeneratedReportsInput>
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedEnumVerificationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusFilter<$PrismaModel> | $Enums.VerificationStatus
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumReconciliationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReconciliationStatus | EnumReconciliationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReconciliationStatus[] | ListEnumReconciliationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReconciliationStatus[] | ListEnumReconciliationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReconciliationStatusFilter<$PrismaModel> | $Enums.ReconciliationStatus
  }

  export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VerificationStatus | EnumVerificationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.VerificationStatus[] | ListEnumVerificationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumVerificationStatusWithAggregatesFilter<$PrismaModel> | $Enums.VerificationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVerificationStatusFilter<$PrismaModel>
    _max?: NestedEnumVerificationStatusFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumReconciliationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReconciliationStatus | EnumReconciliationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReconciliationStatus[] | ListEnumReconciliationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ReconciliationStatus[] | ListEnumReconciliationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumReconciliationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReconciliationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReconciliationStatusFilter<$PrismaModel>
    _max?: NestedEnumReconciliationStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type StudentCreateWithoutUserInput = {
    id?: string
    studentCode: string
    firstName: string
    lastName: string
    program: string
    classLevel?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    phone?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutUserInput = {
    id?: string
    studentCode: string
    firstName: string
    lastName: string
    program: string
    classLevel?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    phone?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutUserInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
  }

  export type PaymentCreateWithoutVerifierInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    student: StudentCreateNestedOneWithoutPaymentsInput
    reconciler?: UserCreateNestedOneWithoutReconciledPaymentsInput
    reviewer?: UserCreateNestedOneWithoutReviewedPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutVerifierInput = {
    id?: string
    studentId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    reconciledBy?: string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewerId?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
  }

  export type PaymentCreateOrConnectWithoutVerifierInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutVerifierInput, PaymentUncheckedCreateWithoutVerifierInput>
  }

  export type PaymentCreateManyVerifierInputEnvelope = {
    data: PaymentCreateManyVerifierInput | PaymentCreateManyVerifierInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutReviewerInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    student: StudentCreateNestedOneWithoutPaymentsInput
    reconciler?: UserCreateNestedOneWithoutReconciledPaymentsInput
    verifier?: UserCreateNestedOneWithoutVerifiedPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutReviewerInput = {
    id?: string
    studentId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    reconciledBy?: string | null
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
  }

  export type PaymentCreateOrConnectWithoutReviewerInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutReviewerInput, PaymentUncheckedCreateWithoutReviewerInput>
  }

  export type PaymentCreateManyReviewerInputEnvelope = {
    data: PaymentCreateManyReviewerInput | PaymentCreateManyReviewerInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutReconcilerInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    student: StudentCreateNestedOneWithoutPaymentsInput
    verifier?: UserCreateNestedOneWithoutVerifiedPaymentsInput
    reviewer?: UserCreateNestedOneWithoutReviewedPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutReconcilerInput = {
    id?: string
    studentId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewerId?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
  }

  export type PaymentCreateOrConnectWithoutReconcilerInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutReconcilerInput, PaymentUncheckedCreateWithoutReconcilerInput>
  }

  export type PaymentCreateManyReconcilerInputEnvelope = {
    data: PaymentCreateManyReconcilerInput | PaymentCreateManyReconcilerInput[]
    skipDuplicates?: boolean
  }

  export type GeneratedReportCreateWithoutUserInput = {
    id?: string
    title: string
    reportType: string
    filters: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GeneratedReportUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    reportType: string
    filters: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type GeneratedReportCreateOrConnectWithoutUserInput = {
    where: GeneratedReportWhereUniqueInput
    create: XOR<GeneratedReportCreateWithoutUserInput, GeneratedReportUncheckedCreateWithoutUserInput>
  }

  export type GeneratedReportCreateManyUserInputEnvelope = {
    data: GeneratedReportCreateManyUserInput | GeneratedReportCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    title: string
    message: string
    type: string
    read?: boolean
    createdAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    message: string
    type: string
    read?: boolean
    createdAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type StudentUpsertWithoutUserInput = {
    update: XOR<StudentUpdateWithoutUserInput, StudentUncheckedUpdateWithoutUserInput>
    create: XOR<StudentCreateWithoutUserInput, StudentUncheckedCreateWithoutUserInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutUserInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutUserInput, StudentUncheckedUpdateWithoutUserInput>
  }

  export type StudentUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentCode?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    program?: StringFieldUpdateOperationsInput | string
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentCode?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    program?: StringFieldUpdateOperationsInput | string
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type PaymentUpsertWithWhereUniqueWithoutVerifierInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutVerifierInput, PaymentUncheckedUpdateWithoutVerifierInput>
    create: XOR<PaymentCreateWithoutVerifierInput, PaymentUncheckedCreateWithoutVerifierInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutVerifierInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutVerifierInput, PaymentUncheckedUpdateWithoutVerifierInput>
  }

  export type PaymentUpdateManyWithWhereWithoutVerifierInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutVerifierInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: StringFilter<"Payment"> | string
    studentId?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"Payment"> | string
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    externalReference?: StringNullableFilter<"Payment"> | string | null
    receiptNumber?: StringNullableFilter<"Payment"> | string | null
    proofUrl?: StringFilter<"Payment"> | string
    payerName?: StringNullableFilter<"Payment"> | string | null
    paymentDate?: DateTimeFilter<"Payment"> | Date | string
    submittedAt?: DateTimeFilter<"Payment"> | Date | string
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFilter<"Payment"> | $Enums.VerificationStatus
    duplicateFlag?: BoolFilter<"Payment"> | boolean
    ocrText?: StringNullableFilter<"Payment"> | string | null
    ocrAmount?: DecimalNullableFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    ocrReference?: StringNullableFilter<"Payment"> | string | null
    notes?: StringNullableFilter<"Payment"> | string | null
    verificationNotes?: StringNullableFilter<"Payment"> | string | null
    reviewNotes?: StringNullableFilter<"Payment"> | string | null
    reconciliationStatus?: EnumReconciliationStatusFilter<"Payment"> | $Enums.ReconciliationStatus
    reconciliationNote?: StringNullableFilter<"Payment"> | string | null
    reconciledAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reconciledBy?: StringNullableFilter<"Payment"> | string | null
    verifiedBy?: StringNullableFilter<"Payment"> | string | null
    verifiedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reviewedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    reviewerId?: StringNullableFilter<"Payment"> | string | null
    academicYear?: StringNullableFilter<"Payment"> | string | null
    term?: StringNullableFilter<"Payment"> | string | null
    semester?: StringNullableFilter<"Payment"> | string | null
  }

  export type PaymentUpsertWithWhereUniqueWithoutReviewerInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutReviewerInput, PaymentUncheckedUpdateWithoutReviewerInput>
    create: XOR<PaymentCreateWithoutReviewerInput, PaymentUncheckedCreateWithoutReviewerInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutReviewerInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutReviewerInput, PaymentUncheckedUpdateWithoutReviewerInput>
  }

  export type PaymentUpdateManyWithWhereWithoutReviewerInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutReviewerInput>
  }

  export type PaymentUpsertWithWhereUniqueWithoutReconcilerInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutReconcilerInput, PaymentUncheckedUpdateWithoutReconcilerInput>
    create: XOR<PaymentCreateWithoutReconcilerInput, PaymentUncheckedCreateWithoutReconcilerInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutReconcilerInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutReconcilerInput, PaymentUncheckedUpdateWithoutReconcilerInput>
  }

  export type PaymentUpdateManyWithWhereWithoutReconcilerInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutReconcilerInput>
  }

  export type GeneratedReportUpsertWithWhereUniqueWithoutUserInput = {
    where: GeneratedReportWhereUniqueInput
    update: XOR<GeneratedReportUpdateWithoutUserInput, GeneratedReportUncheckedUpdateWithoutUserInput>
    create: XOR<GeneratedReportCreateWithoutUserInput, GeneratedReportUncheckedCreateWithoutUserInput>
  }

  export type GeneratedReportUpdateWithWhereUniqueWithoutUserInput = {
    where: GeneratedReportWhereUniqueInput
    data: XOR<GeneratedReportUpdateWithoutUserInput, GeneratedReportUncheckedUpdateWithoutUserInput>
  }

  export type GeneratedReportUpdateManyWithWhereWithoutUserInput = {
    where: GeneratedReportScalarWhereInput
    data: XOR<GeneratedReportUpdateManyMutationInput, GeneratedReportUncheckedUpdateManyWithoutUserInput>
  }

  export type GeneratedReportScalarWhereInput = {
    AND?: GeneratedReportScalarWhereInput | GeneratedReportScalarWhereInput[]
    OR?: GeneratedReportScalarWhereInput[]
    NOT?: GeneratedReportScalarWhereInput | GeneratedReportScalarWhereInput[]
    id?: StringFilter<"GeneratedReport"> | string
    title?: StringFilter<"GeneratedReport"> | string
    reportType?: StringFilter<"GeneratedReport"> | string
    filters?: JsonFilter<"GeneratedReport">
    data?: JsonNullableFilter<"GeneratedReport">
    generatedBy?: StringFilter<"GeneratedReport"> | string
    createdAt?: DateTimeFilter<"GeneratedReport"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    read?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type UserCreateWithoutStudentInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    verifiedPayments?: PaymentCreateNestedManyWithoutVerifierInput
    reviewedPayments?: PaymentCreateNestedManyWithoutReviewerInput
    reconciledPayments?: PaymentCreateNestedManyWithoutReconcilerInput
    generatedReports?: GeneratedReportCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutStudentInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    verifiedPayments?: PaymentUncheckedCreateNestedManyWithoutVerifierInput
    reviewedPayments?: PaymentUncheckedCreateNestedManyWithoutReviewerInput
    reconciledPayments?: PaymentUncheckedCreateNestedManyWithoutReconcilerInput
    generatedReports?: GeneratedReportUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutStudentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStudentInput, UserUncheckedCreateWithoutStudentInput>
  }

  export type PaymentCreateWithoutStudentInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    reconciler?: UserCreateNestedOneWithoutReconciledPaymentsInput
    verifier?: UserCreateNestedOneWithoutVerifiedPaymentsInput
    reviewer?: UserCreateNestedOneWithoutReviewedPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutStudentInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    reconciledBy?: string | null
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewerId?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
  }

  export type PaymentCreateOrConnectWithoutStudentInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutStudentInput, PaymentUncheckedCreateWithoutStudentInput>
  }

  export type PaymentCreateManyStudentInputEnvelope = {
    data: PaymentCreateManyStudentInput | PaymentCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutStudentInput = {
    update: XOR<UserUpdateWithoutStudentInput, UserUncheckedUpdateWithoutStudentInput>
    create: XOR<UserCreateWithoutStudentInput, UserUncheckedCreateWithoutStudentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStudentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStudentInput, UserUncheckedUpdateWithoutStudentInput>
  }

  export type UserUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedPayments?: PaymentUpdateManyWithoutVerifierNestedInput
    reviewedPayments?: PaymentUpdateManyWithoutReviewerNestedInput
    reconciledPayments?: PaymentUpdateManyWithoutReconcilerNestedInput
    generatedReports?: GeneratedReportUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    verifiedPayments?: PaymentUncheckedUpdateManyWithoutVerifierNestedInput
    reviewedPayments?: PaymentUncheckedUpdateManyWithoutReviewerNestedInput
    reconciledPayments?: PaymentUncheckedUpdateManyWithoutReconcilerNestedInput
    generatedReports?: GeneratedReportUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PaymentUpsertWithWhereUniqueWithoutStudentInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutStudentInput, PaymentUncheckedUpdateWithoutStudentInput>
    create: XOR<PaymentCreateWithoutStudentInput, PaymentUncheckedCreateWithoutStudentInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutStudentInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutStudentInput, PaymentUncheckedUpdateWithoutStudentInput>
  }

  export type PaymentUpdateManyWithWhereWithoutStudentInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutStudentInput>
  }

  export type StudentCreateWithoutPaymentsInput = {
    id?: string
    studentCode: string
    firstName: string
    lastName: string
    program: string
    classLevel?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    phone?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutPaymentsInput = {
    id?: string
    userId: string
    studentCode: string
    firstName: string
    lastName: string
    program: string
    classLevel?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
    phone?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StudentCreateOrConnectWithoutPaymentsInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutPaymentsInput, StudentUncheckedCreateWithoutPaymentsInput>
  }

  export type UserCreateWithoutReconciledPaymentsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentCreateNestedOneWithoutUserInput
    verifiedPayments?: PaymentCreateNestedManyWithoutVerifierInput
    reviewedPayments?: PaymentCreateNestedManyWithoutReviewerInput
    generatedReports?: GeneratedReportCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReconciledPaymentsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    verifiedPayments?: PaymentUncheckedCreateNestedManyWithoutVerifierInput
    reviewedPayments?: PaymentUncheckedCreateNestedManyWithoutReviewerInput
    generatedReports?: GeneratedReportUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReconciledPaymentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReconciledPaymentsInput, UserUncheckedCreateWithoutReconciledPaymentsInput>
  }

  export type UserCreateWithoutVerifiedPaymentsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentCreateNestedOneWithoutUserInput
    reviewedPayments?: PaymentCreateNestedManyWithoutReviewerInput
    reconciledPayments?: PaymentCreateNestedManyWithoutReconcilerInput
    generatedReports?: GeneratedReportCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutVerifiedPaymentsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    reviewedPayments?: PaymentUncheckedCreateNestedManyWithoutReviewerInput
    reconciledPayments?: PaymentUncheckedCreateNestedManyWithoutReconcilerInput
    generatedReports?: GeneratedReportUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutVerifiedPaymentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutVerifiedPaymentsInput, UserUncheckedCreateWithoutVerifiedPaymentsInput>
  }

  export type UserCreateWithoutReviewedPaymentsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentCreateNestedOneWithoutUserInput
    verifiedPayments?: PaymentCreateNestedManyWithoutVerifierInput
    reconciledPayments?: PaymentCreateNestedManyWithoutReconcilerInput
    generatedReports?: GeneratedReportCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReviewedPaymentsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    verifiedPayments?: PaymentUncheckedCreateNestedManyWithoutVerifierInput
    reconciledPayments?: PaymentUncheckedCreateNestedManyWithoutReconcilerInput
    generatedReports?: GeneratedReportUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReviewedPaymentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReviewedPaymentsInput, UserUncheckedCreateWithoutReviewedPaymentsInput>
  }

  export type StudentUpsertWithoutPaymentsInput = {
    update: XOR<StudentUpdateWithoutPaymentsInput, StudentUncheckedUpdateWithoutPaymentsInput>
    create: XOR<StudentCreateWithoutPaymentsInput, StudentUncheckedCreateWithoutPaymentsInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutPaymentsInput, StudentUncheckedUpdateWithoutPaymentsInput>
  }

  export type StudentUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentCode?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    program?: StringFieldUpdateOperationsInput | string
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    studentCode?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    program?: StringFieldUpdateOperationsInput | string
    classLevel?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutReconciledPaymentsInput = {
    update: XOR<UserUpdateWithoutReconciledPaymentsInput, UserUncheckedUpdateWithoutReconciledPaymentsInput>
    create: XOR<UserCreateWithoutReconciledPaymentsInput, UserUncheckedCreateWithoutReconciledPaymentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReconciledPaymentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReconciledPaymentsInput, UserUncheckedUpdateWithoutReconciledPaymentsInput>
  }

  export type UserUpdateWithoutReconciledPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneWithoutUserNestedInput
    verifiedPayments?: PaymentUpdateManyWithoutVerifierNestedInput
    reviewedPayments?: PaymentUpdateManyWithoutReviewerNestedInput
    generatedReports?: GeneratedReportUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReconciledPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    verifiedPayments?: PaymentUncheckedUpdateManyWithoutVerifierNestedInput
    reviewedPayments?: PaymentUncheckedUpdateManyWithoutReviewerNestedInput
    generatedReports?: GeneratedReportUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutVerifiedPaymentsInput = {
    update: XOR<UserUpdateWithoutVerifiedPaymentsInput, UserUncheckedUpdateWithoutVerifiedPaymentsInput>
    create: XOR<UserCreateWithoutVerifiedPaymentsInput, UserUncheckedCreateWithoutVerifiedPaymentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutVerifiedPaymentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutVerifiedPaymentsInput, UserUncheckedUpdateWithoutVerifiedPaymentsInput>
  }

  export type UserUpdateWithoutVerifiedPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneWithoutUserNestedInput
    reviewedPayments?: PaymentUpdateManyWithoutReviewerNestedInput
    reconciledPayments?: PaymentUpdateManyWithoutReconcilerNestedInput
    generatedReports?: GeneratedReportUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutVerifiedPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    reviewedPayments?: PaymentUncheckedUpdateManyWithoutReviewerNestedInput
    reconciledPayments?: PaymentUncheckedUpdateManyWithoutReconcilerNestedInput
    generatedReports?: GeneratedReportUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutReviewedPaymentsInput = {
    update: XOR<UserUpdateWithoutReviewedPaymentsInput, UserUncheckedUpdateWithoutReviewedPaymentsInput>
    create: XOR<UserCreateWithoutReviewedPaymentsInput, UserUncheckedCreateWithoutReviewedPaymentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReviewedPaymentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReviewedPaymentsInput, UserUncheckedUpdateWithoutReviewedPaymentsInput>
  }

  export type UserUpdateWithoutReviewedPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneWithoutUserNestedInput
    verifiedPayments?: PaymentUpdateManyWithoutVerifierNestedInput
    reconciledPayments?: PaymentUpdateManyWithoutReconcilerNestedInput
    generatedReports?: GeneratedReportUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReviewedPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    verifiedPayments?: PaymentUncheckedUpdateManyWithoutVerifierNestedInput
    reconciledPayments?: PaymentUncheckedUpdateManyWithoutReconcilerNestedInput
    generatedReports?: GeneratedReportUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutGeneratedReportsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentCreateNestedOneWithoutUserInput
    verifiedPayments?: PaymentCreateNestedManyWithoutVerifierInput
    reviewedPayments?: PaymentCreateNestedManyWithoutReviewerInput
    reconciledPayments?: PaymentCreateNestedManyWithoutReconcilerInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGeneratedReportsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    verifiedPayments?: PaymentUncheckedCreateNestedManyWithoutVerifierInput
    reviewedPayments?: PaymentUncheckedCreateNestedManyWithoutReviewerInput
    reconciledPayments?: PaymentUncheckedCreateNestedManyWithoutReconcilerInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGeneratedReportsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGeneratedReportsInput, UserUncheckedCreateWithoutGeneratedReportsInput>
  }

  export type UserUpsertWithoutGeneratedReportsInput = {
    update: XOR<UserUpdateWithoutGeneratedReportsInput, UserUncheckedUpdateWithoutGeneratedReportsInput>
    create: XOR<UserCreateWithoutGeneratedReportsInput, UserUncheckedCreateWithoutGeneratedReportsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGeneratedReportsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGeneratedReportsInput, UserUncheckedUpdateWithoutGeneratedReportsInput>
  }

  export type UserUpdateWithoutGeneratedReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneWithoutUserNestedInput
    verifiedPayments?: PaymentUpdateManyWithoutVerifierNestedInput
    reviewedPayments?: PaymentUpdateManyWithoutReviewerNestedInput
    reconciledPayments?: PaymentUpdateManyWithoutReconcilerNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGeneratedReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    verifiedPayments?: PaymentUncheckedUpdateManyWithoutVerifierNestedInput
    reviewedPayments?: PaymentUncheckedUpdateManyWithoutReviewerNestedInput
    reconciledPayments?: PaymentUncheckedUpdateManyWithoutReconcilerNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentCreateNestedOneWithoutUserInput
    verifiedPayments?: PaymentCreateNestedManyWithoutVerifierInput
    reviewedPayments?: PaymentCreateNestedManyWithoutReviewerInput
    reconciledPayments?: PaymentCreateNestedManyWithoutReconcilerInput
    generatedReports?: GeneratedReportCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    email: string
    passwordHash: string
    firstName?: string | null
    lastName?: string | null
    role?: $Enums.UserRole
    status?: $Enums.UserStatus
    profilePictureUrl?: string | null
    currentSessionId?: string | null
    sessionExpires?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    student?: StudentUncheckedCreateNestedOneWithoutUserInput
    verifiedPayments?: PaymentUncheckedCreateNestedManyWithoutVerifierInput
    reviewedPayments?: PaymentUncheckedCreateNestedManyWithoutReviewerInput
    reconciledPayments?: PaymentUncheckedCreateNestedManyWithoutReconcilerInput
    generatedReports?: GeneratedReportUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneWithoutUserNestedInput
    verifiedPayments?: PaymentUpdateManyWithoutVerifierNestedInput
    reviewedPayments?: PaymentUpdateManyWithoutReviewerNestedInput
    reconciledPayments?: PaymentUpdateManyWithoutReconcilerNestedInput
    generatedReports?: GeneratedReportUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    profilePictureUrl?: NullableStringFieldUpdateOperationsInput | string | null
    currentSessionId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUncheckedUpdateOneWithoutUserNestedInput
    verifiedPayments?: PaymentUncheckedUpdateManyWithoutVerifierNestedInput
    reviewedPayments?: PaymentUncheckedUpdateManyWithoutReviewerNestedInput
    reconciledPayments?: PaymentUncheckedUpdateManyWithoutReconcilerNestedInput
    generatedReports?: GeneratedReportUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PaymentCreateManyVerifierInput = {
    id?: string
    studentId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    reconciledBy?: string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewerId?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
  }

  export type PaymentCreateManyReviewerInput = {
    id?: string
    studentId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    reconciledBy?: string | null
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
  }

  export type PaymentCreateManyReconcilerInput = {
    id?: string
    studentId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewerId?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
  }

  export type GeneratedReportCreateManyUserInput = {
    id?: string
    title: string
    reportType: string
    filters: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    title: string
    message: string
    type: string
    read?: boolean
    createdAt?: Date | string
  }

  export type PaymentUpdateWithoutVerifierInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    student?: StudentUpdateOneRequiredWithoutPaymentsNestedInput
    reconciler?: UserUpdateOneWithoutReconciledPaymentsNestedInput
    reviewer?: UserUpdateOneWithoutReviewedPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutVerifierInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reconciledBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUncheckedUpdateManyWithoutVerifierInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reconciledBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    student?: StudentUpdateOneRequiredWithoutPaymentsNestedInput
    reconciler?: UserUpdateOneWithoutReconciledPaymentsNestedInput
    verifier?: UserUpdateOneWithoutVerifiedPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reconciledBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUncheckedUpdateManyWithoutReviewerInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reconciledBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUpdateWithoutReconcilerInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    student?: StudentUpdateOneRequiredWithoutPaymentsNestedInput
    verifier?: UserUpdateOneWithoutVerifiedPaymentsNestedInput
    reviewer?: UserUpdateOneWithoutReviewedPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutReconcilerInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUncheckedUpdateManyWithoutReconcilerInput = {
    id?: StringFieldUpdateOperationsInput | string
    studentId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GeneratedReportUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    filters?: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneratedReportUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    filters?: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GeneratedReportUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    reportType?: StringFieldUpdateOperationsInput | string
    filters?: JsonNullValueInput | InputJsonValue
    data?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    read?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyStudentInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    method: $Enums.PaymentMethod
    externalReference?: string | null
    receiptNumber?: string | null
    proofUrl: string
    payerName?: string | null
    paymentDate: Date | string
    submittedAt?: Date | string
    status?: $Enums.PaymentStatus
    verificationStatus?: $Enums.VerificationStatus
    duplicateFlag?: boolean
    ocrText?: string | null
    ocrAmount?: Decimal | DecimalJsLike | number | string | null
    ocrReference?: string | null
    notes?: string | null
    verificationNotes?: string | null
    reviewNotes?: string | null
    reconciliationStatus?: $Enums.ReconciliationStatus
    reconciliationNote?: string | null
    reconciledAt?: Date | string | null
    reconciledBy?: string | null
    verifiedBy?: string | null
    verifiedAt?: Date | string | null
    reviewedAt?: Date | string | null
    reviewerId?: string | null
    academicYear?: string | null
    term?: string | null
    semester?: string | null
  }

  export type PaymentUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
    reconciler?: UserUpdateOneWithoutReconciledPaymentsNestedInput
    verifier?: UserUpdateOneWithoutVerifiedPaymentsNestedInput
    reviewer?: UserUpdateOneWithoutReviewedPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reconciledBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUncheckedUpdateManyWithoutStudentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    externalReference?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNumber?: NullableStringFieldUpdateOperationsInput | string | null
    proofUrl?: StringFieldUpdateOperationsInput | string
    payerName?: NullableStringFieldUpdateOperationsInput | string | null
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    submittedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    verificationStatus?: EnumVerificationStatusFieldUpdateOperationsInput | $Enums.VerificationStatus
    duplicateFlag?: BoolFieldUpdateOperationsInput | boolean
    ocrText?: NullableStringFieldUpdateOperationsInput | string | null
    ocrAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ocrReference?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    verificationNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reviewNotes?: NullableStringFieldUpdateOperationsInput | string | null
    reconciliationStatus?: EnumReconciliationStatusFieldUpdateOperationsInput | $Enums.ReconciliationStatus
    reconciliationNote?: NullableStringFieldUpdateOperationsInput | string | null
    reconciledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reconciledBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedBy?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewerId?: NullableStringFieldUpdateOperationsInput | string | null
    academicYear?: NullableStringFieldUpdateOperationsInput | string | null
    term?: NullableStringFieldUpdateOperationsInput | string | null
    semester?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}