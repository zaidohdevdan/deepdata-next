
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
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
/**
 * Model ConfiguracaoGlobal
 * 
 */
export type ConfiguracaoGlobal = $Result.DefaultSelection<Prisma.$ConfiguracaoGlobalPayload>
/**
 * Model Ala
 * 
 */
export type Ala = $Result.DefaultSelection<Prisma.$AlaPayload>
/**
 * Model DistribAla
 * 
 */
export type DistribAla = $Result.DefaultSelection<Prisma.$DistribAlaPayload>
/**
 * Model Ocorrencia
 * 
 */
export type Ocorrencia = $Result.DefaultSelection<Prisma.$OcorrenciaPayload>
/**
 * Model OcorrenciaCategoria
 * 
 */
export type OcorrenciaCategoria = $Result.DefaultSelection<Prisma.$OcorrenciaCategoriaPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Modulo: {
  ALIMENTACAO: 'ALIMENTACAO',
  CAFE: 'CAFE',
  BISCOITO: 'BISCOITO'
};

export type Modulo = (typeof Modulo)[keyof typeof Modulo]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Modulo = $Enums.Modulo

export const Modulo: typeof $Enums.Modulo

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
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.configuracaoGlobal`: Exposes CRUD operations for the **ConfiguracaoGlobal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConfiguracaoGlobals
    * const configuracaoGlobals = await prisma.configuracaoGlobal.findMany()
    * ```
    */
  get configuracaoGlobal(): Prisma.ConfiguracaoGlobalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ala`: Exposes CRUD operations for the **Ala** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Alas
    * const alas = await prisma.ala.findMany()
    * ```
    */
  get ala(): Prisma.AlaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.distribAla`: Exposes CRUD operations for the **DistribAla** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DistribAlas
    * const distribAlas = await prisma.distribAla.findMany()
    * ```
    */
  get distribAla(): Prisma.DistribAlaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ocorrencia`: Exposes CRUD operations for the **Ocorrencia** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Ocorrencias
    * const ocorrencias = await prisma.ocorrencia.findMany()
    * ```
    */
  get ocorrencia(): Prisma.OcorrenciaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ocorrenciaCategoria`: Exposes CRUD operations for the **OcorrenciaCategoria** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OcorrenciaCategorias
    * const ocorrenciaCategorias = await prisma.ocorrenciaCategoria.findMany()
    * ```
    */
  get ocorrenciaCategoria(): Prisma.OcorrenciaCategoriaDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.19.3
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
    Account: 'Account',
    Session: 'Session',
    VerificationToken: 'VerificationToken',
    ConfiguracaoGlobal: 'ConfiguracaoGlobal',
    Ala: 'Ala',
    DistribAla: 'DistribAla',
    Ocorrencia: 'Ocorrencia',
    OcorrenciaCategoria: 'OcorrenciaCategoria'
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
      modelProps: "user" | "account" | "session" | "verificationToken" | "configuracaoGlobal" | "ala" | "distribAla" | "ocorrencia" | "ocorrenciaCategoria"
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
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      ConfiguracaoGlobal: {
        payload: Prisma.$ConfiguracaoGlobalPayload<ExtArgs>
        fields: Prisma.ConfiguracaoGlobalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConfiguracaoGlobalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConfiguracaoGlobalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload>
          }
          findFirst: {
            args: Prisma.ConfiguracaoGlobalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConfiguracaoGlobalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload>
          }
          findMany: {
            args: Prisma.ConfiguracaoGlobalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload>[]
          }
          create: {
            args: Prisma.ConfiguracaoGlobalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload>
          }
          createMany: {
            args: Prisma.ConfiguracaoGlobalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConfiguracaoGlobalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload>[]
          }
          delete: {
            args: Prisma.ConfiguracaoGlobalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload>
          }
          update: {
            args: Prisma.ConfiguracaoGlobalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload>
          }
          deleteMany: {
            args: Prisma.ConfiguracaoGlobalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConfiguracaoGlobalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConfiguracaoGlobalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload>[]
          }
          upsert: {
            args: Prisma.ConfiguracaoGlobalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfiguracaoGlobalPayload>
          }
          aggregate: {
            args: Prisma.ConfiguracaoGlobalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConfiguracaoGlobal>
          }
          groupBy: {
            args: Prisma.ConfiguracaoGlobalGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConfiguracaoGlobalGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConfiguracaoGlobalCountArgs<ExtArgs>
            result: $Utils.Optional<ConfiguracaoGlobalCountAggregateOutputType> | number
          }
        }
      }
      Ala: {
        payload: Prisma.$AlaPayload<ExtArgs>
        fields: Prisma.AlaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload>
          }
          findFirst: {
            args: Prisma.AlaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload>
          }
          findMany: {
            args: Prisma.AlaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload>[]
          }
          create: {
            args: Prisma.AlaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload>
          }
          createMany: {
            args: Prisma.AlaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload>[]
          }
          delete: {
            args: Prisma.AlaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload>
          }
          update: {
            args: Prisma.AlaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload>
          }
          deleteMany: {
            args: Prisma.AlaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AlaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload>[]
          }
          upsert: {
            args: Prisma.AlaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlaPayload>
          }
          aggregate: {
            args: Prisma.AlaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAla>
          }
          groupBy: {
            args: Prisma.AlaGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlaGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlaCountArgs<ExtArgs>
            result: $Utils.Optional<AlaCountAggregateOutputType> | number
          }
        }
      }
      DistribAla: {
        payload: Prisma.$DistribAlaPayload<ExtArgs>
        fields: Prisma.DistribAlaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DistribAlaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DistribAlaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload>
          }
          findFirst: {
            args: Prisma.DistribAlaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DistribAlaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload>
          }
          findMany: {
            args: Prisma.DistribAlaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload>[]
          }
          create: {
            args: Prisma.DistribAlaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload>
          }
          createMany: {
            args: Prisma.DistribAlaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DistribAlaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload>[]
          }
          delete: {
            args: Prisma.DistribAlaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload>
          }
          update: {
            args: Prisma.DistribAlaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload>
          }
          deleteMany: {
            args: Prisma.DistribAlaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DistribAlaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DistribAlaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload>[]
          }
          upsert: {
            args: Prisma.DistribAlaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DistribAlaPayload>
          }
          aggregate: {
            args: Prisma.DistribAlaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDistribAla>
          }
          groupBy: {
            args: Prisma.DistribAlaGroupByArgs<ExtArgs>
            result: $Utils.Optional<DistribAlaGroupByOutputType>[]
          }
          count: {
            args: Prisma.DistribAlaCountArgs<ExtArgs>
            result: $Utils.Optional<DistribAlaCountAggregateOutputType> | number
          }
        }
      }
      Ocorrencia: {
        payload: Prisma.$OcorrenciaPayload<ExtArgs>
        fields: Prisma.OcorrenciaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OcorrenciaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OcorrenciaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload>
          }
          findFirst: {
            args: Prisma.OcorrenciaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OcorrenciaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload>
          }
          findMany: {
            args: Prisma.OcorrenciaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload>[]
          }
          create: {
            args: Prisma.OcorrenciaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload>
          }
          createMany: {
            args: Prisma.OcorrenciaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OcorrenciaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload>[]
          }
          delete: {
            args: Prisma.OcorrenciaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload>
          }
          update: {
            args: Prisma.OcorrenciaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload>
          }
          deleteMany: {
            args: Prisma.OcorrenciaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OcorrenciaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OcorrenciaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload>[]
          }
          upsert: {
            args: Prisma.OcorrenciaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaPayload>
          }
          aggregate: {
            args: Prisma.OcorrenciaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOcorrencia>
          }
          groupBy: {
            args: Prisma.OcorrenciaGroupByArgs<ExtArgs>
            result: $Utils.Optional<OcorrenciaGroupByOutputType>[]
          }
          count: {
            args: Prisma.OcorrenciaCountArgs<ExtArgs>
            result: $Utils.Optional<OcorrenciaCountAggregateOutputType> | number
          }
        }
      }
      OcorrenciaCategoria: {
        payload: Prisma.$OcorrenciaCategoriaPayload<ExtArgs>
        fields: Prisma.OcorrenciaCategoriaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OcorrenciaCategoriaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OcorrenciaCategoriaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload>
          }
          findFirst: {
            args: Prisma.OcorrenciaCategoriaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OcorrenciaCategoriaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload>
          }
          findMany: {
            args: Prisma.OcorrenciaCategoriaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload>[]
          }
          create: {
            args: Prisma.OcorrenciaCategoriaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload>
          }
          createMany: {
            args: Prisma.OcorrenciaCategoriaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OcorrenciaCategoriaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload>[]
          }
          delete: {
            args: Prisma.OcorrenciaCategoriaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload>
          }
          update: {
            args: Prisma.OcorrenciaCategoriaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload>
          }
          deleteMany: {
            args: Prisma.OcorrenciaCategoriaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OcorrenciaCategoriaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OcorrenciaCategoriaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload>[]
          }
          upsert: {
            args: Prisma.OcorrenciaCategoriaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OcorrenciaCategoriaPayload>
          }
          aggregate: {
            args: Prisma.OcorrenciaCategoriaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOcorrenciaCategoria>
          }
          groupBy: {
            args: Prisma.OcorrenciaCategoriaGroupByArgs<ExtArgs>
            result: $Utils.Optional<OcorrenciaCategoriaGroupByOutputType>[]
          }
          count: {
            args: Prisma.OcorrenciaCategoriaCountArgs<ExtArgs>
            result: $Utils.Optional<OcorrenciaCategoriaCountAggregateOutputType> | number
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
    account?: AccountOmit
    session?: SessionOmit
    verificationToken?: VerificationTokenOmit
    configuracaoGlobal?: ConfiguracaoGlobalOmit
    ala?: AlaOmit
    distribAla?: DistribAlaOmit
    ocorrencia?: OcorrenciaOmit
    ocorrenciaCategoria?: OcorrenciaCategoriaOmit
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
    accounts: number
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
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
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Count Type AlaCountOutputType
   */

  export type AlaCountOutputType = {
    distribs: number
  }

  export type AlaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    distribs?: boolean | AlaCountOutputTypeCountDistribsArgs
  }

  // Custom InputTypes
  /**
   * AlaCountOutputType without action
   */
  export type AlaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlaCountOutputType
     */
    select?: AlaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AlaCountOutputType without action
   */
  export type AlaCountOutputTypeCountDistribsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DistribAlaWhereInput
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
    username: string | null
    passwordHash: string | null
    name: string | null
    role: $Enums.Role | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    passwordHash: string | null
    name: string | null
    role: $Enums.Role | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    passwordHash: number
    name: number
    role: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    name?: true
    role?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    name?: true
    role?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    passwordHash?: true
    name?: true
    role?: true
    active?: true
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
    username: string
    passwordHash: string
    name: string
    role: $Enums.Role
    active: boolean
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
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "passwordHash" | "name" | "role" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      passwordHash: string
      name: string
      role: $Enums.Role
      active: boolean
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
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly username: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly active: FieldRef<"User", 'Boolean'>
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
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
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
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
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
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
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
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
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
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
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
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type VerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>

  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens and returns the data updated in the database.
     * @param {VerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many VerificationTokens.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.updateManyAndReturn({
     *   select: { identifier: true },
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
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
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
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the VerificationToken model
   */
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken updateManyAndReturn
   */
  export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Model ConfiguracaoGlobal
   */

  export type AggregateConfiguracaoGlobal = {
    _count: ConfiguracaoGlobalCountAggregateOutputType | null
    _min: ConfiguracaoGlobalMinAggregateOutputType | null
    _max: ConfiguracaoGlobalMaxAggregateOutputType | null
  }

  export type ConfiguracaoGlobalMinAggregateOutputType = {
    id: string | null
    chave: string | null
    valor: string | null
    descricao: string | null
    updatedAt: Date | null
  }

  export type ConfiguracaoGlobalMaxAggregateOutputType = {
    id: string | null
    chave: string | null
    valor: string | null
    descricao: string | null
    updatedAt: Date | null
  }

  export type ConfiguracaoGlobalCountAggregateOutputType = {
    id: number
    chave: number
    valor: number
    descricao: number
    updatedAt: number
    _all: number
  }


  export type ConfiguracaoGlobalMinAggregateInputType = {
    id?: true
    chave?: true
    valor?: true
    descricao?: true
    updatedAt?: true
  }

  export type ConfiguracaoGlobalMaxAggregateInputType = {
    id?: true
    chave?: true
    valor?: true
    descricao?: true
    updatedAt?: true
  }

  export type ConfiguracaoGlobalCountAggregateInputType = {
    id?: true
    chave?: true
    valor?: true
    descricao?: true
    updatedAt?: true
    _all?: true
  }

  export type ConfiguracaoGlobalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfiguracaoGlobal to aggregate.
     */
    where?: ConfiguracaoGlobalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracaoGlobals to fetch.
     */
    orderBy?: ConfiguracaoGlobalOrderByWithRelationInput | ConfiguracaoGlobalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConfiguracaoGlobalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracaoGlobals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracaoGlobals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConfiguracaoGlobals
    **/
    _count?: true | ConfiguracaoGlobalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConfiguracaoGlobalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConfiguracaoGlobalMaxAggregateInputType
  }

  export type GetConfiguracaoGlobalAggregateType<T extends ConfiguracaoGlobalAggregateArgs> = {
        [P in keyof T & keyof AggregateConfiguracaoGlobal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConfiguracaoGlobal[P]>
      : GetScalarType<T[P], AggregateConfiguracaoGlobal[P]>
  }




  export type ConfiguracaoGlobalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfiguracaoGlobalWhereInput
    orderBy?: ConfiguracaoGlobalOrderByWithAggregationInput | ConfiguracaoGlobalOrderByWithAggregationInput[]
    by: ConfiguracaoGlobalScalarFieldEnum[] | ConfiguracaoGlobalScalarFieldEnum
    having?: ConfiguracaoGlobalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConfiguracaoGlobalCountAggregateInputType | true
    _min?: ConfiguracaoGlobalMinAggregateInputType
    _max?: ConfiguracaoGlobalMaxAggregateInputType
  }

  export type ConfiguracaoGlobalGroupByOutputType = {
    id: string
    chave: string
    valor: string
    descricao: string | null
    updatedAt: Date
    _count: ConfiguracaoGlobalCountAggregateOutputType | null
    _min: ConfiguracaoGlobalMinAggregateOutputType | null
    _max: ConfiguracaoGlobalMaxAggregateOutputType | null
  }

  type GetConfiguracaoGlobalGroupByPayload<T extends ConfiguracaoGlobalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConfiguracaoGlobalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConfiguracaoGlobalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConfiguracaoGlobalGroupByOutputType[P]>
            : GetScalarType<T[P], ConfiguracaoGlobalGroupByOutputType[P]>
        }
      >
    >


  export type ConfiguracaoGlobalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["configuracaoGlobal"]>

  export type ConfiguracaoGlobalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["configuracaoGlobal"]>

  export type ConfiguracaoGlobalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["configuracaoGlobal"]>

  export type ConfiguracaoGlobalSelectScalar = {
    id?: boolean
    chave?: boolean
    valor?: boolean
    descricao?: boolean
    updatedAt?: boolean
  }

  export type ConfiguracaoGlobalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "chave" | "valor" | "descricao" | "updatedAt", ExtArgs["result"]["configuracaoGlobal"]>

  export type $ConfiguracaoGlobalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConfiguracaoGlobal"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      chave: string
      valor: string
      descricao: string | null
      updatedAt: Date
    }, ExtArgs["result"]["configuracaoGlobal"]>
    composites: {}
  }

  type ConfiguracaoGlobalGetPayload<S extends boolean | null | undefined | ConfiguracaoGlobalDefaultArgs> = $Result.GetResult<Prisma.$ConfiguracaoGlobalPayload, S>

  type ConfiguracaoGlobalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConfiguracaoGlobalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConfiguracaoGlobalCountAggregateInputType | true
    }

  export interface ConfiguracaoGlobalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConfiguracaoGlobal'], meta: { name: 'ConfiguracaoGlobal' } }
    /**
     * Find zero or one ConfiguracaoGlobal that matches the filter.
     * @param {ConfiguracaoGlobalFindUniqueArgs} args - Arguments to find a ConfiguracaoGlobal
     * @example
     * // Get one ConfiguracaoGlobal
     * const configuracaoGlobal = await prisma.configuracaoGlobal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConfiguracaoGlobalFindUniqueArgs>(args: SelectSubset<T, ConfiguracaoGlobalFindUniqueArgs<ExtArgs>>): Prisma__ConfiguracaoGlobalClient<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConfiguracaoGlobal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConfiguracaoGlobalFindUniqueOrThrowArgs} args - Arguments to find a ConfiguracaoGlobal
     * @example
     * // Get one ConfiguracaoGlobal
     * const configuracaoGlobal = await prisma.configuracaoGlobal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConfiguracaoGlobalFindUniqueOrThrowArgs>(args: SelectSubset<T, ConfiguracaoGlobalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConfiguracaoGlobalClient<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConfiguracaoGlobal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoGlobalFindFirstArgs} args - Arguments to find a ConfiguracaoGlobal
     * @example
     * // Get one ConfiguracaoGlobal
     * const configuracaoGlobal = await prisma.configuracaoGlobal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConfiguracaoGlobalFindFirstArgs>(args?: SelectSubset<T, ConfiguracaoGlobalFindFirstArgs<ExtArgs>>): Prisma__ConfiguracaoGlobalClient<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConfiguracaoGlobal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoGlobalFindFirstOrThrowArgs} args - Arguments to find a ConfiguracaoGlobal
     * @example
     * // Get one ConfiguracaoGlobal
     * const configuracaoGlobal = await prisma.configuracaoGlobal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConfiguracaoGlobalFindFirstOrThrowArgs>(args?: SelectSubset<T, ConfiguracaoGlobalFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConfiguracaoGlobalClient<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConfiguracaoGlobals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoGlobalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConfiguracaoGlobals
     * const configuracaoGlobals = await prisma.configuracaoGlobal.findMany()
     * 
     * // Get first 10 ConfiguracaoGlobals
     * const configuracaoGlobals = await prisma.configuracaoGlobal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const configuracaoGlobalWithIdOnly = await prisma.configuracaoGlobal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConfiguracaoGlobalFindManyArgs>(args?: SelectSubset<T, ConfiguracaoGlobalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConfiguracaoGlobal.
     * @param {ConfiguracaoGlobalCreateArgs} args - Arguments to create a ConfiguracaoGlobal.
     * @example
     * // Create one ConfiguracaoGlobal
     * const ConfiguracaoGlobal = await prisma.configuracaoGlobal.create({
     *   data: {
     *     // ... data to create a ConfiguracaoGlobal
     *   }
     * })
     * 
     */
    create<T extends ConfiguracaoGlobalCreateArgs>(args: SelectSubset<T, ConfiguracaoGlobalCreateArgs<ExtArgs>>): Prisma__ConfiguracaoGlobalClient<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConfiguracaoGlobals.
     * @param {ConfiguracaoGlobalCreateManyArgs} args - Arguments to create many ConfiguracaoGlobals.
     * @example
     * // Create many ConfiguracaoGlobals
     * const configuracaoGlobal = await prisma.configuracaoGlobal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConfiguracaoGlobalCreateManyArgs>(args?: SelectSubset<T, ConfiguracaoGlobalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConfiguracaoGlobals and returns the data saved in the database.
     * @param {ConfiguracaoGlobalCreateManyAndReturnArgs} args - Arguments to create many ConfiguracaoGlobals.
     * @example
     * // Create many ConfiguracaoGlobals
     * const configuracaoGlobal = await prisma.configuracaoGlobal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConfiguracaoGlobals and only return the `id`
     * const configuracaoGlobalWithIdOnly = await prisma.configuracaoGlobal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConfiguracaoGlobalCreateManyAndReturnArgs>(args?: SelectSubset<T, ConfiguracaoGlobalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConfiguracaoGlobal.
     * @param {ConfiguracaoGlobalDeleteArgs} args - Arguments to delete one ConfiguracaoGlobal.
     * @example
     * // Delete one ConfiguracaoGlobal
     * const ConfiguracaoGlobal = await prisma.configuracaoGlobal.delete({
     *   where: {
     *     // ... filter to delete one ConfiguracaoGlobal
     *   }
     * })
     * 
     */
    delete<T extends ConfiguracaoGlobalDeleteArgs>(args: SelectSubset<T, ConfiguracaoGlobalDeleteArgs<ExtArgs>>): Prisma__ConfiguracaoGlobalClient<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConfiguracaoGlobal.
     * @param {ConfiguracaoGlobalUpdateArgs} args - Arguments to update one ConfiguracaoGlobal.
     * @example
     * // Update one ConfiguracaoGlobal
     * const configuracaoGlobal = await prisma.configuracaoGlobal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConfiguracaoGlobalUpdateArgs>(args: SelectSubset<T, ConfiguracaoGlobalUpdateArgs<ExtArgs>>): Prisma__ConfiguracaoGlobalClient<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConfiguracaoGlobals.
     * @param {ConfiguracaoGlobalDeleteManyArgs} args - Arguments to filter ConfiguracaoGlobals to delete.
     * @example
     * // Delete a few ConfiguracaoGlobals
     * const { count } = await prisma.configuracaoGlobal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConfiguracaoGlobalDeleteManyArgs>(args?: SelectSubset<T, ConfiguracaoGlobalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfiguracaoGlobals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoGlobalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConfiguracaoGlobals
     * const configuracaoGlobal = await prisma.configuracaoGlobal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConfiguracaoGlobalUpdateManyArgs>(args: SelectSubset<T, ConfiguracaoGlobalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfiguracaoGlobals and returns the data updated in the database.
     * @param {ConfiguracaoGlobalUpdateManyAndReturnArgs} args - Arguments to update many ConfiguracaoGlobals.
     * @example
     * // Update many ConfiguracaoGlobals
     * const configuracaoGlobal = await prisma.configuracaoGlobal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConfiguracaoGlobals and only return the `id`
     * const configuracaoGlobalWithIdOnly = await prisma.configuracaoGlobal.updateManyAndReturn({
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
    updateManyAndReturn<T extends ConfiguracaoGlobalUpdateManyAndReturnArgs>(args: SelectSubset<T, ConfiguracaoGlobalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConfiguracaoGlobal.
     * @param {ConfiguracaoGlobalUpsertArgs} args - Arguments to update or create a ConfiguracaoGlobal.
     * @example
     * // Update or create a ConfiguracaoGlobal
     * const configuracaoGlobal = await prisma.configuracaoGlobal.upsert({
     *   create: {
     *     // ... data to create a ConfiguracaoGlobal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConfiguracaoGlobal we want to update
     *   }
     * })
     */
    upsert<T extends ConfiguracaoGlobalUpsertArgs>(args: SelectSubset<T, ConfiguracaoGlobalUpsertArgs<ExtArgs>>): Prisma__ConfiguracaoGlobalClient<$Result.GetResult<Prisma.$ConfiguracaoGlobalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConfiguracaoGlobals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoGlobalCountArgs} args - Arguments to filter ConfiguracaoGlobals to count.
     * @example
     * // Count the number of ConfiguracaoGlobals
     * const count = await prisma.configuracaoGlobal.count({
     *   where: {
     *     // ... the filter for the ConfiguracaoGlobals we want to count
     *   }
     * })
    **/
    count<T extends ConfiguracaoGlobalCountArgs>(
      args?: Subset<T, ConfiguracaoGlobalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConfiguracaoGlobalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConfiguracaoGlobal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoGlobalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ConfiguracaoGlobalAggregateArgs>(args: Subset<T, ConfiguracaoGlobalAggregateArgs>): Prisma.PrismaPromise<GetConfiguracaoGlobalAggregateType<T>>

    /**
     * Group by ConfiguracaoGlobal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfiguracaoGlobalGroupByArgs} args - Group by arguments.
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
      T extends ConfiguracaoGlobalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConfiguracaoGlobalGroupByArgs['orderBy'] }
        : { orderBy?: ConfiguracaoGlobalGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ConfiguracaoGlobalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConfiguracaoGlobalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConfiguracaoGlobal model
   */
  readonly fields: ConfiguracaoGlobalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConfiguracaoGlobal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConfiguracaoGlobalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ConfiguracaoGlobal model
   */
  interface ConfiguracaoGlobalFieldRefs {
    readonly id: FieldRef<"ConfiguracaoGlobal", 'String'>
    readonly chave: FieldRef<"ConfiguracaoGlobal", 'String'>
    readonly valor: FieldRef<"ConfiguracaoGlobal", 'String'>
    readonly descricao: FieldRef<"ConfiguracaoGlobal", 'String'>
    readonly updatedAt: FieldRef<"ConfiguracaoGlobal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConfiguracaoGlobal findUnique
   */
  export type ConfiguracaoGlobalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * Filter, which ConfiguracaoGlobal to fetch.
     */
    where: ConfiguracaoGlobalWhereUniqueInput
  }

  /**
   * ConfiguracaoGlobal findUniqueOrThrow
   */
  export type ConfiguracaoGlobalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * Filter, which ConfiguracaoGlobal to fetch.
     */
    where: ConfiguracaoGlobalWhereUniqueInput
  }

  /**
   * ConfiguracaoGlobal findFirst
   */
  export type ConfiguracaoGlobalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * Filter, which ConfiguracaoGlobal to fetch.
     */
    where?: ConfiguracaoGlobalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracaoGlobals to fetch.
     */
    orderBy?: ConfiguracaoGlobalOrderByWithRelationInput | ConfiguracaoGlobalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfiguracaoGlobals.
     */
    cursor?: ConfiguracaoGlobalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracaoGlobals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracaoGlobals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfiguracaoGlobals.
     */
    distinct?: ConfiguracaoGlobalScalarFieldEnum | ConfiguracaoGlobalScalarFieldEnum[]
  }

  /**
   * ConfiguracaoGlobal findFirstOrThrow
   */
  export type ConfiguracaoGlobalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * Filter, which ConfiguracaoGlobal to fetch.
     */
    where?: ConfiguracaoGlobalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracaoGlobals to fetch.
     */
    orderBy?: ConfiguracaoGlobalOrderByWithRelationInput | ConfiguracaoGlobalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfiguracaoGlobals.
     */
    cursor?: ConfiguracaoGlobalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracaoGlobals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracaoGlobals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfiguracaoGlobals.
     */
    distinct?: ConfiguracaoGlobalScalarFieldEnum | ConfiguracaoGlobalScalarFieldEnum[]
  }

  /**
   * ConfiguracaoGlobal findMany
   */
  export type ConfiguracaoGlobalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * Filter, which ConfiguracaoGlobals to fetch.
     */
    where?: ConfiguracaoGlobalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfiguracaoGlobals to fetch.
     */
    orderBy?: ConfiguracaoGlobalOrderByWithRelationInput | ConfiguracaoGlobalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConfiguracaoGlobals.
     */
    cursor?: ConfiguracaoGlobalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfiguracaoGlobals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfiguracaoGlobals.
     */
    skip?: number
    distinct?: ConfiguracaoGlobalScalarFieldEnum | ConfiguracaoGlobalScalarFieldEnum[]
  }

  /**
   * ConfiguracaoGlobal create
   */
  export type ConfiguracaoGlobalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * The data needed to create a ConfiguracaoGlobal.
     */
    data: XOR<ConfiguracaoGlobalCreateInput, ConfiguracaoGlobalUncheckedCreateInput>
  }

  /**
   * ConfiguracaoGlobal createMany
   */
  export type ConfiguracaoGlobalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConfiguracaoGlobals.
     */
    data: ConfiguracaoGlobalCreateManyInput | ConfiguracaoGlobalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfiguracaoGlobal createManyAndReturn
   */
  export type ConfiguracaoGlobalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * The data used to create many ConfiguracaoGlobals.
     */
    data: ConfiguracaoGlobalCreateManyInput | ConfiguracaoGlobalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfiguracaoGlobal update
   */
  export type ConfiguracaoGlobalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * The data needed to update a ConfiguracaoGlobal.
     */
    data: XOR<ConfiguracaoGlobalUpdateInput, ConfiguracaoGlobalUncheckedUpdateInput>
    /**
     * Choose, which ConfiguracaoGlobal to update.
     */
    where: ConfiguracaoGlobalWhereUniqueInput
  }

  /**
   * ConfiguracaoGlobal updateMany
   */
  export type ConfiguracaoGlobalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConfiguracaoGlobals.
     */
    data: XOR<ConfiguracaoGlobalUpdateManyMutationInput, ConfiguracaoGlobalUncheckedUpdateManyInput>
    /**
     * Filter which ConfiguracaoGlobals to update
     */
    where?: ConfiguracaoGlobalWhereInput
    /**
     * Limit how many ConfiguracaoGlobals to update.
     */
    limit?: number
  }

  /**
   * ConfiguracaoGlobal updateManyAndReturn
   */
  export type ConfiguracaoGlobalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * The data used to update ConfiguracaoGlobals.
     */
    data: XOR<ConfiguracaoGlobalUpdateManyMutationInput, ConfiguracaoGlobalUncheckedUpdateManyInput>
    /**
     * Filter which ConfiguracaoGlobals to update
     */
    where?: ConfiguracaoGlobalWhereInput
    /**
     * Limit how many ConfiguracaoGlobals to update.
     */
    limit?: number
  }

  /**
   * ConfiguracaoGlobal upsert
   */
  export type ConfiguracaoGlobalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * The filter to search for the ConfiguracaoGlobal to update in case it exists.
     */
    where: ConfiguracaoGlobalWhereUniqueInput
    /**
     * In case the ConfiguracaoGlobal found by the `where` argument doesn't exist, create a new ConfiguracaoGlobal with this data.
     */
    create: XOR<ConfiguracaoGlobalCreateInput, ConfiguracaoGlobalUncheckedCreateInput>
    /**
     * In case the ConfiguracaoGlobal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConfiguracaoGlobalUpdateInput, ConfiguracaoGlobalUncheckedUpdateInput>
  }

  /**
   * ConfiguracaoGlobal delete
   */
  export type ConfiguracaoGlobalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
    /**
     * Filter which ConfiguracaoGlobal to delete.
     */
    where: ConfiguracaoGlobalWhereUniqueInput
  }

  /**
   * ConfiguracaoGlobal deleteMany
   */
  export type ConfiguracaoGlobalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfiguracaoGlobals to delete
     */
    where?: ConfiguracaoGlobalWhereInput
    /**
     * Limit how many ConfiguracaoGlobals to delete.
     */
    limit?: number
  }

  /**
   * ConfiguracaoGlobal without action
   */
  export type ConfiguracaoGlobalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfiguracaoGlobal
     */
    select?: ConfiguracaoGlobalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConfiguracaoGlobal
     */
    omit?: ConfiguracaoGlobalOmit<ExtArgs> | null
  }


  /**
   * Model Ala
   */

  export type AggregateAla = {
    _count: AlaCountAggregateOutputType | null
    _avg: AlaAvgAggregateOutputType | null
    _sum: AlaSumAggregateOutputType | null
    _min: AlaMinAggregateOutputType | null
    _max: AlaMaxAggregateOutputType | null
  }

  export type AlaAvgAggregateOutputType = {
    ordem: number | null
  }

  export type AlaSumAggregateOutputType = {
    ordem: number | null
  }

  export type AlaMinAggregateOutputType = {
    id: string | null
    nome: string | null
    ordem: number | null
    ativa: boolean | null
    createdAt: Date | null
  }

  export type AlaMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    ordem: number | null
    ativa: boolean | null
    createdAt: Date | null
  }

  export type AlaCountAggregateOutputType = {
    id: number
    nome: number
    ordem: number
    ativa: number
    createdAt: number
    _all: number
  }


  export type AlaAvgAggregateInputType = {
    ordem?: true
  }

  export type AlaSumAggregateInputType = {
    ordem?: true
  }

  export type AlaMinAggregateInputType = {
    id?: true
    nome?: true
    ordem?: true
    ativa?: true
    createdAt?: true
  }

  export type AlaMaxAggregateInputType = {
    id?: true
    nome?: true
    ordem?: true
    ativa?: true
    createdAt?: true
  }

  export type AlaCountAggregateInputType = {
    id?: true
    nome?: true
    ordem?: true
    ativa?: true
    createdAt?: true
    _all?: true
  }

  export type AlaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ala to aggregate.
     */
    where?: AlaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alas to fetch.
     */
    orderBy?: AlaOrderByWithRelationInput | AlaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Alas
    **/
    _count?: true | AlaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AlaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AlaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlaMaxAggregateInputType
  }

  export type GetAlaAggregateType<T extends AlaAggregateArgs> = {
        [P in keyof T & keyof AggregateAla]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAla[P]>
      : GetScalarType<T[P], AggregateAla[P]>
  }




  export type AlaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlaWhereInput
    orderBy?: AlaOrderByWithAggregationInput | AlaOrderByWithAggregationInput[]
    by: AlaScalarFieldEnum[] | AlaScalarFieldEnum
    having?: AlaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlaCountAggregateInputType | true
    _avg?: AlaAvgAggregateInputType
    _sum?: AlaSumAggregateInputType
    _min?: AlaMinAggregateInputType
    _max?: AlaMaxAggregateInputType
  }

  export type AlaGroupByOutputType = {
    id: string
    nome: string
    ordem: number
    ativa: boolean
    createdAt: Date
    _count: AlaCountAggregateOutputType | null
    _avg: AlaAvgAggregateOutputType | null
    _sum: AlaSumAggregateOutputType | null
    _min: AlaMinAggregateOutputType | null
    _max: AlaMaxAggregateOutputType | null
  }

  type GetAlaGroupByPayload<T extends AlaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlaGroupByOutputType[P]>
            : GetScalarType<T[P], AlaGroupByOutputType[P]>
        }
      >
    >


  export type AlaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    ordem?: boolean
    ativa?: boolean
    createdAt?: boolean
    distribs?: boolean | Ala$distribsArgs<ExtArgs>
    _count?: boolean | AlaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ala"]>

  export type AlaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    ordem?: boolean
    ativa?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ala"]>

  export type AlaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    ordem?: boolean
    ativa?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ala"]>

  export type AlaSelectScalar = {
    id?: boolean
    nome?: boolean
    ordem?: boolean
    ativa?: boolean
    createdAt?: boolean
  }

  export type AlaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "ordem" | "ativa" | "createdAt", ExtArgs["result"]["ala"]>
  export type AlaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    distribs?: boolean | Ala$distribsArgs<ExtArgs>
    _count?: boolean | AlaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AlaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AlaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AlaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ala"
    objects: {
      distribs: Prisma.$DistribAlaPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      ordem: number
      ativa: boolean
      createdAt: Date
    }, ExtArgs["result"]["ala"]>
    composites: {}
  }

  type AlaGetPayload<S extends boolean | null | undefined | AlaDefaultArgs> = $Result.GetResult<Prisma.$AlaPayload, S>

  type AlaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AlaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AlaCountAggregateInputType | true
    }

  export interface AlaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ala'], meta: { name: 'Ala' } }
    /**
     * Find zero or one Ala that matches the filter.
     * @param {AlaFindUniqueArgs} args - Arguments to find a Ala
     * @example
     * // Get one Ala
     * const ala = await prisma.ala.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlaFindUniqueArgs>(args: SelectSubset<T, AlaFindUniqueArgs<ExtArgs>>): Prisma__AlaClient<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ala that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AlaFindUniqueOrThrowArgs} args - Arguments to find a Ala
     * @example
     * // Get one Ala
     * const ala = await prisma.ala.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlaFindUniqueOrThrowArgs>(args: SelectSubset<T, AlaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlaClient<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ala that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlaFindFirstArgs} args - Arguments to find a Ala
     * @example
     * // Get one Ala
     * const ala = await prisma.ala.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlaFindFirstArgs>(args?: SelectSubset<T, AlaFindFirstArgs<ExtArgs>>): Prisma__AlaClient<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ala that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlaFindFirstOrThrowArgs} args - Arguments to find a Ala
     * @example
     * // Get one Ala
     * const ala = await prisma.ala.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlaFindFirstOrThrowArgs>(args?: SelectSubset<T, AlaFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlaClient<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Alas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Alas
     * const alas = await prisma.ala.findMany()
     * 
     * // Get first 10 Alas
     * const alas = await prisma.ala.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alaWithIdOnly = await prisma.ala.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlaFindManyArgs>(args?: SelectSubset<T, AlaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ala.
     * @param {AlaCreateArgs} args - Arguments to create a Ala.
     * @example
     * // Create one Ala
     * const Ala = await prisma.ala.create({
     *   data: {
     *     // ... data to create a Ala
     *   }
     * })
     * 
     */
    create<T extends AlaCreateArgs>(args: SelectSubset<T, AlaCreateArgs<ExtArgs>>): Prisma__AlaClient<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Alas.
     * @param {AlaCreateManyArgs} args - Arguments to create many Alas.
     * @example
     * // Create many Alas
     * const ala = await prisma.ala.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlaCreateManyArgs>(args?: SelectSubset<T, AlaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Alas and returns the data saved in the database.
     * @param {AlaCreateManyAndReturnArgs} args - Arguments to create many Alas.
     * @example
     * // Create many Alas
     * const ala = await prisma.ala.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Alas and only return the `id`
     * const alaWithIdOnly = await prisma.ala.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlaCreateManyAndReturnArgs>(args?: SelectSubset<T, AlaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ala.
     * @param {AlaDeleteArgs} args - Arguments to delete one Ala.
     * @example
     * // Delete one Ala
     * const Ala = await prisma.ala.delete({
     *   where: {
     *     // ... filter to delete one Ala
     *   }
     * })
     * 
     */
    delete<T extends AlaDeleteArgs>(args: SelectSubset<T, AlaDeleteArgs<ExtArgs>>): Prisma__AlaClient<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ala.
     * @param {AlaUpdateArgs} args - Arguments to update one Ala.
     * @example
     * // Update one Ala
     * const ala = await prisma.ala.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlaUpdateArgs>(args: SelectSubset<T, AlaUpdateArgs<ExtArgs>>): Prisma__AlaClient<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Alas.
     * @param {AlaDeleteManyArgs} args - Arguments to filter Alas to delete.
     * @example
     * // Delete a few Alas
     * const { count } = await prisma.ala.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlaDeleteManyArgs>(args?: SelectSubset<T, AlaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Alas
     * const ala = await prisma.ala.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlaUpdateManyArgs>(args: SelectSubset<T, AlaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Alas and returns the data updated in the database.
     * @param {AlaUpdateManyAndReturnArgs} args - Arguments to update many Alas.
     * @example
     * // Update many Alas
     * const ala = await prisma.ala.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Alas and only return the `id`
     * const alaWithIdOnly = await prisma.ala.updateManyAndReturn({
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
    updateManyAndReturn<T extends AlaUpdateManyAndReturnArgs>(args: SelectSubset<T, AlaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ala.
     * @param {AlaUpsertArgs} args - Arguments to update or create a Ala.
     * @example
     * // Update or create a Ala
     * const ala = await prisma.ala.upsert({
     *   create: {
     *     // ... data to create a Ala
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ala we want to update
     *   }
     * })
     */
    upsert<T extends AlaUpsertArgs>(args: SelectSubset<T, AlaUpsertArgs<ExtArgs>>): Prisma__AlaClient<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Alas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlaCountArgs} args - Arguments to filter Alas to count.
     * @example
     * // Count the number of Alas
     * const count = await prisma.ala.count({
     *   where: {
     *     // ... the filter for the Alas we want to count
     *   }
     * })
    **/
    count<T extends AlaCountArgs>(
      args?: Subset<T, AlaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ala.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AlaAggregateArgs>(args: Subset<T, AlaAggregateArgs>): Prisma.PrismaPromise<GetAlaAggregateType<T>>

    /**
     * Group by Ala.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlaGroupByArgs} args - Group by arguments.
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
      T extends AlaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlaGroupByArgs['orderBy'] }
        : { orderBy?: AlaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AlaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ala model
   */
  readonly fields: AlaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ala.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    distribs<T extends Ala$distribsArgs<ExtArgs> = {}>(args?: Subset<T, Ala$distribsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Ala model
   */
  interface AlaFieldRefs {
    readonly id: FieldRef<"Ala", 'String'>
    readonly nome: FieldRef<"Ala", 'String'>
    readonly ordem: FieldRef<"Ala", 'Int'>
    readonly ativa: FieldRef<"Ala", 'Boolean'>
    readonly createdAt: FieldRef<"Ala", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ala findUnique
   */
  export type AlaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlaInclude<ExtArgs> | null
    /**
     * Filter, which Ala to fetch.
     */
    where: AlaWhereUniqueInput
  }

  /**
   * Ala findUniqueOrThrow
   */
  export type AlaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlaInclude<ExtArgs> | null
    /**
     * Filter, which Ala to fetch.
     */
    where: AlaWhereUniqueInput
  }

  /**
   * Ala findFirst
   */
  export type AlaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlaInclude<ExtArgs> | null
    /**
     * Filter, which Ala to fetch.
     */
    where?: AlaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alas to fetch.
     */
    orderBy?: AlaOrderByWithRelationInput | AlaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alas.
     */
    cursor?: AlaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alas.
     */
    distinct?: AlaScalarFieldEnum | AlaScalarFieldEnum[]
  }

  /**
   * Ala findFirstOrThrow
   */
  export type AlaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlaInclude<ExtArgs> | null
    /**
     * Filter, which Ala to fetch.
     */
    where?: AlaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alas to fetch.
     */
    orderBy?: AlaOrderByWithRelationInput | AlaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Alas.
     */
    cursor?: AlaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Alas.
     */
    distinct?: AlaScalarFieldEnum | AlaScalarFieldEnum[]
  }

  /**
   * Ala findMany
   */
  export type AlaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlaInclude<ExtArgs> | null
    /**
     * Filter, which Alas to fetch.
     */
    where?: AlaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Alas to fetch.
     */
    orderBy?: AlaOrderByWithRelationInput | AlaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Alas.
     */
    cursor?: AlaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Alas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Alas.
     */
    skip?: number
    distinct?: AlaScalarFieldEnum | AlaScalarFieldEnum[]
  }

  /**
   * Ala create
   */
  export type AlaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlaInclude<ExtArgs> | null
    /**
     * The data needed to create a Ala.
     */
    data: XOR<AlaCreateInput, AlaUncheckedCreateInput>
  }

  /**
   * Ala createMany
   */
  export type AlaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Alas.
     */
    data: AlaCreateManyInput | AlaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ala createManyAndReturn
   */
  export type AlaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * The data used to create many Alas.
     */
    data: AlaCreateManyInput | AlaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ala update
   */
  export type AlaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlaInclude<ExtArgs> | null
    /**
     * The data needed to update a Ala.
     */
    data: XOR<AlaUpdateInput, AlaUncheckedUpdateInput>
    /**
     * Choose, which Ala to update.
     */
    where: AlaWhereUniqueInput
  }

  /**
   * Ala updateMany
   */
  export type AlaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Alas.
     */
    data: XOR<AlaUpdateManyMutationInput, AlaUncheckedUpdateManyInput>
    /**
     * Filter which Alas to update
     */
    where?: AlaWhereInput
    /**
     * Limit how many Alas to update.
     */
    limit?: number
  }

  /**
   * Ala updateManyAndReturn
   */
  export type AlaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * The data used to update Alas.
     */
    data: XOR<AlaUpdateManyMutationInput, AlaUncheckedUpdateManyInput>
    /**
     * Filter which Alas to update
     */
    where?: AlaWhereInput
    /**
     * Limit how many Alas to update.
     */
    limit?: number
  }

  /**
   * Ala upsert
   */
  export type AlaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlaInclude<ExtArgs> | null
    /**
     * The filter to search for the Ala to update in case it exists.
     */
    where: AlaWhereUniqueInput
    /**
     * In case the Ala found by the `where` argument doesn't exist, create a new Ala with this data.
     */
    create: XOR<AlaCreateInput, AlaUncheckedCreateInput>
    /**
     * In case the Ala was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlaUpdateInput, AlaUncheckedUpdateInput>
  }

  /**
   * Ala delete
   */
  export type AlaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlaInclude<ExtArgs> | null
    /**
     * Filter which Ala to delete.
     */
    where: AlaWhereUniqueInput
  }

  /**
   * Ala deleteMany
   */
  export type AlaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Alas to delete
     */
    where?: AlaWhereInput
    /**
     * Limit how many Alas to delete.
     */
    limit?: number
  }

  /**
   * Ala.distribs
   */
  export type Ala$distribsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
    where?: DistribAlaWhereInput
    orderBy?: DistribAlaOrderByWithRelationInput | DistribAlaOrderByWithRelationInput[]
    cursor?: DistribAlaWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DistribAlaScalarFieldEnum | DistribAlaScalarFieldEnum[]
  }

  /**
   * Ala without action
   */
  export type AlaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ala
     */
    select?: AlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ala
     */
    omit?: AlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlaInclude<ExtArgs> | null
  }


  /**
   * Model DistribAla
   */

  export type AggregateDistribAla = {
    _count: DistribAlaCountAggregateOutputType | null
    _avg: DistribAlaAvgAggregateOutputType | null
    _sum: DistribAlaSumAggregateOutputType | null
    _min: DistribAlaMinAggregateOutputType | null
    _max: DistribAlaMaxAggregateOutputType | null
  }

  export type DistribAlaAvgAggregateOutputType = {
    internos: number | null
    dietas: number | null
  }

  export type DistribAlaSumAggregateOutputType = {
    internos: number | null
    dietas: number | null
  }

  export type DistribAlaMinAggregateOutputType = {
    id: string | null
    modulo: $Enums.Modulo | null
    alaId: string | null
    internos: number | null
    dietas: number | null
    updatedAt: Date | null
  }

  export type DistribAlaMaxAggregateOutputType = {
    id: string | null
    modulo: $Enums.Modulo | null
    alaId: string | null
    internos: number | null
    dietas: number | null
    updatedAt: Date | null
  }

  export type DistribAlaCountAggregateOutputType = {
    id: number
    modulo: number
    alaId: number
    internos: number
    dietas: number
    updatedAt: number
    _all: number
  }


  export type DistribAlaAvgAggregateInputType = {
    internos?: true
    dietas?: true
  }

  export type DistribAlaSumAggregateInputType = {
    internos?: true
    dietas?: true
  }

  export type DistribAlaMinAggregateInputType = {
    id?: true
    modulo?: true
    alaId?: true
    internos?: true
    dietas?: true
    updatedAt?: true
  }

  export type DistribAlaMaxAggregateInputType = {
    id?: true
    modulo?: true
    alaId?: true
    internos?: true
    dietas?: true
    updatedAt?: true
  }

  export type DistribAlaCountAggregateInputType = {
    id?: true
    modulo?: true
    alaId?: true
    internos?: true
    dietas?: true
    updatedAt?: true
    _all?: true
  }

  export type DistribAlaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DistribAla to aggregate.
     */
    where?: DistribAlaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DistribAlas to fetch.
     */
    orderBy?: DistribAlaOrderByWithRelationInput | DistribAlaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DistribAlaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DistribAlas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DistribAlas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DistribAlas
    **/
    _count?: true | DistribAlaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DistribAlaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DistribAlaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DistribAlaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DistribAlaMaxAggregateInputType
  }

  export type GetDistribAlaAggregateType<T extends DistribAlaAggregateArgs> = {
        [P in keyof T & keyof AggregateDistribAla]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDistribAla[P]>
      : GetScalarType<T[P], AggregateDistribAla[P]>
  }




  export type DistribAlaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DistribAlaWhereInput
    orderBy?: DistribAlaOrderByWithAggregationInput | DistribAlaOrderByWithAggregationInput[]
    by: DistribAlaScalarFieldEnum[] | DistribAlaScalarFieldEnum
    having?: DistribAlaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DistribAlaCountAggregateInputType | true
    _avg?: DistribAlaAvgAggregateInputType
    _sum?: DistribAlaSumAggregateInputType
    _min?: DistribAlaMinAggregateInputType
    _max?: DistribAlaMaxAggregateInputType
  }

  export type DistribAlaGroupByOutputType = {
    id: string
    modulo: $Enums.Modulo
    alaId: string
    internos: number
    dietas: number
    updatedAt: Date
    _count: DistribAlaCountAggregateOutputType | null
    _avg: DistribAlaAvgAggregateOutputType | null
    _sum: DistribAlaSumAggregateOutputType | null
    _min: DistribAlaMinAggregateOutputType | null
    _max: DistribAlaMaxAggregateOutputType | null
  }

  type GetDistribAlaGroupByPayload<T extends DistribAlaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DistribAlaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DistribAlaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DistribAlaGroupByOutputType[P]>
            : GetScalarType<T[P], DistribAlaGroupByOutputType[P]>
        }
      >
    >


  export type DistribAlaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    modulo?: boolean
    alaId?: boolean
    internos?: boolean
    dietas?: boolean
    updatedAt?: boolean
    ala?: boolean | AlaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["distribAla"]>

  export type DistribAlaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    modulo?: boolean
    alaId?: boolean
    internos?: boolean
    dietas?: boolean
    updatedAt?: boolean
    ala?: boolean | AlaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["distribAla"]>

  export type DistribAlaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    modulo?: boolean
    alaId?: boolean
    internos?: boolean
    dietas?: boolean
    updatedAt?: boolean
    ala?: boolean | AlaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["distribAla"]>

  export type DistribAlaSelectScalar = {
    id?: boolean
    modulo?: boolean
    alaId?: boolean
    internos?: boolean
    dietas?: boolean
    updatedAt?: boolean
  }

  export type DistribAlaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "modulo" | "alaId" | "internos" | "dietas" | "updatedAt", ExtArgs["result"]["distribAla"]>
  export type DistribAlaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ala?: boolean | AlaDefaultArgs<ExtArgs>
  }
  export type DistribAlaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ala?: boolean | AlaDefaultArgs<ExtArgs>
  }
  export type DistribAlaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ala?: boolean | AlaDefaultArgs<ExtArgs>
  }

  export type $DistribAlaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DistribAla"
    objects: {
      ala: Prisma.$AlaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      modulo: $Enums.Modulo
      alaId: string
      internos: number
      dietas: number
      updatedAt: Date
    }, ExtArgs["result"]["distribAla"]>
    composites: {}
  }

  type DistribAlaGetPayload<S extends boolean | null | undefined | DistribAlaDefaultArgs> = $Result.GetResult<Prisma.$DistribAlaPayload, S>

  type DistribAlaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DistribAlaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DistribAlaCountAggregateInputType | true
    }

  export interface DistribAlaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DistribAla'], meta: { name: 'DistribAla' } }
    /**
     * Find zero or one DistribAla that matches the filter.
     * @param {DistribAlaFindUniqueArgs} args - Arguments to find a DistribAla
     * @example
     * // Get one DistribAla
     * const distribAla = await prisma.distribAla.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DistribAlaFindUniqueArgs>(args: SelectSubset<T, DistribAlaFindUniqueArgs<ExtArgs>>): Prisma__DistribAlaClient<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DistribAla that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DistribAlaFindUniqueOrThrowArgs} args - Arguments to find a DistribAla
     * @example
     * // Get one DistribAla
     * const distribAla = await prisma.distribAla.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DistribAlaFindUniqueOrThrowArgs>(args: SelectSubset<T, DistribAlaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DistribAlaClient<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DistribAla that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistribAlaFindFirstArgs} args - Arguments to find a DistribAla
     * @example
     * // Get one DistribAla
     * const distribAla = await prisma.distribAla.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DistribAlaFindFirstArgs>(args?: SelectSubset<T, DistribAlaFindFirstArgs<ExtArgs>>): Prisma__DistribAlaClient<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DistribAla that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistribAlaFindFirstOrThrowArgs} args - Arguments to find a DistribAla
     * @example
     * // Get one DistribAla
     * const distribAla = await prisma.distribAla.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DistribAlaFindFirstOrThrowArgs>(args?: SelectSubset<T, DistribAlaFindFirstOrThrowArgs<ExtArgs>>): Prisma__DistribAlaClient<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DistribAlas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistribAlaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DistribAlas
     * const distribAlas = await prisma.distribAla.findMany()
     * 
     * // Get first 10 DistribAlas
     * const distribAlas = await prisma.distribAla.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const distribAlaWithIdOnly = await prisma.distribAla.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DistribAlaFindManyArgs>(args?: SelectSubset<T, DistribAlaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DistribAla.
     * @param {DistribAlaCreateArgs} args - Arguments to create a DistribAla.
     * @example
     * // Create one DistribAla
     * const DistribAla = await prisma.distribAla.create({
     *   data: {
     *     // ... data to create a DistribAla
     *   }
     * })
     * 
     */
    create<T extends DistribAlaCreateArgs>(args: SelectSubset<T, DistribAlaCreateArgs<ExtArgs>>): Prisma__DistribAlaClient<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DistribAlas.
     * @param {DistribAlaCreateManyArgs} args - Arguments to create many DistribAlas.
     * @example
     * // Create many DistribAlas
     * const distribAla = await prisma.distribAla.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DistribAlaCreateManyArgs>(args?: SelectSubset<T, DistribAlaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DistribAlas and returns the data saved in the database.
     * @param {DistribAlaCreateManyAndReturnArgs} args - Arguments to create many DistribAlas.
     * @example
     * // Create many DistribAlas
     * const distribAla = await prisma.distribAla.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DistribAlas and only return the `id`
     * const distribAlaWithIdOnly = await prisma.distribAla.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DistribAlaCreateManyAndReturnArgs>(args?: SelectSubset<T, DistribAlaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DistribAla.
     * @param {DistribAlaDeleteArgs} args - Arguments to delete one DistribAla.
     * @example
     * // Delete one DistribAla
     * const DistribAla = await prisma.distribAla.delete({
     *   where: {
     *     // ... filter to delete one DistribAla
     *   }
     * })
     * 
     */
    delete<T extends DistribAlaDeleteArgs>(args: SelectSubset<T, DistribAlaDeleteArgs<ExtArgs>>): Prisma__DistribAlaClient<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DistribAla.
     * @param {DistribAlaUpdateArgs} args - Arguments to update one DistribAla.
     * @example
     * // Update one DistribAla
     * const distribAla = await prisma.distribAla.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DistribAlaUpdateArgs>(args: SelectSubset<T, DistribAlaUpdateArgs<ExtArgs>>): Prisma__DistribAlaClient<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DistribAlas.
     * @param {DistribAlaDeleteManyArgs} args - Arguments to filter DistribAlas to delete.
     * @example
     * // Delete a few DistribAlas
     * const { count } = await prisma.distribAla.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DistribAlaDeleteManyArgs>(args?: SelectSubset<T, DistribAlaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DistribAlas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistribAlaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DistribAlas
     * const distribAla = await prisma.distribAla.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DistribAlaUpdateManyArgs>(args: SelectSubset<T, DistribAlaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DistribAlas and returns the data updated in the database.
     * @param {DistribAlaUpdateManyAndReturnArgs} args - Arguments to update many DistribAlas.
     * @example
     * // Update many DistribAlas
     * const distribAla = await prisma.distribAla.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DistribAlas and only return the `id`
     * const distribAlaWithIdOnly = await prisma.distribAla.updateManyAndReturn({
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
    updateManyAndReturn<T extends DistribAlaUpdateManyAndReturnArgs>(args: SelectSubset<T, DistribAlaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DistribAla.
     * @param {DistribAlaUpsertArgs} args - Arguments to update or create a DistribAla.
     * @example
     * // Update or create a DistribAla
     * const distribAla = await prisma.distribAla.upsert({
     *   create: {
     *     // ... data to create a DistribAla
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DistribAla we want to update
     *   }
     * })
     */
    upsert<T extends DistribAlaUpsertArgs>(args: SelectSubset<T, DistribAlaUpsertArgs<ExtArgs>>): Prisma__DistribAlaClient<$Result.GetResult<Prisma.$DistribAlaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DistribAlas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistribAlaCountArgs} args - Arguments to filter DistribAlas to count.
     * @example
     * // Count the number of DistribAlas
     * const count = await prisma.distribAla.count({
     *   where: {
     *     // ... the filter for the DistribAlas we want to count
     *   }
     * })
    **/
    count<T extends DistribAlaCountArgs>(
      args?: Subset<T, DistribAlaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DistribAlaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DistribAla.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistribAlaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DistribAlaAggregateArgs>(args: Subset<T, DistribAlaAggregateArgs>): Prisma.PrismaPromise<GetDistribAlaAggregateType<T>>

    /**
     * Group by DistribAla.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DistribAlaGroupByArgs} args - Group by arguments.
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
      T extends DistribAlaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DistribAlaGroupByArgs['orderBy'] }
        : { orderBy?: DistribAlaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DistribAlaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDistribAlaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DistribAla model
   */
  readonly fields: DistribAlaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DistribAla.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DistribAlaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ala<T extends AlaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AlaDefaultArgs<ExtArgs>>): Prisma__AlaClient<$Result.GetResult<Prisma.$AlaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DistribAla model
   */
  interface DistribAlaFieldRefs {
    readonly id: FieldRef<"DistribAla", 'String'>
    readonly modulo: FieldRef<"DistribAla", 'Modulo'>
    readonly alaId: FieldRef<"DistribAla", 'String'>
    readonly internos: FieldRef<"DistribAla", 'Int'>
    readonly dietas: FieldRef<"DistribAla", 'Int'>
    readonly updatedAt: FieldRef<"DistribAla", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DistribAla findUnique
   */
  export type DistribAlaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
    /**
     * Filter, which DistribAla to fetch.
     */
    where: DistribAlaWhereUniqueInput
  }

  /**
   * DistribAla findUniqueOrThrow
   */
  export type DistribAlaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
    /**
     * Filter, which DistribAla to fetch.
     */
    where: DistribAlaWhereUniqueInput
  }

  /**
   * DistribAla findFirst
   */
  export type DistribAlaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
    /**
     * Filter, which DistribAla to fetch.
     */
    where?: DistribAlaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DistribAlas to fetch.
     */
    orderBy?: DistribAlaOrderByWithRelationInput | DistribAlaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DistribAlas.
     */
    cursor?: DistribAlaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DistribAlas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DistribAlas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DistribAlas.
     */
    distinct?: DistribAlaScalarFieldEnum | DistribAlaScalarFieldEnum[]
  }

  /**
   * DistribAla findFirstOrThrow
   */
  export type DistribAlaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
    /**
     * Filter, which DistribAla to fetch.
     */
    where?: DistribAlaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DistribAlas to fetch.
     */
    orderBy?: DistribAlaOrderByWithRelationInput | DistribAlaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DistribAlas.
     */
    cursor?: DistribAlaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DistribAlas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DistribAlas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DistribAlas.
     */
    distinct?: DistribAlaScalarFieldEnum | DistribAlaScalarFieldEnum[]
  }

  /**
   * DistribAla findMany
   */
  export type DistribAlaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
    /**
     * Filter, which DistribAlas to fetch.
     */
    where?: DistribAlaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DistribAlas to fetch.
     */
    orderBy?: DistribAlaOrderByWithRelationInput | DistribAlaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DistribAlas.
     */
    cursor?: DistribAlaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DistribAlas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DistribAlas.
     */
    skip?: number
    distinct?: DistribAlaScalarFieldEnum | DistribAlaScalarFieldEnum[]
  }

  /**
   * DistribAla create
   */
  export type DistribAlaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
    /**
     * The data needed to create a DistribAla.
     */
    data: XOR<DistribAlaCreateInput, DistribAlaUncheckedCreateInput>
  }

  /**
   * DistribAla createMany
   */
  export type DistribAlaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DistribAlas.
     */
    data: DistribAlaCreateManyInput | DistribAlaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DistribAla createManyAndReturn
   */
  export type DistribAlaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * The data used to create many DistribAlas.
     */
    data: DistribAlaCreateManyInput | DistribAlaCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DistribAla update
   */
  export type DistribAlaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
    /**
     * The data needed to update a DistribAla.
     */
    data: XOR<DistribAlaUpdateInput, DistribAlaUncheckedUpdateInput>
    /**
     * Choose, which DistribAla to update.
     */
    where: DistribAlaWhereUniqueInput
  }

  /**
   * DistribAla updateMany
   */
  export type DistribAlaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DistribAlas.
     */
    data: XOR<DistribAlaUpdateManyMutationInput, DistribAlaUncheckedUpdateManyInput>
    /**
     * Filter which DistribAlas to update
     */
    where?: DistribAlaWhereInput
    /**
     * Limit how many DistribAlas to update.
     */
    limit?: number
  }

  /**
   * DistribAla updateManyAndReturn
   */
  export type DistribAlaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * The data used to update DistribAlas.
     */
    data: XOR<DistribAlaUpdateManyMutationInput, DistribAlaUncheckedUpdateManyInput>
    /**
     * Filter which DistribAlas to update
     */
    where?: DistribAlaWhereInput
    /**
     * Limit how many DistribAlas to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DistribAla upsert
   */
  export type DistribAlaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
    /**
     * The filter to search for the DistribAla to update in case it exists.
     */
    where: DistribAlaWhereUniqueInput
    /**
     * In case the DistribAla found by the `where` argument doesn't exist, create a new DistribAla with this data.
     */
    create: XOR<DistribAlaCreateInput, DistribAlaUncheckedCreateInput>
    /**
     * In case the DistribAla was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DistribAlaUpdateInput, DistribAlaUncheckedUpdateInput>
  }

  /**
   * DistribAla delete
   */
  export type DistribAlaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
    /**
     * Filter which DistribAla to delete.
     */
    where: DistribAlaWhereUniqueInput
  }

  /**
   * DistribAla deleteMany
   */
  export type DistribAlaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DistribAlas to delete
     */
    where?: DistribAlaWhereInput
    /**
     * Limit how many DistribAlas to delete.
     */
    limit?: number
  }

  /**
   * DistribAla without action
   */
  export type DistribAlaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DistribAla
     */
    select?: DistribAlaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DistribAla
     */
    omit?: DistribAlaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DistribAlaInclude<ExtArgs> | null
  }


  /**
   * Model Ocorrencia
   */

  export type AggregateOcorrencia = {
    _count: OcorrenciaCountAggregateOutputType | null
    _min: OcorrenciaMinAggregateOutputType | null
    _max: OcorrenciaMaxAggregateOutputType | null
  }

  export type OcorrenciaMinAggregateOutputType = {
    id: string | null
    titulo: string | null
    categoria: string | null
    icone: string | null
    texto: string | null
    servidor: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OcorrenciaMaxAggregateOutputType = {
    id: string | null
    titulo: string | null
    categoria: string | null
    icone: string | null
    texto: string | null
    servidor: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OcorrenciaCountAggregateOutputType = {
    id: number
    titulo: number
    categoria: number
    icone: number
    texto: number
    servidor: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OcorrenciaMinAggregateInputType = {
    id?: true
    titulo?: true
    categoria?: true
    icone?: true
    texto?: true
    servidor?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OcorrenciaMaxAggregateInputType = {
    id?: true
    titulo?: true
    categoria?: true
    icone?: true
    texto?: true
    servidor?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OcorrenciaCountAggregateInputType = {
    id?: true
    titulo?: true
    categoria?: true
    icone?: true
    texto?: true
    servidor?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OcorrenciaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ocorrencia to aggregate.
     */
    where?: OcorrenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ocorrencias to fetch.
     */
    orderBy?: OcorrenciaOrderByWithRelationInput | OcorrenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OcorrenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ocorrencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ocorrencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Ocorrencias
    **/
    _count?: true | OcorrenciaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OcorrenciaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OcorrenciaMaxAggregateInputType
  }

  export type GetOcorrenciaAggregateType<T extends OcorrenciaAggregateArgs> = {
        [P in keyof T & keyof AggregateOcorrencia]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOcorrencia[P]>
      : GetScalarType<T[P], AggregateOcorrencia[P]>
  }




  export type OcorrenciaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OcorrenciaWhereInput
    orderBy?: OcorrenciaOrderByWithAggregationInput | OcorrenciaOrderByWithAggregationInput[]
    by: OcorrenciaScalarFieldEnum[] | OcorrenciaScalarFieldEnum
    having?: OcorrenciaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OcorrenciaCountAggregateInputType | true
    _min?: OcorrenciaMinAggregateInputType
    _max?: OcorrenciaMaxAggregateInputType
  }

  export type OcorrenciaGroupByOutputType = {
    id: string
    titulo: string
    categoria: string
    icone: string
    texto: string
    servidor: string
    createdAt: Date
    updatedAt: Date
    _count: OcorrenciaCountAggregateOutputType | null
    _min: OcorrenciaMinAggregateOutputType | null
    _max: OcorrenciaMaxAggregateOutputType | null
  }

  type GetOcorrenciaGroupByPayload<T extends OcorrenciaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OcorrenciaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OcorrenciaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OcorrenciaGroupByOutputType[P]>
            : GetScalarType<T[P], OcorrenciaGroupByOutputType[P]>
        }
      >
    >


  export type OcorrenciaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    titulo?: boolean
    categoria?: boolean
    icone?: boolean
    texto?: boolean
    servidor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ocorrencia"]>

  export type OcorrenciaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    titulo?: boolean
    categoria?: boolean
    icone?: boolean
    texto?: boolean
    servidor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ocorrencia"]>

  export type OcorrenciaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    titulo?: boolean
    categoria?: boolean
    icone?: boolean
    texto?: boolean
    servidor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["ocorrencia"]>

  export type OcorrenciaSelectScalar = {
    id?: boolean
    titulo?: boolean
    categoria?: boolean
    icone?: boolean
    texto?: boolean
    servidor?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OcorrenciaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "titulo" | "categoria" | "icone" | "texto" | "servidor" | "createdAt" | "updatedAt", ExtArgs["result"]["ocorrencia"]>

  export type $OcorrenciaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ocorrencia"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      titulo: string
      categoria: string
      icone: string
      texto: string
      servidor: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ocorrencia"]>
    composites: {}
  }

  type OcorrenciaGetPayload<S extends boolean | null | undefined | OcorrenciaDefaultArgs> = $Result.GetResult<Prisma.$OcorrenciaPayload, S>

  type OcorrenciaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OcorrenciaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OcorrenciaCountAggregateInputType | true
    }

  export interface OcorrenciaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ocorrencia'], meta: { name: 'Ocorrencia' } }
    /**
     * Find zero or one Ocorrencia that matches the filter.
     * @param {OcorrenciaFindUniqueArgs} args - Arguments to find a Ocorrencia
     * @example
     * // Get one Ocorrencia
     * const ocorrencia = await prisma.ocorrencia.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OcorrenciaFindUniqueArgs>(args: SelectSubset<T, OcorrenciaFindUniqueArgs<ExtArgs>>): Prisma__OcorrenciaClient<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ocorrencia that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OcorrenciaFindUniqueOrThrowArgs} args - Arguments to find a Ocorrencia
     * @example
     * // Get one Ocorrencia
     * const ocorrencia = await prisma.ocorrencia.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OcorrenciaFindUniqueOrThrowArgs>(args: SelectSubset<T, OcorrenciaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OcorrenciaClient<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ocorrencia that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaFindFirstArgs} args - Arguments to find a Ocorrencia
     * @example
     * // Get one Ocorrencia
     * const ocorrencia = await prisma.ocorrencia.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OcorrenciaFindFirstArgs>(args?: SelectSubset<T, OcorrenciaFindFirstArgs<ExtArgs>>): Prisma__OcorrenciaClient<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ocorrencia that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaFindFirstOrThrowArgs} args - Arguments to find a Ocorrencia
     * @example
     * // Get one Ocorrencia
     * const ocorrencia = await prisma.ocorrencia.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OcorrenciaFindFirstOrThrowArgs>(args?: SelectSubset<T, OcorrenciaFindFirstOrThrowArgs<ExtArgs>>): Prisma__OcorrenciaClient<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Ocorrencias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Ocorrencias
     * const ocorrencias = await prisma.ocorrencia.findMany()
     * 
     * // Get first 10 Ocorrencias
     * const ocorrencias = await prisma.ocorrencia.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ocorrenciaWithIdOnly = await prisma.ocorrencia.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OcorrenciaFindManyArgs>(args?: SelectSubset<T, OcorrenciaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ocorrencia.
     * @param {OcorrenciaCreateArgs} args - Arguments to create a Ocorrencia.
     * @example
     * // Create one Ocorrencia
     * const Ocorrencia = await prisma.ocorrencia.create({
     *   data: {
     *     // ... data to create a Ocorrencia
     *   }
     * })
     * 
     */
    create<T extends OcorrenciaCreateArgs>(args: SelectSubset<T, OcorrenciaCreateArgs<ExtArgs>>): Prisma__OcorrenciaClient<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Ocorrencias.
     * @param {OcorrenciaCreateManyArgs} args - Arguments to create many Ocorrencias.
     * @example
     * // Create many Ocorrencias
     * const ocorrencia = await prisma.ocorrencia.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OcorrenciaCreateManyArgs>(args?: SelectSubset<T, OcorrenciaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Ocorrencias and returns the data saved in the database.
     * @param {OcorrenciaCreateManyAndReturnArgs} args - Arguments to create many Ocorrencias.
     * @example
     * // Create many Ocorrencias
     * const ocorrencia = await prisma.ocorrencia.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Ocorrencias and only return the `id`
     * const ocorrenciaWithIdOnly = await prisma.ocorrencia.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OcorrenciaCreateManyAndReturnArgs>(args?: SelectSubset<T, OcorrenciaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ocorrencia.
     * @param {OcorrenciaDeleteArgs} args - Arguments to delete one Ocorrencia.
     * @example
     * // Delete one Ocorrencia
     * const Ocorrencia = await prisma.ocorrencia.delete({
     *   where: {
     *     // ... filter to delete one Ocorrencia
     *   }
     * })
     * 
     */
    delete<T extends OcorrenciaDeleteArgs>(args: SelectSubset<T, OcorrenciaDeleteArgs<ExtArgs>>): Prisma__OcorrenciaClient<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ocorrencia.
     * @param {OcorrenciaUpdateArgs} args - Arguments to update one Ocorrencia.
     * @example
     * // Update one Ocorrencia
     * const ocorrencia = await prisma.ocorrencia.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OcorrenciaUpdateArgs>(args: SelectSubset<T, OcorrenciaUpdateArgs<ExtArgs>>): Prisma__OcorrenciaClient<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Ocorrencias.
     * @param {OcorrenciaDeleteManyArgs} args - Arguments to filter Ocorrencias to delete.
     * @example
     * // Delete a few Ocorrencias
     * const { count } = await prisma.ocorrencia.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OcorrenciaDeleteManyArgs>(args?: SelectSubset<T, OcorrenciaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ocorrencias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Ocorrencias
     * const ocorrencia = await prisma.ocorrencia.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OcorrenciaUpdateManyArgs>(args: SelectSubset<T, OcorrenciaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Ocorrencias and returns the data updated in the database.
     * @param {OcorrenciaUpdateManyAndReturnArgs} args - Arguments to update many Ocorrencias.
     * @example
     * // Update many Ocorrencias
     * const ocorrencia = await prisma.ocorrencia.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Ocorrencias and only return the `id`
     * const ocorrenciaWithIdOnly = await prisma.ocorrencia.updateManyAndReturn({
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
    updateManyAndReturn<T extends OcorrenciaUpdateManyAndReturnArgs>(args: SelectSubset<T, OcorrenciaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ocorrencia.
     * @param {OcorrenciaUpsertArgs} args - Arguments to update or create a Ocorrencia.
     * @example
     * // Update or create a Ocorrencia
     * const ocorrencia = await prisma.ocorrencia.upsert({
     *   create: {
     *     // ... data to create a Ocorrencia
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ocorrencia we want to update
     *   }
     * })
     */
    upsert<T extends OcorrenciaUpsertArgs>(args: SelectSubset<T, OcorrenciaUpsertArgs<ExtArgs>>): Prisma__OcorrenciaClient<$Result.GetResult<Prisma.$OcorrenciaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Ocorrencias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaCountArgs} args - Arguments to filter Ocorrencias to count.
     * @example
     * // Count the number of Ocorrencias
     * const count = await prisma.ocorrencia.count({
     *   where: {
     *     // ... the filter for the Ocorrencias we want to count
     *   }
     * })
    **/
    count<T extends OcorrenciaCountArgs>(
      args?: Subset<T, OcorrenciaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OcorrenciaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ocorrencia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OcorrenciaAggregateArgs>(args: Subset<T, OcorrenciaAggregateArgs>): Prisma.PrismaPromise<GetOcorrenciaAggregateType<T>>

    /**
     * Group by Ocorrencia.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaGroupByArgs} args - Group by arguments.
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
      T extends OcorrenciaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OcorrenciaGroupByArgs['orderBy'] }
        : { orderBy?: OcorrenciaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OcorrenciaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOcorrenciaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ocorrencia model
   */
  readonly fields: OcorrenciaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ocorrencia.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OcorrenciaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Ocorrencia model
   */
  interface OcorrenciaFieldRefs {
    readonly id: FieldRef<"Ocorrencia", 'String'>
    readonly titulo: FieldRef<"Ocorrencia", 'String'>
    readonly categoria: FieldRef<"Ocorrencia", 'String'>
    readonly icone: FieldRef<"Ocorrencia", 'String'>
    readonly texto: FieldRef<"Ocorrencia", 'String'>
    readonly servidor: FieldRef<"Ocorrencia", 'String'>
    readonly createdAt: FieldRef<"Ocorrencia", 'DateTime'>
    readonly updatedAt: FieldRef<"Ocorrencia", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ocorrencia findUnique
   */
  export type OcorrenciaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * Filter, which Ocorrencia to fetch.
     */
    where: OcorrenciaWhereUniqueInput
  }

  /**
   * Ocorrencia findUniqueOrThrow
   */
  export type OcorrenciaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * Filter, which Ocorrencia to fetch.
     */
    where: OcorrenciaWhereUniqueInput
  }

  /**
   * Ocorrencia findFirst
   */
  export type OcorrenciaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * Filter, which Ocorrencia to fetch.
     */
    where?: OcorrenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ocorrencias to fetch.
     */
    orderBy?: OcorrenciaOrderByWithRelationInput | OcorrenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ocorrencias.
     */
    cursor?: OcorrenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ocorrencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ocorrencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ocorrencias.
     */
    distinct?: OcorrenciaScalarFieldEnum | OcorrenciaScalarFieldEnum[]
  }

  /**
   * Ocorrencia findFirstOrThrow
   */
  export type OcorrenciaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * Filter, which Ocorrencia to fetch.
     */
    where?: OcorrenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ocorrencias to fetch.
     */
    orderBy?: OcorrenciaOrderByWithRelationInput | OcorrenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Ocorrencias.
     */
    cursor?: OcorrenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ocorrencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ocorrencias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Ocorrencias.
     */
    distinct?: OcorrenciaScalarFieldEnum | OcorrenciaScalarFieldEnum[]
  }

  /**
   * Ocorrencia findMany
   */
  export type OcorrenciaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * Filter, which Ocorrencias to fetch.
     */
    where?: OcorrenciaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Ocorrencias to fetch.
     */
    orderBy?: OcorrenciaOrderByWithRelationInput | OcorrenciaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Ocorrencias.
     */
    cursor?: OcorrenciaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Ocorrencias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Ocorrencias.
     */
    skip?: number
    distinct?: OcorrenciaScalarFieldEnum | OcorrenciaScalarFieldEnum[]
  }

  /**
   * Ocorrencia create
   */
  export type OcorrenciaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * The data needed to create a Ocorrencia.
     */
    data: XOR<OcorrenciaCreateInput, OcorrenciaUncheckedCreateInput>
  }

  /**
   * Ocorrencia createMany
   */
  export type OcorrenciaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Ocorrencias.
     */
    data: OcorrenciaCreateManyInput | OcorrenciaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ocorrencia createManyAndReturn
   */
  export type OcorrenciaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * The data used to create many Ocorrencias.
     */
    data: OcorrenciaCreateManyInput | OcorrenciaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ocorrencia update
   */
  export type OcorrenciaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * The data needed to update a Ocorrencia.
     */
    data: XOR<OcorrenciaUpdateInput, OcorrenciaUncheckedUpdateInput>
    /**
     * Choose, which Ocorrencia to update.
     */
    where: OcorrenciaWhereUniqueInput
  }

  /**
   * Ocorrencia updateMany
   */
  export type OcorrenciaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Ocorrencias.
     */
    data: XOR<OcorrenciaUpdateManyMutationInput, OcorrenciaUncheckedUpdateManyInput>
    /**
     * Filter which Ocorrencias to update
     */
    where?: OcorrenciaWhereInput
    /**
     * Limit how many Ocorrencias to update.
     */
    limit?: number
  }

  /**
   * Ocorrencia updateManyAndReturn
   */
  export type OcorrenciaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * The data used to update Ocorrencias.
     */
    data: XOR<OcorrenciaUpdateManyMutationInput, OcorrenciaUncheckedUpdateManyInput>
    /**
     * Filter which Ocorrencias to update
     */
    where?: OcorrenciaWhereInput
    /**
     * Limit how many Ocorrencias to update.
     */
    limit?: number
  }

  /**
   * Ocorrencia upsert
   */
  export type OcorrenciaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * The filter to search for the Ocorrencia to update in case it exists.
     */
    where: OcorrenciaWhereUniqueInput
    /**
     * In case the Ocorrencia found by the `where` argument doesn't exist, create a new Ocorrencia with this data.
     */
    create: XOR<OcorrenciaCreateInput, OcorrenciaUncheckedCreateInput>
    /**
     * In case the Ocorrencia was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OcorrenciaUpdateInput, OcorrenciaUncheckedUpdateInput>
  }

  /**
   * Ocorrencia delete
   */
  export type OcorrenciaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
    /**
     * Filter which Ocorrencia to delete.
     */
    where: OcorrenciaWhereUniqueInput
  }

  /**
   * Ocorrencia deleteMany
   */
  export type OcorrenciaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ocorrencias to delete
     */
    where?: OcorrenciaWhereInput
    /**
     * Limit how many Ocorrencias to delete.
     */
    limit?: number
  }

  /**
   * Ocorrencia without action
   */
  export type OcorrenciaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ocorrencia
     */
    select?: OcorrenciaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ocorrencia
     */
    omit?: OcorrenciaOmit<ExtArgs> | null
  }


  /**
   * Model OcorrenciaCategoria
   */

  export type AggregateOcorrenciaCategoria = {
    _count: OcorrenciaCategoriaCountAggregateOutputType | null
    _min: OcorrenciaCategoriaMinAggregateOutputType | null
    _max: OcorrenciaCategoriaMaxAggregateOutputType | null
  }

  export type OcorrenciaCategoriaMinAggregateOutputType = {
    id: string | null
    nome: string | null
    createdAt: Date | null
  }

  export type OcorrenciaCategoriaMaxAggregateOutputType = {
    id: string | null
    nome: string | null
    createdAt: Date | null
  }

  export type OcorrenciaCategoriaCountAggregateOutputType = {
    id: number
    nome: number
    createdAt: number
    _all: number
  }


  export type OcorrenciaCategoriaMinAggregateInputType = {
    id?: true
    nome?: true
    createdAt?: true
  }

  export type OcorrenciaCategoriaMaxAggregateInputType = {
    id?: true
    nome?: true
    createdAt?: true
  }

  export type OcorrenciaCategoriaCountAggregateInputType = {
    id?: true
    nome?: true
    createdAt?: true
    _all?: true
  }

  export type OcorrenciaCategoriaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OcorrenciaCategoria to aggregate.
     */
    where?: OcorrenciaCategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OcorrenciaCategorias to fetch.
     */
    orderBy?: OcorrenciaCategoriaOrderByWithRelationInput | OcorrenciaCategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OcorrenciaCategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OcorrenciaCategorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OcorrenciaCategorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OcorrenciaCategorias
    **/
    _count?: true | OcorrenciaCategoriaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OcorrenciaCategoriaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OcorrenciaCategoriaMaxAggregateInputType
  }

  export type GetOcorrenciaCategoriaAggregateType<T extends OcorrenciaCategoriaAggregateArgs> = {
        [P in keyof T & keyof AggregateOcorrenciaCategoria]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOcorrenciaCategoria[P]>
      : GetScalarType<T[P], AggregateOcorrenciaCategoria[P]>
  }




  export type OcorrenciaCategoriaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OcorrenciaCategoriaWhereInput
    orderBy?: OcorrenciaCategoriaOrderByWithAggregationInput | OcorrenciaCategoriaOrderByWithAggregationInput[]
    by: OcorrenciaCategoriaScalarFieldEnum[] | OcorrenciaCategoriaScalarFieldEnum
    having?: OcorrenciaCategoriaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OcorrenciaCategoriaCountAggregateInputType | true
    _min?: OcorrenciaCategoriaMinAggregateInputType
    _max?: OcorrenciaCategoriaMaxAggregateInputType
  }

  export type OcorrenciaCategoriaGroupByOutputType = {
    id: string
    nome: string
    createdAt: Date
    _count: OcorrenciaCategoriaCountAggregateOutputType | null
    _min: OcorrenciaCategoriaMinAggregateOutputType | null
    _max: OcorrenciaCategoriaMaxAggregateOutputType | null
  }

  type GetOcorrenciaCategoriaGroupByPayload<T extends OcorrenciaCategoriaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OcorrenciaCategoriaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OcorrenciaCategoriaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OcorrenciaCategoriaGroupByOutputType[P]>
            : GetScalarType<T[P], OcorrenciaCategoriaGroupByOutputType[P]>
        }
      >
    >


  export type OcorrenciaCategoriaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ocorrenciaCategoria"]>

  export type OcorrenciaCategoriaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ocorrenciaCategoria"]>

  export type OcorrenciaCategoriaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["ocorrenciaCategoria"]>

  export type OcorrenciaCategoriaSelectScalar = {
    id?: boolean
    nome?: boolean
    createdAt?: boolean
  }

  export type OcorrenciaCategoriaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "createdAt", ExtArgs["result"]["ocorrenciaCategoria"]>

  export type $OcorrenciaCategoriaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OcorrenciaCategoria"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nome: string
      createdAt: Date
    }, ExtArgs["result"]["ocorrenciaCategoria"]>
    composites: {}
  }

  type OcorrenciaCategoriaGetPayload<S extends boolean | null | undefined | OcorrenciaCategoriaDefaultArgs> = $Result.GetResult<Prisma.$OcorrenciaCategoriaPayload, S>

  type OcorrenciaCategoriaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OcorrenciaCategoriaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OcorrenciaCategoriaCountAggregateInputType | true
    }

  export interface OcorrenciaCategoriaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OcorrenciaCategoria'], meta: { name: 'OcorrenciaCategoria' } }
    /**
     * Find zero or one OcorrenciaCategoria that matches the filter.
     * @param {OcorrenciaCategoriaFindUniqueArgs} args - Arguments to find a OcorrenciaCategoria
     * @example
     * // Get one OcorrenciaCategoria
     * const ocorrenciaCategoria = await prisma.ocorrenciaCategoria.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OcorrenciaCategoriaFindUniqueArgs>(args: SelectSubset<T, OcorrenciaCategoriaFindUniqueArgs<ExtArgs>>): Prisma__OcorrenciaCategoriaClient<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OcorrenciaCategoria that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OcorrenciaCategoriaFindUniqueOrThrowArgs} args - Arguments to find a OcorrenciaCategoria
     * @example
     * // Get one OcorrenciaCategoria
     * const ocorrenciaCategoria = await prisma.ocorrenciaCategoria.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OcorrenciaCategoriaFindUniqueOrThrowArgs>(args: SelectSubset<T, OcorrenciaCategoriaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OcorrenciaCategoriaClient<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OcorrenciaCategoria that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaCategoriaFindFirstArgs} args - Arguments to find a OcorrenciaCategoria
     * @example
     * // Get one OcorrenciaCategoria
     * const ocorrenciaCategoria = await prisma.ocorrenciaCategoria.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OcorrenciaCategoriaFindFirstArgs>(args?: SelectSubset<T, OcorrenciaCategoriaFindFirstArgs<ExtArgs>>): Prisma__OcorrenciaCategoriaClient<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OcorrenciaCategoria that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaCategoriaFindFirstOrThrowArgs} args - Arguments to find a OcorrenciaCategoria
     * @example
     * // Get one OcorrenciaCategoria
     * const ocorrenciaCategoria = await prisma.ocorrenciaCategoria.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OcorrenciaCategoriaFindFirstOrThrowArgs>(args?: SelectSubset<T, OcorrenciaCategoriaFindFirstOrThrowArgs<ExtArgs>>): Prisma__OcorrenciaCategoriaClient<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OcorrenciaCategorias that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaCategoriaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OcorrenciaCategorias
     * const ocorrenciaCategorias = await prisma.ocorrenciaCategoria.findMany()
     * 
     * // Get first 10 OcorrenciaCategorias
     * const ocorrenciaCategorias = await prisma.ocorrenciaCategoria.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ocorrenciaCategoriaWithIdOnly = await prisma.ocorrenciaCategoria.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OcorrenciaCategoriaFindManyArgs>(args?: SelectSubset<T, OcorrenciaCategoriaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OcorrenciaCategoria.
     * @param {OcorrenciaCategoriaCreateArgs} args - Arguments to create a OcorrenciaCategoria.
     * @example
     * // Create one OcorrenciaCategoria
     * const OcorrenciaCategoria = await prisma.ocorrenciaCategoria.create({
     *   data: {
     *     // ... data to create a OcorrenciaCategoria
     *   }
     * })
     * 
     */
    create<T extends OcorrenciaCategoriaCreateArgs>(args: SelectSubset<T, OcorrenciaCategoriaCreateArgs<ExtArgs>>): Prisma__OcorrenciaCategoriaClient<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OcorrenciaCategorias.
     * @param {OcorrenciaCategoriaCreateManyArgs} args - Arguments to create many OcorrenciaCategorias.
     * @example
     * // Create many OcorrenciaCategorias
     * const ocorrenciaCategoria = await prisma.ocorrenciaCategoria.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OcorrenciaCategoriaCreateManyArgs>(args?: SelectSubset<T, OcorrenciaCategoriaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OcorrenciaCategorias and returns the data saved in the database.
     * @param {OcorrenciaCategoriaCreateManyAndReturnArgs} args - Arguments to create many OcorrenciaCategorias.
     * @example
     * // Create many OcorrenciaCategorias
     * const ocorrenciaCategoria = await prisma.ocorrenciaCategoria.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OcorrenciaCategorias and only return the `id`
     * const ocorrenciaCategoriaWithIdOnly = await prisma.ocorrenciaCategoria.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OcorrenciaCategoriaCreateManyAndReturnArgs>(args?: SelectSubset<T, OcorrenciaCategoriaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OcorrenciaCategoria.
     * @param {OcorrenciaCategoriaDeleteArgs} args - Arguments to delete one OcorrenciaCategoria.
     * @example
     * // Delete one OcorrenciaCategoria
     * const OcorrenciaCategoria = await prisma.ocorrenciaCategoria.delete({
     *   where: {
     *     // ... filter to delete one OcorrenciaCategoria
     *   }
     * })
     * 
     */
    delete<T extends OcorrenciaCategoriaDeleteArgs>(args: SelectSubset<T, OcorrenciaCategoriaDeleteArgs<ExtArgs>>): Prisma__OcorrenciaCategoriaClient<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OcorrenciaCategoria.
     * @param {OcorrenciaCategoriaUpdateArgs} args - Arguments to update one OcorrenciaCategoria.
     * @example
     * // Update one OcorrenciaCategoria
     * const ocorrenciaCategoria = await prisma.ocorrenciaCategoria.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OcorrenciaCategoriaUpdateArgs>(args: SelectSubset<T, OcorrenciaCategoriaUpdateArgs<ExtArgs>>): Prisma__OcorrenciaCategoriaClient<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OcorrenciaCategorias.
     * @param {OcorrenciaCategoriaDeleteManyArgs} args - Arguments to filter OcorrenciaCategorias to delete.
     * @example
     * // Delete a few OcorrenciaCategorias
     * const { count } = await prisma.ocorrenciaCategoria.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OcorrenciaCategoriaDeleteManyArgs>(args?: SelectSubset<T, OcorrenciaCategoriaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OcorrenciaCategorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaCategoriaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OcorrenciaCategorias
     * const ocorrenciaCategoria = await prisma.ocorrenciaCategoria.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OcorrenciaCategoriaUpdateManyArgs>(args: SelectSubset<T, OcorrenciaCategoriaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OcorrenciaCategorias and returns the data updated in the database.
     * @param {OcorrenciaCategoriaUpdateManyAndReturnArgs} args - Arguments to update many OcorrenciaCategorias.
     * @example
     * // Update many OcorrenciaCategorias
     * const ocorrenciaCategoria = await prisma.ocorrenciaCategoria.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OcorrenciaCategorias and only return the `id`
     * const ocorrenciaCategoriaWithIdOnly = await prisma.ocorrenciaCategoria.updateManyAndReturn({
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
    updateManyAndReturn<T extends OcorrenciaCategoriaUpdateManyAndReturnArgs>(args: SelectSubset<T, OcorrenciaCategoriaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OcorrenciaCategoria.
     * @param {OcorrenciaCategoriaUpsertArgs} args - Arguments to update or create a OcorrenciaCategoria.
     * @example
     * // Update or create a OcorrenciaCategoria
     * const ocorrenciaCategoria = await prisma.ocorrenciaCategoria.upsert({
     *   create: {
     *     // ... data to create a OcorrenciaCategoria
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OcorrenciaCategoria we want to update
     *   }
     * })
     */
    upsert<T extends OcorrenciaCategoriaUpsertArgs>(args: SelectSubset<T, OcorrenciaCategoriaUpsertArgs<ExtArgs>>): Prisma__OcorrenciaCategoriaClient<$Result.GetResult<Prisma.$OcorrenciaCategoriaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OcorrenciaCategorias.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaCategoriaCountArgs} args - Arguments to filter OcorrenciaCategorias to count.
     * @example
     * // Count the number of OcorrenciaCategorias
     * const count = await prisma.ocorrenciaCategoria.count({
     *   where: {
     *     // ... the filter for the OcorrenciaCategorias we want to count
     *   }
     * })
    **/
    count<T extends OcorrenciaCategoriaCountArgs>(
      args?: Subset<T, OcorrenciaCategoriaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OcorrenciaCategoriaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OcorrenciaCategoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaCategoriaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OcorrenciaCategoriaAggregateArgs>(args: Subset<T, OcorrenciaCategoriaAggregateArgs>): Prisma.PrismaPromise<GetOcorrenciaCategoriaAggregateType<T>>

    /**
     * Group by OcorrenciaCategoria.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OcorrenciaCategoriaGroupByArgs} args - Group by arguments.
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
      T extends OcorrenciaCategoriaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OcorrenciaCategoriaGroupByArgs['orderBy'] }
        : { orderBy?: OcorrenciaCategoriaGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OcorrenciaCategoriaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOcorrenciaCategoriaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OcorrenciaCategoria model
   */
  readonly fields: OcorrenciaCategoriaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OcorrenciaCategoria.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OcorrenciaCategoriaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the OcorrenciaCategoria model
   */
  interface OcorrenciaCategoriaFieldRefs {
    readonly id: FieldRef<"OcorrenciaCategoria", 'String'>
    readonly nome: FieldRef<"OcorrenciaCategoria", 'String'>
    readonly createdAt: FieldRef<"OcorrenciaCategoria", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OcorrenciaCategoria findUnique
   */
  export type OcorrenciaCategoriaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * Filter, which OcorrenciaCategoria to fetch.
     */
    where: OcorrenciaCategoriaWhereUniqueInput
  }

  /**
   * OcorrenciaCategoria findUniqueOrThrow
   */
  export type OcorrenciaCategoriaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * Filter, which OcorrenciaCategoria to fetch.
     */
    where: OcorrenciaCategoriaWhereUniqueInput
  }

  /**
   * OcorrenciaCategoria findFirst
   */
  export type OcorrenciaCategoriaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * Filter, which OcorrenciaCategoria to fetch.
     */
    where?: OcorrenciaCategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OcorrenciaCategorias to fetch.
     */
    orderBy?: OcorrenciaCategoriaOrderByWithRelationInput | OcorrenciaCategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OcorrenciaCategorias.
     */
    cursor?: OcorrenciaCategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OcorrenciaCategorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OcorrenciaCategorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OcorrenciaCategorias.
     */
    distinct?: OcorrenciaCategoriaScalarFieldEnum | OcorrenciaCategoriaScalarFieldEnum[]
  }

  /**
   * OcorrenciaCategoria findFirstOrThrow
   */
  export type OcorrenciaCategoriaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * Filter, which OcorrenciaCategoria to fetch.
     */
    where?: OcorrenciaCategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OcorrenciaCategorias to fetch.
     */
    orderBy?: OcorrenciaCategoriaOrderByWithRelationInput | OcorrenciaCategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OcorrenciaCategorias.
     */
    cursor?: OcorrenciaCategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OcorrenciaCategorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OcorrenciaCategorias.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OcorrenciaCategorias.
     */
    distinct?: OcorrenciaCategoriaScalarFieldEnum | OcorrenciaCategoriaScalarFieldEnum[]
  }

  /**
   * OcorrenciaCategoria findMany
   */
  export type OcorrenciaCategoriaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * Filter, which OcorrenciaCategorias to fetch.
     */
    where?: OcorrenciaCategoriaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OcorrenciaCategorias to fetch.
     */
    orderBy?: OcorrenciaCategoriaOrderByWithRelationInput | OcorrenciaCategoriaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OcorrenciaCategorias.
     */
    cursor?: OcorrenciaCategoriaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OcorrenciaCategorias from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OcorrenciaCategorias.
     */
    skip?: number
    distinct?: OcorrenciaCategoriaScalarFieldEnum | OcorrenciaCategoriaScalarFieldEnum[]
  }

  /**
   * OcorrenciaCategoria create
   */
  export type OcorrenciaCategoriaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * The data needed to create a OcorrenciaCategoria.
     */
    data: XOR<OcorrenciaCategoriaCreateInput, OcorrenciaCategoriaUncheckedCreateInput>
  }

  /**
   * OcorrenciaCategoria createMany
   */
  export type OcorrenciaCategoriaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OcorrenciaCategorias.
     */
    data: OcorrenciaCategoriaCreateManyInput | OcorrenciaCategoriaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OcorrenciaCategoria createManyAndReturn
   */
  export type OcorrenciaCategoriaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * The data used to create many OcorrenciaCategorias.
     */
    data: OcorrenciaCategoriaCreateManyInput | OcorrenciaCategoriaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OcorrenciaCategoria update
   */
  export type OcorrenciaCategoriaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * The data needed to update a OcorrenciaCategoria.
     */
    data: XOR<OcorrenciaCategoriaUpdateInput, OcorrenciaCategoriaUncheckedUpdateInput>
    /**
     * Choose, which OcorrenciaCategoria to update.
     */
    where: OcorrenciaCategoriaWhereUniqueInput
  }

  /**
   * OcorrenciaCategoria updateMany
   */
  export type OcorrenciaCategoriaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OcorrenciaCategorias.
     */
    data: XOR<OcorrenciaCategoriaUpdateManyMutationInput, OcorrenciaCategoriaUncheckedUpdateManyInput>
    /**
     * Filter which OcorrenciaCategorias to update
     */
    where?: OcorrenciaCategoriaWhereInput
    /**
     * Limit how many OcorrenciaCategorias to update.
     */
    limit?: number
  }

  /**
   * OcorrenciaCategoria updateManyAndReturn
   */
  export type OcorrenciaCategoriaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * The data used to update OcorrenciaCategorias.
     */
    data: XOR<OcorrenciaCategoriaUpdateManyMutationInput, OcorrenciaCategoriaUncheckedUpdateManyInput>
    /**
     * Filter which OcorrenciaCategorias to update
     */
    where?: OcorrenciaCategoriaWhereInput
    /**
     * Limit how many OcorrenciaCategorias to update.
     */
    limit?: number
  }

  /**
   * OcorrenciaCategoria upsert
   */
  export type OcorrenciaCategoriaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * The filter to search for the OcorrenciaCategoria to update in case it exists.
     */
    where: OcorrenciaCategoriaWhereUniqueInput
    /**
     * In case the OcorrenciaCategoria found by the `where` argument doesn't exist, create a new OcorrenciaCategoria with this data.
     */
    create: XOR<OcorrenciaCategoriaCreateInput, OcorrenciaCategoriaUncheckedCreateInput>
    /**
     * In case the OcorrenciaCategoria was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OcorrenciaCategoriaUpdateInput, OcorrenciaCategoriaUncheckedUpdateInput>
  }

  /**
   * OcorrenciaCategoria delete
   */
  export type OcorrenciaCategoriaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
    /**
     * Filter which OcorrenciaCategoria to delete.
     */
    where: OcorrenciaCategoriaWhereUniqueInput
  }

  /**
   * OcorrenciaCategoria deleteMany
   */
  export type OcorrenciaCategoriaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OcorrenciaCategorias to delete
     */
    where?: OcorrenciaCategoriaWhereInput
    /**
     * Limit how many OcorrenciaCategorias to delete.
     */
    limit?: number
  }

  /**
   * OcorrenciaCategoria without action
   */
  export type OcorrenciaCategoriaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OcorrenciaCategoria
     */
    select?: OcorrenciaCategoriaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OcorrenciaCategoria
     */
    omit?: OcorrenciaCategoriaOmit<ExtArgs> | null
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
    username: 'username',
    passwordHash: 'passwordHash',
    name: 'name',
    role: 'role',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const ConfiguracaoGlobalScalarFieldEnum: {
    id: 'id',
    chave: 'chave',
    valor: 'valor',
    descricao: 'descricao',
    updatedAt: 'updatedAt'
  };

  export type ConfiguracaoGlobalScalarFieldEnum = (typeof ConfiguracaoGlobalScalarFieldEnum)[keyof typeof ConfiguracaoGlobalScalarFieldEnum]


  export const AlaScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    ordem: 'ordem',
    ativa: 'ativa',
    createdAt: 'createdAt'
  };

  export type AlaScalarFieldEnum = (typeof AlaScalarFieldEnum)[keyof typeof AlaScalarFieldEnum]


  export const DistribAlaScalarFieldEnum: {
    id: 'id',
    modulo: 'modulo',
    alaId: 'alaId',
    internos: 'internos',
    dietas: 'dietas',
    updatedAt: 'updatedAt'
  };

  export type DistribAlaScalarFieldEnum = (typeof DistribAlaScalarFieldEnum)[keyof typeof DistribAlaScalarFieldEnum]


  export const OcorrenciaScalarFieldEnum: {
    id: 'id',
    titulo: 'titulo',
    categoria: 'categoria',
    icone: 'icone',
    texto: 'texto',
    servidor: 'servidor',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OcorrenciaScalarFieldEnum = (typeof OcorrenciaScalarFieldEnum)[keyof typeof OcorrenciaScalarFieldEnum]


  export const OcorrenciaCategoriaScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    createdAt: 'createdAt'
  };

  export type OcorrenciaCategoriaScalarFieldEnum = (typeof OcorrenciaCategoriaScalarFieldEnum)[keyof typeof OcorrenciaCategoriaScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Modulo'
   */
  export type EnumModuloFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Modulo'>
    


  /**
   * Reference to a field of type 'Modulo[]'
   */
  export type ListEnumModuloFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Modulo[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    active?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    active?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    active?: SortOrder
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
    username?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    active?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type ConfiguracaoGlobalWhereInput = {
    AND?: ConfiguracaoGlobalWhereInput | ConfiguracaoGlobalWhereInput[]
    OR?: ConfiguracaoGlobalWhereInput[]
    NOT?: ConfiguracaoGlobalWhereInput | ConfiguracaoGlobalWhereInput[]
    id?: StringFilter<"ConfiguracaoGlobal"> | string
    chave?: StringFilter<"ConfiguracaoGlobal"> | string
    valor?: StringFilter<"ConfiguracaoGlobal"> | string
    descricao?: StringNullableFilter<"ConfiguracaoGlobal"> | string | null
    updatedAt?: DateTimeFilter<"ConfiguracaoGlobal"> | Date | string
  }

  export type ConfiguracaoGlobalOrderByWithRelationInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type ConfiguracaoGlobalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    chave?: string
    AND?: ConfiguracaoGlobalWhereInput | ConfiguracaoGlobalWhereInput[]
    OR?: ConfiguracaoGlobalWhereInput[]
    NOT?: ConfiguracaoGlobalWhereInput | ConfiguracaoGlobalWhereInput[]
    valor?: StringFilter<"ConfiguracaoGlobal"> | string
    descricao?: StringNullableFilter<"ConfiguracaoGlobal"> | string | null
    updatedAt?: DateTimeFilter<"ConfiguracaoGlobal"> | Date | string
  }, "id" | "chave">

  export type ConfiguracaoGlobalOrderByWithAggregationInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: ConfiguracaoGlobalCountOrderByAggregateInput
    _max?: ConfiguracaoGlobalMaxOrderByAggregateInput
    _min?: ConfiguracaoGlobalMinOrderByAggregateInput
  }

  export type ConfiguracaoGlobalScalarWhereWithAggregatesInput = {
    AND?: ConfiguracaoGlobalScalarWhereWithAggregatesInput | ConfiguracaoGlobalScalarWhereWithAggregatesInput[]
    OR?: ConfiguracaoGlobalScalarWhereWithAggregatesInput[]
    NOT?: ConfiguracaoGlobalScalarWhereWithAggregatesInput | ConfiguracaoGlobalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConfiguracaoGlobal"> | string
    chave?: StringWithAggregatesFilter<"ConfiguracaoGlobal"> | string
    valor?: StringWithAggregatesFilter<"ConfiguracaoGlobal"> | string
    descricao?: StringNullableWithAggregatesFilter<"ConfiguracaoGlobal"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"ConfiguracaoGlobal"> | Date | string
  }

  export type AlaWhereInput = {
    AND?: AlaWhereInput | AlaWhereInput[]
    OR?: AlaWhereInput[]
    NOT?: AlaWhereInput | AlaWhereInput[]
    id?: StringFilter<"Ala"> | string
    nome?: StringFilter<"Ala"> | string
    ordem?: IntFilter<"Ala"> | number
    ativa?: BoolFilter<"Ala"> | boolean
    createdAt?: DateTimeFilter<"Ala"> | Date | string
    distribs?: DistribAlaListRelationFilter
  }

  export type AlaOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    ordem?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    distribs?: DistribAlaOrderByRelationAggregateInput
  }

  export type AlaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nome?: string
    AND?: AlaWhereInput | AlaWhereInput[]
    OR?: AlaWhereInput[]
    NOT?: AlaWhereInput | AlaWhereInput[]
    ordem?: IntFilter<"Ala"> | number
    ativa?: BoolFilter<"Ala"> | boolean
    createdAt?: DateTimeFilter<"Ala"> | Date | string
    distribs?: DistribAlaListRelationFilter
  }, "id" | "nome">

  export type AlaOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    ordem?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
    _count?: AlaCountOrderByAggregateInput
    _avg?: AlaAvgOrderByAggregateInput
    _max?: AlaMaxOrderByAggregateInput
    _min?: AlaMinOrderByAggregateInput
    _sum?: AlaSumOrderByAggregateInput
  }

  export type AlaScalarWhereWithAggregatesInput = {
    AND?: AlaScalarWhereWithAggregatesInput | AlaScalarWhereWithAggregatesInput[]
    OR?: AlaScalarWhereWithAggregatesInput[]
    NOT?: AlaScalarWhereWithAggregatesInput | AlaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ala"> | string
    nome?: StringWithAggregatesFilter<"Ala"> | string
    ordem?: IntWithAggregatesFilter<"Ala"> | number
    ativa?: BoolWithAggregatesFilter<"Ala"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Ala"> | Date | string
  }

  export type DistribAlaWhereInput = {
    AND?: DistribAlaWhereInput | DistribAlaWhereInput[]
    OR?: DistribAlaWhereInput[]
    NOT?: DistribAlaWhereInput | DistribAlaWhereInput[]
    id?: StringFilter<"DistribAla"> | string
    modulo?: EnumModuloFilter<"DistribAla"> | $Enums.Modulo
    alaId?: StringFilter<"DistribAla"> | string
    internos?: IntFilter<"DistribAla"> | number
    dietas?: IntFilter<"DistribAla"> | number
    updatedAt?: DateTimeFilter<"DistribAla"> | Date | string
    ala?: XOR<AlaScalarRelationFilter, AlaWhereInput>
  }

  export type DistribAlaOrderByWithRelationInput = {
    id?: SortOrder
    modulo?: SortOrder
    alaId?: SortOrder
    internos?: SortOrder
    dietas?: SortOrder
    updatedAt?: SortOrder
    ala?: AlaOrderByWithRelationInput
  }

  export type DistribAlaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    modulo_alaId?: DistribAlaModuloAlaIdCompoundUniqueInput
    AND?: DistribAlaWhereInput | DistribAlaWhereInput[]
    OR?: DistribAlaWhereInput[]
    NOT?: DistribAlaWhereInput | DistribAlaWhereInput[]
    modulo?: EnumModuloFilter<"DistribAla"> | $Enums.Modulo
    alaId?: StringFilter<"DistribAla"> | string
    internos?: IntFilter<"DistribAla"> | number
    dietas?: IntFilter<"DistribAla"> | number
    updatedAt?: DateTimeFilter<"DistribAla"> | Date | string
    ala?: XOR<AlaScalarRelationFilter, AlaWhereInput>
  }, "id" | "modulo_alaId">

  export type DistribAlaOrderByWithAggregationInput = {
    id?: SortOrder
    modulo?: SortOrder
    alaId?: SortOrder
    internos?: SortOrder
    dietas?: SortOrder
    updatedAt?: SortOrder
    _count?: DistribAlaCountOrderByAggregateInput
    _avg?: DistribAlaAvgOrderByAggregateInput
    _max?: DistribAlaMaxOrderByAggregateInput
    _min?: DistribAlaMinOrderByAggregateInput
    _sum?: DistribAlaSumOrderByAggregateInput
  }

  export type DistribAlaScalarWhereWithAggregatesInput = {
    AND?: DistribAlaScalarWhereWithAggregatesInput | DistribAlaScalarWhereWithAggregatesInput[]
    OR?: DistribAlaScalarWhereWithAggregatesInput[]
    NOT?: DistribAlaScalarWhereWithAggregatesInput | DistribAlaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DistribAla"> | string
    modulo?: EnumModuloWithAggregatesFilter<"DistribAla"> | $Enums.Modulo
    alaId?: StringWithAggregatesFilter<"DistribAla"> | string
    internos?: IntWithAggregatesFilter<"DistribAla"> | number
    dietas?: IntWithAggregatesFilter<"DistribAla"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"DistribAla"> | Date | string
  }

  export type OcorrenciaWhereInput = {
    AND?: OcorrenciaWhereInput | OcorrenciaWhereInput[]
    OR?: OcorrenciaWhereInput[]
    NOT?: OcorrenciaWhereInput | OcorrenciaWhereInput[]
    id?: StringFilter<"Ocorrencia"> | string
    titulo?: StringFilter<"Ocorrencia"> | string
    categoria?: StringFilter<"Ocorrencia"> | string
    icone?: StringFilter<"Ocorrencia"> | string
    texto?: StringFilter<"Ocorrencia"> | string
    servidor?: StringFilter<"Ocorrencia"> | string
    createdAt?: DateTimeFilter<"Ocorrencia"> | Date | string
    updatedAt?: DateTimeFilter<"Ocorrencia"> | Date | string
  }

  export type OcorrenciaOrderByWithRelationInput = {
    id?: SortOrder
    titulo?: SortOrder
    categoria?: SortOrder
    icone?: SortOrder
    texto?: SortOrder
    servidor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OcorrenciaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OcorrenciaWhereInput | OcorrenciaWhereInput[]
    OR?: OcorrenciaWhereInput[]
    NOT?: OcorrenciaWhereInput | OcorrenciaWhereInput[]
    titulo?: StringFilter<"Ocorrencia"> | string
    categoria?: StringFilter<"Ocorrencia"> | string
    icone?: StringFilter<"Ocorrencia"> | string
    texto?: StringFilter<"Ocorrencia"> | string
    servidor?: StringFilter<"Ocorrencia"> | string
    createdAt?: DateTimeFilter<"Ocorrencia"> | Date | string
    updatedAt?: DateTimeFilter<"Ocorrencia"> | Date | string
  }, "id">

  export type OcorrenciaOrderByWithAggregationInput = {
    id?: SortOrder
    titulo?: SortOrder
    categoria?: SortOrder
    icone?: SortOrder
    texto?: SortOrder
    servidor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OcorrenciaCountOrderByAggregateInput
    _max?: OcorrenciaMaxOrderByAggregateInput
    _min?: OcorrenciaMinOrderByAggregateInput
  }

  export type OcorrenciaScalarWhereWithAggregatesInput = {
    AND?: OcorrenciaScalarWhereWithAggregatesInput | OcorrenciaScalarWhereWithAggregatesInput[]
    OR?: OcorrenciaScalarWhereWithAggregatesInput[]
    NOT?: OcorrenciaScalarWhereWithAggregatesInput | OcorrenciaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ocorrencia"> | string
    titulo?: StringWithAggregatesFilter<"Ocorrencia"> | string
    categoria?: StringWithAggregatesFilter<"Ocorrencia"> | string
    icone?: StringWithAggregatesFilter<"Ocorrencia"> | string
    texto?: StringWithAggregatesFilter<"Ocorrencia"> | string
    servidor?: StringWithAggregatesFilter<"Ocorrencia"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Ocorrencia"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Ocorrencia"> | Date | string
  }

  export type OcorrenciaCategoriaWhereInput = {
    AND?: OcorrenciaCategoriaWhereInput | OcorrenciaCategoriaWhereInput[]
    OR?: OcorrenciaCategoriaWhereInput[]
    NOT?: OcorrenciaCategoriaWhereInput | OcorrenciaCategoriaWhereInput[]
    id?: StringFilter<"OcorrenciaCategoria"> | string
    nome?: StringFilter<"OcorrenciaCategoria"> | string
    createdAt?: DateTimeFilter<"OcorrenciaCategoria"> | Date | string
  }

  export type OcorrenciaCategoriaOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
  }

  export type OcorrenciaCategoriaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    nome?: string
    AND?: OcorrenciaCategoriaWhereInput | OcorrenciaCategoriaWhereInput[]
    OR?: OcorrenciaCategoriaWhereInput[]
    NOT?: OcorrenciaCategoriaWhereInput | OcorrenciaCategoriaWhereInput[]
    createdAt?: DateTimeFilter<"OcorrenciaCategoria"> | Date | string
  }, "id" | "nome">

  export type OcorrenciaCategoriaOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
    _count?: OcorrenciaCategoriaCountOrderByAggregateInput
    _max?: OcorrenciaCategoriaMaxOrderByAggregateInput
    _min?: OcorrenciaCategoriaMinOrderByAggregateInput
  }

  export type OcorrenciaCategoriaScalarWhereWithAggregatesInput = {
    AND?: OcorrenciaCategoriaScalarWhereWithAggregatesInput | OcorrenciaCategoriaScalarWhereWithAggregatesInput[]
    OR?: OcorrenciaCategoriaScalarWhereWithAggregatesInput[]
    NOT?: OcorrenciaCategoriaScalarWhereWithAggregatesInput | OcorrenciaCategoriaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OcorrenciaCategoria"> | string
    nome?: StringWithAggregatesFilter<"OcorrenciaCategoria"> | string
    createdAt?: DateTimeWithAggregatesFilter<"OcorrenciaCategoria"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    passwordHash: string
    name: string
    role?: $Enums.Role
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    passwordHash: string
    name: string
    role?: $Enums.Role
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    passwordHash: string
    name: string
    role?: $Enums.Role
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracaoGlobalCreateInput = {
    id?: string
    chave: string
    valor: string
    descricao?: string | null
    updatedAt?: Date | string
  }

  export type ConfiguracaoGlobalUncheckedCreateInput = {
    id?: string
    chave: string
    valor: string
    descricao?: string | null
    updatedAt?: Date | string
  }

  export type ConfiguracaoGlobalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracaoGlobalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracaoGlobalCreateManyInput = {
    id?: string
    chave: string
    valor: string
    descricao?: string | null
    updatedAt?: Date | string
  }

  export type ConfiguracaoGlobalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfiguracaoGlobalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    chave?: StringFieldUpdateOperationsInput | string
    valor?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlaCreateInput = {
    id?: string
    nome: string
    ordem?: number
    ativa?: boolean
    createdAt?: Date | string
    distribs?: DistribAlaCreateNestedManyWithoutAlaInput
  }

  export type AlaUncheckedCreateInput = {
    id?: string
    nome: string
    ordem?: number
    ativa?: boolean
    createdAt?: Date | string
    distribs?: DistribAlaUncheckedCreateNestedManyWithoutAlaInput
  }

  export type AlaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    distribs?: DistribAlaUpdateManyWithoutAlaNestedInput
  }

  export type AlaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    distribs?: DistribAlaUncheckedUpdateManyWithoutAlaNestedInput
  }

  export type AlaCreateManyInput = {
    id?: string
    nome: string
    ordem?: number
    ativa?: boolean
    createdAt?: Date | string
  }

  export type AlaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DistribAlaCreateInput = {
    id?: string
    modulo: $Enums.Modulo
    internos?: number
    dietas?: number
    updatedAt?: Date | string
    ala: AlaCreateNestedOneWithoutDistribsInput
  }

  export type DistribAlaUncheckedCreateInput = {
    id?: string
    modulo: $Enums.Modulo
    alaId: string
    internos?: number
    dietas?: number
    updatedAt?: Date | string
  }

  export type DistribAlaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    modulo?: EnumModuloFieldUpdateOperationsInput | $Enums.Modulo
    internos?: IntFieldUpdateOperationsInput | number
    dietas?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ala?: AlaUpdateOneRequiredWithoutDistribsNestedInput
  }

  export type DistribAlaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    modulo?: EnumModuloFieldUpdateOperationsInput | $Enums.Modulo
    alaId?: StringFieldUpdateOperationsInput | string
    internos?: IntFieldUpdateOperationsInput | number
    dietas?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DistribAlaCreateManyInput = {
    id?: string
    modulo: $Enums.Modulo
    alaId: string
    internos?: number
    dietas?: number
    updatedAt?: Date | string
  }

  export type DistribAlaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    modulo?: EnumModuloFieldUpdateOperationsInput | $Enums.Modulo
    internos?: IntFieldUpdateOperationsInput | number
    dietas?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DistribAlaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    modulo?: EnumModuloFieldUpdateOperationsInput | $Enums.Modulo
    alaId?: StringFieldUpdateOperationsInput | string
    internos?: IntFieldUpdateOperationsInput | number
    dietas?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcorrenciaCreateInput = {
    id?: string
    titulo: string
    categoria: string
    icone?: string
    texto: string
    servidor: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OcorrenciaUncheckedCreateInput = {
    id?: string
    titulo: string
    categoria: string
    icone?: string
    texto: string
    servidor: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OcorrenciaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    icone?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    servidor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcorrenciaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    icone?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    servidor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcorrenciaCreateManyInput = {
    id?: string
    titulo: string
    categoria: string
    icone?: string
    texto: string
    servidor: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OcorrenciaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    icone?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    servidor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcorrenciaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    titulo?: StringFieldUpdateOperationsInput | string
    categoria?: StringFieldUpdateOperationsInput | string
    icone?: StringFieldUpdateOperationsInput | string
    texto?: StringFieldUpdateOperationsInput | string
    servidor?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcorrenciaCategoriaCreateInput = {
    id?: string
    nome: string
    createdAt?: Date | string
  }

  export type OcorrenciaCategoriaUncheckedCreateInput = {
    id?: string
    nome: string
    createdAt?: Date | string
  }

  export type OcorrenciaCategoriaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcorrenciaCategoriaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcorrenciaCategoriaCreateManyInput = {
    id?: string
    nome: string
    createdAt?: Date | string
  }

  export type OcorrenciaCategoriaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OcorrenciaCategoriaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    active?: SortOrder
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

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
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

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type ConfiguracaoGlobalCountOrderByAggregateInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfiguracaoGlobalMaxOrderByAggregateInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConfiguracaoGlobalMinOrderByAggregateInput = {
    id?: SortOrder
    chave?: SortOrder
    valor?: SortOrder
    descricao?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DistribAlaListRelationFilter = {
    every?: DistribAlaWhereInput
    some?: DistribAlaWhereInput
    none?: DistribAlaWhereInput
  }

  export type DistribAlaOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlaCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    ordem?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
  }

  export type AlaAvgOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type AlaMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    ordem?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
  }

  export type AlaMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    ordem?: SortOrder
    ativa?: SortOrder
    createdAt?: SortOrder
  }

  export type AlaSumOrderByAggregateInput = {
    ordem?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumModuloFilter<$PrismaModel = never> = {
    equals?: $Enums.Modulo | EnumModuloFieldRefInput<$PrismaModel>
    in?: $Enums.Modulo[] | ListEnumModuloFieldRefInput<$PrismaModel>
    notIn?: $Enums.Modulo[] | ListEnumModuloFieldRefInput<$PrismaModel>
    not?: NestedEnumModuloFilter<$PrismaModel> | $Enums.Modulo
  }

  export type AlaScalarRelationFilter = {
    is?: AlaWhereInput
    isNot?: AlaWhereInput
  }

  export type DistribAlaModuloAlaIdCompoundUniqueInput = {
    modulo: $Enums.Modulo
    alaId: string
  }

  export type DistribAlaCountOrderByAggregateInput = {
    id?: SortOrder
    modulo?: SortOrder
    alaId?: SortOrder
    internos?: SortOrder
    dietas?: SortOrder
    updatedAt?: SortOrder
  }

  export type DistribAlaAvgOrderByAggregateInput = {
    internos?: SortOrder
    dietas?: SortOrder
  }

  export type DistribAlaMaxOrderByAggregateInput = {
    id?: SortOrder
    modulo?: SortOrder
    alaId?: SortOrder
    internos?: SortOrder
    dietas?: SortOrder
    updatedAt?: SortOrder
  }

  export type DistribAlaMinOrderByAggregateInput = {
    id?: SortOrder
    modulo?: SortOrder
    alaId?: SortOrder
    internos?: SortOrder
    dietas?: SortOrder
    updatedAt?: SortOrder
  }

  export type DistribAlaSumOrderByAggregateInput = {
    internos?: SortOrder
    dietas?: SortOrder
  }

  export type EnumModuloWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Modulo | EnumModuloFieldRefInput<$PrismaModel>
    in?: $Enums.Modulo[] | ListEnumModuloFieldRefInput<$PrismaModel>
    notIn?: $Enums.Modulo[] | ListEnumModuloFieldRefInput<$PrismaModel>
    not?: NestedEnumModuloWithAggregatesFilter<$PrismaModel> | $Enums.Modulo
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumModuloFilter<$PrismaModel>
    _max?: NestedEnumModuloFilter<$PrismaModel>
  }

  export type OcorrenciaCountOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    categoria?: SortOrder
    icone?: SortOrder
    texto?: SortOrder
    servidor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OcorrenciaMaxOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    categoria?: SortOrder
    icone?: SortOrder
    texto?: SortOrder
    servidor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OcorrenciaMinOrderByAggregateInput = {
    id?: SortOrder
    titulo?: SortOrder
    categoria?: SortOrder
    icone?: SortOrder
    texto?: SortOrder
    servidor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OcorrenciaCategoriaCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
  }

  export type OcorrenciaCategoriaMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
  }

  export type OcorrenciaCategoriaMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    createdAt?: SortOrder
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type DistribAlaCreateNestedManyWithoutAlaInput = {
    create?: XOR<DistribAlaCreateWithoutAlaInput, DistribAlaUncheckedCreateWithoutAlaInput> | DistribAlaCreateWithoutAlaInput[] | DistribAlaUncheckedCreateWithoutAlaInput[]
    connectOrCreate?: DistribAlaCreateOrConnectWithoutAlaInput | DistribAlaCreateOrConnectWithoutAlaInput[]
    createMany?: DistribAlaCreateManyAlaInputEnvelope
    connect?: DistribAlaWhereUniqueInput | DistribAlaWhereUniqueInput[]
  }

  export type DistribAlaUncheckedCreateNestedManyWithoutAlaInput = {
    create?: XOR<DistribAlaCreateWithoutAlaInput, DistribAlaUncheckedCreateWithoutAlaInput> | DistribAlaCreateWithoutAlaInput[] | DistribAlaUncheckedCreateWithoutAlaInput[]
    connectOrCreate?: DistribAlaCreateOrConnectWithoutAlaInput | DistribAlaCreateOrConnectWithoutAlaInput[]
    createMany?: DistribAlaCreateManyAlaInputEnvelope
    connect?: DistribAlaWhereUniqueInput | DistribAlaWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DistribAlaUpdateManyWithoutAlaNestedInput = {
    create?: XOR<DistribAlaCreateWithoutAlaInput, DistribAlaUncheckedCreateWithoutAlaInput> | DistribAlaCreateWithoutAlaInput[] | DistribAlaUncheckedCreateWithoutAlaInput[]
    connectOrCreate?: DistribAlaCreateOrConnectWithoutAlaInput | DistribAlaCreateOrConnectWithoutAlaInput[]
    upsert?: DistribAlaUpsertWithWhereUniqueWithoutAlaInput | DistribAlaUpsertWithWhereUniqueWithoutAlaInput[]
    createMany?: DistribAlaCreateManyAlaInputEnvelope
    set?: DistribAlaWhereUniqueInput | DistribAlaWhereUniqueInput[]
    disconnect?: DistribAlaWhereUniqueInput | DistribAlaWhereUniqueInput[]
    delete?: DistribAlaWhereUniqueInput | DistribAlaWhereUniqueInput[]
    connect?: DistribAlaWhereUniqueInput | DistribAlaWhereUniqueInput[]
    update?: DistribAlaUpdateWithWhereUniqueWithoutAlaInput | DistribAlaUpdateWithWhereUniqueWithoutAlaInput[]
    updateMany?: DistribAlaUpdateManyWithWhereWithoutAlaInput | DistribAlaUpdateManyWithWhereWithoutAlaInput[]
    deleteMany?: DistribAlaScalarWhereInput | DistribAlaScalarWhereInput[]
  }

  export type DistribAlaUncheckedUpdateManyWithoutAlaNestedInput = {
    create?: XOR<DistribAlaCreateWithoutAlaInput, DistribAlaUncheckedCreateWithoutAlaInput> | DistribAlaCreateWithoutAlaInput[] | DistribAlaUncheckedCreateWithoutAlaInput[]
    connectOrCreate?: DistribAlaCreateOrConnectWithoutAlaInput | DistribAlaCreateOrConnectWithoutAlaInput[]
    upsert?: DistribAlaUpsertWithWhereUniqueWithoutAlaInput | DistribAlaUpsertWithWhereUniqueWithoutAlaInput[]
    createMany?: DistribAlaCreateManyAlaInputEnvelope
    set?: DistribAlaWhereUniqueInput | DistribAlaWhereUniqueInput[]
    disconnect?: DistribAlaWhereUniqueInput | DistribAlaWhereUniqueInput[]
    delete?: DistribAlaWhereUniqueInput | DistribAlaWhereUniqueInput[]
    connect?: DistribAlaWhereUniqueInput | DistribAlaWhereUniqueInput[]
    update?: DistribAlaUpdateWithWhereUniqueWithoutAlaInput | DistribAlaUpdateWithWhereUniqueWithoutAlaInput[]
    updateMany?: DistribAlaUpdateManyWithWhereWithoutAlaInput | DistribAlaUpdateManyWithWhereWithoutAlaInput[]
    deleteMany?: DistribAlaScalarWhereInput | DistribAlaScalarWhereInput[]
  }

  export type AlaCreateNestedOneWithoutDistribsInput = {
    create?: XOR<AlaCreateWithoutDistribsInput, AlaUncheckedCreateWithoutDistribsInput>
    connectOrCreate?: AlaCreateOrConnectWithoutDistribsInput
    connect?: AlaWhereUniqueInput
  }

  export type EnumModuloFieldUpdateOperationsInput = {
    set?: $Enums.Modulo
  }

  export type AlaUpdateOneRequiredWithoutDistribsNestedInput = {
    create?: XOR<AlaCreateWithoutDistribsInput, AlaUncheckedCreateWithoutDistribsInput>
    connectOrCreate?: AlaCreateOrConnectWithoutDistribsInput
    upsert?: AlaUpsertWithoutDistribsInput
    connect?: AlaWhereUniqueInput
    update?: XOR<XOR<AlaUpdateToOneWithWhereWithoutDistribsInput, AlaUpdateWithoutDistribsInput>, AlaUncheckedUpdateWithoutDistribsInput>
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

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumModuloFilter<$PrismaModel = never> = {
    equals?: $Enums.Modulo | EnumModuloFieldRefInput<$PrismaModel>
    in?: $Enums.Modulo[] | ListEnumModuloFieldRefInput<$PrismaModel>
    notIn?: $Enums.Modulo[] | ListEnumModuloFieldRefInput<$PrismaModel>
    not?: NestedEnumModuloFilter<$PrismaModel> | $Enums.Modulo
  }

  export type NestedEnumModuloWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Modulo | EnumModuloFieldRefInput<$PrismaModel>
    in?: $Enums.Modulo[] | ListEnumModuloFieldRefInput<$PrismaModel>
    notIn?: $Enums.Modulo[] | ListEnumModuloFieldRefInput<$PrismaModel>
    not?: NestedEnumModuloWithAggregatesFilter<$PrismaModel> | $Enums.Modulo
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumModuloFilter<$PrismaModel>
    _max?: NestedEnumModuloFilter<$PrismaModel>
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    username: string
    passwordHash: string
    name: string
    role?: $Enums.Role
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    username: string
    passwordHash: string
    name: string
    role?: $Enums.Role
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    username: string
    passwordHash: string
    name: string
    role?: $Enums.Role
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    username: string
    passwordHash: string
    name: string
    role?: $Enums.Role
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DistribAlaCreateWithoutAlaInput = {
    id?: string
    modulo: $Enums.Modulo
    internos?: number
    dietas?: number
    updatedAt?: Date | string
  }

  export type DistribAlaUncheckedCreateWithoutAlaInput = {
    id?: string
    modulo: $Enums.Modulo
    internos?: number
    dietas?: number
    updatedAt?: Date | string
  }

  export type DistribAlaCreateOrConnectWithoutAlaInput = {
    where: DistribAlaWhereUniqueInput
    create: XOR<DistribAlaCreateWithoutAlaInput, DistribAlaUncheckedCreateWithoutAlaInput>
  }

  export type DistribAlaCreateManyAlaInputEnvelope = {
    data: DistribAlaCreateManyAlaInput | DistribAlaCreateManyAlaInput[]
    skipDuplicates?: boolean
  }

  export type DistribAlaUpsertWithWhereUniqueWithoutAlaInput = {
    where: DistribAlaWhereUniqueInput
    update: XOR<DistribAlaUpdateWithoutAlaInput, DistribAlaUncheckedUpdateWithoutAlaInput>
    create: XOR<DistribAlaCreateWithoutAlaInput, DistribAlaUncheckedCreateWithoutAlaInput>
  }

  export type DistribAlaUpdateWithWhereUniqueWithoutAlaInput = {
    where: DistribAlaWhereUniqueInput
    data: XOR<DistribAlaUpdateWithoutAlaInput, DistribAlaUncheckedUpdateWithoutAlaInput>
  }

  export type DistribAlaUpdateManyWithWhereWithoutAlaInput = {
    where: DistribAlaScalarWhereInput
    data: XOR<DistribAlaUpdateManyMutationInput, DistribAlaUncheckedUpdateManyWithoutAlaInput>
  }

  export type DistribAlaScalarWhereInput = {
    AND?: DistribAlaScalarWhereInput | DistribAlaScalarWhereInput[]
    OR?: DistribAlaScalarWhereInput[]
    NOT?: DistribAlaScalarWhereInput | DistribAlaScalarWhereInput[]
    id?: StringFilter<"DistribAla"> | string
    modulo?: EnumModuloFilter<"DistribAla"> | $Enums.Modulo
    alaId?: StringFilter<"DistribAla"> | string
    internos?: IntFilter<"DistribAla"> | number
    dietas?: IntFilter<"DistribAla"> | number
    updatedAt?: DateTimeFilter<"DistribAla"> | Date | string
  }

  export type AlaCreateWithoutDistribsInput = {
    id?: string
    nome: string
    ordem?: number
    ativa?: boolean
    createdAt?: Date | string
  }

  export type AlaUncheckedCreateWithoutDistribsInput = {
    id?: string
    nome: string
    ordem?: number
    ativa?: boolean
    createdAt?: Date | string
  }

  export type AlaCreateOrConnectWithoutDistribsInput = {
    where: AlaWhereUniqueInput
    create: XOR<AlaCreateWithoutDistribsInput, AlaUncheckedCreateWithoutDistribsInput>
  }

  export type AlaUpsertWithoutDistribsInput = {
    update: XOR<AlaUpdateWithoutDistribsInput, AlaUncheckedUpdateWithoutDistribsInput>
    create: XOR<AlaCreateWithoutDistribsInput, AlaUncheckedCreateWithoutDistribsInput>
    where?: AlaWhereInput
  }

  export type AlaUpdateToOneWithWhereWithoutDistribsInput = {
    where?: AlaWhereInput
    data: XOR<AlaUpdateWithoutDistribsInput, AlaUncheckedUpdateWithoutDistribsInput>
  }

  export type AlaUpdateWithoutDistribsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlaUncheckedUpdateWithoutDistribsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nome?: StringFieldUpdateOperationsInput | string
    ordem?: IntFieldUpdateOperationsInput | number
    ativa?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DistribAlaCreateManyAlaInput = {
    id?: string
    modulo: $Enums.Modulo
    internos?: number
    dietas?: number
    updatedAt?: Date | string
  }

  export type DistribAlaUpdateWithoutAlaInput = {
    id?: StringFieldUpdateOperationsInput | string
    modulo?: EnumModuloFieldUpdateOperationsInput | $Enums.Modulo
    internos?: IntFieldUpdateOperationsInput | number
    dietas?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DistribAlaUncheckedUpdateWithoutAlaInput = {
    id?: StringFieldUpdateOperationsInput | string
    modulo?: EnumModuloFieldUpdateOperationsInput | $Enums.Modulo
    internos?: IntFieldUpdateOperationsInput | number
    dietas?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DistribAlaUncheckedUpdateManyWithoutAlaInput = {
    id?: StringFieldUpdateOperationsInput | string
    modulo?: EnumModuloFieldUpdateOperationsInput | $Enums.Modulo
    internos?: IntFieldUpdateOperationsInput | number
    dietas?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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