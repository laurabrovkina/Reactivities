 declare module 'revalidate' {
  export function combineValidators(validators: Record<string, any>): (values: any) => any;
  export function isRequired(field: string | { message: string }): (value: any) => string | undefined;
  export function hasLengthGreaterThan(n: number): (options: { message: string }) => (value: any) => string | undefined;
  export function composeValidators(...validators: Array<(value: any) => any>): () => (value: any) => any;
}