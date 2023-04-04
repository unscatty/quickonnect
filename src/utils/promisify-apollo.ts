import {
  ApolloQueryResult,
  DocumentNode,
  FetchResult,
  OperationVariables,
} from '@apollo/client'

import {
  UseMutationReturn,
  UseQueryOptions,
  UseQueryReturn,
} from '@vue/apollo-composable'

export const promisifyUseQuery = <
  TResult,
  TVariables extends OperationVariables | null | undefined
>(
  queryResult: UseQueryReturn<TResult, TVariables>
): UseQueryReturn<TResult, TVariables> & {
  promisifiedResult: () => Promise<ApolloQueryResult<TResult>>
} => {
  const { onResult, onError } = queryResult

  const promisifiedResult = () =>
    new Promise<ApolloQueryResult<TResult>>((resolve, reject) => {
      onResult(resolve)

      onError(reject)
    })

  return {
    ...queryResult,
    promisifiedResult,
  }
}
/* eslint-disable no-unused-vars */
export type UseLazyQueryReturn<TResult, TVariables> = {
  load: (
    document?: DocumentNode,
    variables?: TVariables,
    options?: UseQueryOptions
  ) => void
  result: import('vue-demi').Ref<TResult | undefined>
  loading: import('vue-demi').Ref<boolean>
  networkStatus: import('vue-demi').Ref<number | undefined>
  error: import('vue-demi').Ref<
    import('@apollo/client/errors').ApolloError | null
  >
  start: () => void
  stop: () => void
  restart: () => void
  forceDisabled: import('vue-demi').Ref<boolean>
  document: import('vue-demi').Ref<DocumentNode>
  variables: import('vue-demi').Ref<TVariables | undefined>
  options:
    | UseQueryOptions<TResult, TVariables>
    | import('vue-demi').Ref<UseQueryOptions<TResult, TVariables>>
  query: import('vue-demi').Ref<
    | import('@apollo/client/core').ObservableQuery<TResult, TVariables>
    | null
    | undefined
  >
  refetch: (
    variables?: TVariables | undefined
  ) =>
    | Promise<import('@apollo/client/core').ApolloQueryResult<TResult>>
    | undefined
  fetchMore: (
    options: import('@apollo/client/core').FetchMoreQueryOptions<
      TVariables,
      TResult
    > &
      import('@apollo/client/core').FetchMoreOptions<TResult, TVariables>
  ) =>
    | Promise<import('@apollo/client/core').ApolloQueryResult<TResult>>
    | undefined
  subscribeToMore: <
    TSubscriptionVariables = import('@apollo/client/core').OperationVariables,
    TSubscriptionData = TResult
  >(
    options:
      | import('@apollo/client/core').SubscribeToMoreOptions<
          TResult,
          TSubscriptionVariables,
          TSubscriptionData
        >
      | import('vue-demi').Ref<
          import('@apollo/client/core').SubscribeToMoreOptions<
            TResult,
            TSubscriptionVariables,
            TSubscriptionData
          >
        >
      | import('@vue/apollo-composable/dist/util/ReactiveFunction').ReactiveFunction<
          import('@apollo/client/core').SubscribeToMoreOptions<
            TResult,
            TSubscriptionVariables,
            TSubscriptionData
          >
        >
  ) => void
  onResult: (
    fn: (
      param: import('@apollo/client/core').ApolloQueryResult<TResult>
    ) => void
  ) => {
    off: () => void
  }
  onError: (
    fn: (param: import('@apollo/client/errors').ApolloError) => void
  ) => {
    off: () => void
  }
}
/* eslint-enable no-unused-vars */

export const promisifyUseLazyQuery = <TResult = any, TVariables = any>(
  lazyQueryResult: UseLazyQueryReturn<TResult, TVariables>
): UseLazyQueryReturn<TResult, TVariables> & {
  promisifiedResult: () => Promise<ApolloQueryResult<TResult>>
} => {
  const { onResult, onError, loading } = lazyQueryResult

  const promisifiedResult = () =>
    new Promise<ApolloQueryResult<TResult>>((resolve, reject) => {
      onResult((result) => {
        // Wait for data to arrive
        if (!loading.value) {
          resolve(result as ApolloQueryResult<TResult>)
        }
      })

      onError(reject)
    })

  return {
    ...lazyQueryResult,
    promisifiedResult,
  }
}

export const promisifyUseMutation = <
  TResult = any,
  TVariables extends OperationVariables = OperationVariables
>(
  mutationResult: UseMutationReturn<TResult, TVariables>
): UseMutationReturn<TResult, TVariables> & {
  promisifiedResult: () => Promise<FetchResult<TResult>>
} => {
  const { onDone, onError } = mutationResult

  const promisifiedResult = () =>
    new Promise<FetchResult<TResult>>((resolve, reject) => {
      onDone((result) => {
        resolve(result)
      })

      onError(reject)
    })

  return {
    ...mutationResult,
    promisifiedResult,
  }
}
